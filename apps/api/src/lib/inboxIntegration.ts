import { readFile } from "fs/promises";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import type { DetectedSubscriptionCandidate, InboxSyncResult } from "../types";

interface SeedInboxMessage {
  id: string;
  from: string;
  subject: string;
  date: string;
  text: string;
}

const knownMerchants = [
  "Netflix",
  "Spotify",
  "Adobe",
  "Notion",
  "Prime Video",
  "NewsPlus",
  "MasterClass",
  "CloudAI",
  "GymPro",
  "FoodBox",
];

const amountPattern = /(USD\s*)?\$\s*([0-9]+(?:\.[0-9]{2})?)/i;
const amountFallbackPattern =
  /(?:amount|invoice|charge|total|renewal|subscription|usd)\D{0,20}([0-9]+(?:\.[0-9]{2})?)/i;
const fallbackCancellationEmail = "billing@merchant.example";

const toSafeNumber = (value: string): number => Number(Number(value).toFixed(2));

const extractMerchant = (source: string): string => {
  for (const merchant of knownMerchants) {
    if (new RegExp(merchant.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "i").test(source)) {
      return merchant;
    }
  }

  const trimmed = source.trim();
  if (!trimmed) {
    return "Unknown Merchant";
  }

  const cleaned = trimmed
    .replace(/<[^>]+>/g, " ")
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.split(" ").slice(0, 3).join(" ") || "Unknown Merchant";
};

const extractCancellationEmail = (text: string): string | null => {
  const matches = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi);
  if (!matches || matches.length === 0) {
    return null;
  }

  const candidate = matches.find((email) => /cancel|support|billing/i.test(email));
  return (candidate ?? matches[0] ?? "").toLowerCase() || null;
};

const toCandidate = (message: {
  id: string;
  from: string;
  subject: string;
  date: string;
  text: string;
}): DetectedSubscriptionCandidate | null => {
  const haystack = `${message.subject}\n${message.from}\n${message.text}`;

  if (/cancellation request for/i.test(message.subject)) {
    return null;
  }

  if (!/subscription|renew|receipt|invoice|trial/i.test(haystack)) {
    return null;
  }

  const amountMatch = haystack.match(amountPattern);
  const fallbackAmountMatch = haystack.match(amountFallbackPattern);
  const resolvedAmountRaw = amountMatch?.[2] ?? fallbackAmountMatch?.[1] ?? null;
  if (!resolvedAmountRaw) {
    return null;
  }

  const amount = toSafeNumber(resolvedAmountRaw);
  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  const merchant = extractMerchant(`${message.subject} ${message.from}`);
  const cancellationEmail =
    extractCancellationEmail(haystack) ??
    `${merchant.toLowerCase().replace(/\s+/g, "")}.support@example.com`;

  return {
    merchant,
    amount,
    detectedAt: new Date(message.date).toISOString(),
    sourceMessageId: message.id,
    sourceSubject: message.subject,
    sourceFrom: message.from,
    cancellationEmail,
  };
};

const dedupeCandidates = (candidates: DetectedSubscriptionCandidate[]): DetectedSubscriptionCandidate[] => {
  const map = new Map<string, DetectedSubscriptionCandidate>();

  for (const candidate of candidates) {
    const key = `${candidate.merchant.toLowerCase()}|${candidate.amount.toFixed(2)}`;
    const existing = map.get(key);
    if (!existing || Date.parse(candidate.detectedAt) > Date.parse(existing.detectedAt)) {
      map.set(key, candidate);
    }
  }

  return [...map.values()];
};

const isImapConfigured = (): boolean =>
  Boolean(process.env.INBOX_IMAP_HOST && process.env.INBOX_IMAP_USER && process.env.INBOX_IMAP_PASS);

const readSeedInbox = async (maxMessages: number): Promise<SeedInboxMessage[]> => {
  const seedPath = process.env.INBOX_SEED_FILE ?? "src/data/inbox-seed.json";
  const content = await readFile(seedPath, "utf8");
  const rows = JSON.parse(content) as SeedInboxMessage[];
  return rows.slice(0, Math.max(1, maxMessages));
};

const fetchImapMessages = async (maxMessages: number): Promise<SeedInboxMessage[]> => {
  const port = Number(process.env.INBOX_IMAP_PORT ?? 993);
  const secure = (process.env.INBOX_IMAP_SECURE ?? "true").toLowerCase() !== "false";
  const mailbox = process.env.INBOX_IMAP_MAILBOX ?? "INBOX";

  const client = new ImapFlow({
    host: process.env.INBOX_IMAP_HOST ?? "",
    port,
    secure,
    auth: {
      user: process.env.INBOX_IMAP_USER ?? "",
      pass: process.env.INBOX_IMAP_PASS ?? "",
    },
  });

  await client.connect();
  const lock = await client.getMailboxLock(mailbox);

  try {
    const uidsResult = await client.search({ all: true });
    const uids = Array.isArray(uidsResult) ? uidsResult : [];
    const selected = uids.slice(-Math.max(1, maxMessages));
    const output: SeedInboxMessage[] = [];

    for await (const message of client.fetch(selected, { uid: true, source: true, envelope: true, internalDate: true })) {
      const parsed = await simpleParser(message.source as Buffer);
      const parsedDate = parsed.date;
      const internalDate = message.internalDate;
      const normalizedInternalDate =
        internalDate instanceof Date
          ? internalDate.toISOString()
          : typeof internalDate === "string"
            ? new Date(internalDate).toISOString()
            : new Date().toISOString();
      const normalizedDate =
        parsedDate instanceof Date
          ? parsedDate.toISOString()
          : typeof parsedDate === "string"
            ? new Date(parsedDate).toISOString()
            : normalizedInternalDate;
      const parsedText = typeof parsed.text === "string"
        ? parsed.text
        : typeof parsed.html === "string"
          ? parsed.html
          : "";

      output.push({
        id: `<imap-${message.uid}>`,
        from: parsed.from?.text ?? message.envelope?.from?.map((fromRow) => fromRow.address || fromRow.name).join(", ") ?? "unknown@unknown.local",
        subject: parsed.subject ?? message.envelope?.subject ?? "(no subject)",
        date: normalizedDate,
        text: parsedText,
      });
    }

    return output;
  } finally {
    lock.release();
    await client.logout();
  }
};

export const syncInboxDetections = async (maxMessages = 50): Promise<InboxSyncResult & { candidates: DetectedSubscriptionCandidate[] }> => {
  const startedAt = new Date().toISOString();
  const errors: string[] = [];
  let source: InboxSyncResult["source"] = "seed-file";

  let messages: SeedInboxMessage[] = [];
  try {
    if (isImapConfigured()) {
      source = "imap";
      messages = await fetchImapMessages(maxMessages);
    } else {
      messages = await readSeedInbox(maxMessages);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown inbox sync error";
    errors.push(message);
  }

  const candidates = dedupeCandidates(
    messages
      .map((message) => toCandidate(message))
      .filter((candidate): candidate is DetectedSubscriptionCandidate => Boolean(candidate)),
  );

  return {
    source,
    startedAt,
    finishedAt: new Date().toISOString(),
    processedMessages: messages.length,
    importedCount: 0,
    detections: candidates,
    errors,
    candidates,
  };
};

export const buildCancellationTarget = (candidate: DetectedSubscriptionCandidate): string =>
  candidate.cancellationEmail ?? fallbackCancellationEmail;
