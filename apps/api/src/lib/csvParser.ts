import type { DetectedSubscriptionCandidate } from "../types";

interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
}

interface RecurringPattern {
  merchant: string;
  amount: number;
  dates: string[];
  confidence: number;
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
  "Apple",
  "Microsoft",
  "Slack",
  "Figma",
  "Dropbox",
  "Canva",
  "Disney+",
  "Hulu",
  "HBO",
  "YouTube Premium",
];

const extractMerchant = (description: string): string | null => {
  const normalized = description.toUpperCase();
  for (const merchant of knownMerchants) {
    if (normalized.includes(merchant.toUpperCase())) {
      return merchant;
    }
  }
  return null;
};

const detectRecurringPatterns = (transactions: ParsedTransaction[]): RecurringPattern[] => {
  const grouped = new Map<string, ParsedTransaction[]>();

  for (const txn of transactions) {
    const merchant = extractMerchant(txn.description);
    if (!merchant) continue;

    const key = `${merchant}|${txn.amount.toFixed(2)}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(txn);
  }

  const patterns: RecurringPattern[] = [];

  for (const [key, txns] of grouped.entries()) {
    if (txns.length < 2) continue;

    const [merchant, amountStr] = key.split("|");
    const amount = parseFloat(amountStr!);
    const dates = txns.map((t) => t.date).sort();

    // Calculate interval pattern
    const intervals: number[] = [];
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]!);
      const curr = new Date(dates[i]!);
      const daysDiff = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      intervals.push(daysDiff);
    }

    // Check for monthly (28-31 days) or other patterns
    const isMonthly = intervals.some((interval) => interval >= 25 && interval <= 35);
    const isWeekly = intervals.some((interval) => interval >= 6 && interval <= 8);
    const confidence =
      txns.length >= 3 && (isMonthly || isWeekly) ? Math.min(1, (txns.length - 1) * 0.2) : 0.5;

    if (confidence > 0.3) {
      patterns.push({
        merchant: merchant!,
        amount,
        dates,
        confidence: Math.min(1, confidence),
      });
    }
  }

  return patterns.sort((a, b) => b.confidence - a.confidence);
};

export const parseCSV = (csvContent: string): ParsedTransaction[] => {
  const lines = csvContent.split("\n").filter((line) => line.trim());
  const transactions: ParsedTransaction[] = [];

  // Skip header (usually first line)
  const dataLines = lines.slice(1);

  for (const line of dataLines) {
    const parts = line.split(",").map((p) => p.trim().replace(/^["']|["']$/g, ""));

    // Common CSV formats: Date, Description, Amount
    // or: Date, Merchant, Description, Amount, Balance
    let date: string | undefined;
    let description: string | undefined;
    let amount: number | undefined;

    if (parts.length >= 3) {
      // Try first format: Date, Description, Amount
      date = parts[0];
      description = parts[1];
      amount = parseFloat(parts[parts.length - 1] || "0");

      // Validate date format (YYYY-MM-DD or MM/DD/YYYY)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(date!)) continue;

      if (!isNaN(amount)) {
        transactions.push({
          date: new Date(date!).toISOString().split("T")[0]!,
          description: description!,
          amount: Math.abs(amount),
        });
      }
    }
  }

  return transactions;
};

export const detectCandidatesFromCSV = (csvContent: string): (DetectedSubscriptionCandidate & { confidence: number })[] => {
  const transactions = parseCSV(csvContent);
  const patterns = detectRecurringPatterns(transactions);

  return patterns.map((pattern) => ({
    merchant: pattern.merchant,
    amount: pattern.amount,
    confidence: pattern.confidence,
    detectedAt: new Date().toISOString(),
    sourceMessageId: `csv-${pattern.merchant.toLowerCase()}-${Date.now()}`,
    sourceSubject: `CSV Import: ${pattern.merchant}`,
    sourceFrom: "csv-bank-statement",
    cancellationEmail: `${pattern.merchant.toLowerCase().replace(/\s+/g, "")}.support@example.com`,
  }));
};
