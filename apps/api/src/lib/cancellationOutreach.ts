import nodemailer from "nodemailer";
import type { CancellationOutreachResult, Subscription, User } from "../types";

const resolveRecipient = (subscription: Subscription): string => {
  const overrideRecipient = process.env.CANCELLATION_OUTREACH_OVERRIDE_TO?.trim();
  if (overrideRecipient) {
    return overrideRecipient;
  }

  if (subscription.cancellationUrl.startsWith("mailto:")) {
    const value = subscription.cancellationUrl.slice("mailto:".length).trim();
    if (value) {
      return value;
    }
  }

  const fallback = process.env.CANCELLATION_OUTREACH_FALLBACK_TO ?? "support@merchant.example";
  return fallback;
};

const buildTransport = async (): Promise<{
  transporter: nodemailer.Transporter;
  fromAddress: string;
  previewMode: boolean;
}> => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = (process.env.SMTP_SECURE ?? "false").toLowerCase() === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return {
      transporter: nodemailer.createTransport({ host, port, secure, auth: { user, pass } }),
      fromAddress: process.env.SMTP_FROM ?? user,
      previewMode: false,
    };
  }

  const testAccount = await nodemailer.createTestAccount();
  return {
    transporter: nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    }),
    fromAddress: `DevHouse Guard <${testAccount.user}>`,
    previewMode: true,
  };
};

export const sendCancellationOutreach = async (
  user: User,
  subscription: Subscription,
): Promise<CancellationOutreachResult> => {
  const attemptedAt = new Date().toISOString();

  if (subscription.status === "cancelled") {
    return {
      attemptedAt,
      status: "skipped",
      recipient: resolveRecipient(subscription),
      messageId: null,
      previewUrl: null,
      error: "Subscription is already cancelled.",
    };
  }

  const recipient = resolveRecipient(subscription);
  const subject = `Cancellation request for ${subscription.merchant} (${user.email})`;
  const text = [
    `Hello ${subscription.merchant} billing team,`,
    "",
    `Please cancel the active recurring subscription for account: ${user.email}.`,
    `Subscription: ${subscription.merchant}`,
    `Current recurring amount: $${subscription.amount.toFixed(2)}`,
    "",
    "Please confirm cancellation effective date and send a cancellation reference.",
    "",
    "Regards,",
    `${user.name}`,
    "Sent via DevHouse Subscription Guard",
  ].join("\n");

  try {
    const { transporter, fromAddress, previewMode } = await buildTransport();
    const result = await transporter.sendMail({
      from: fromAddress,
      to: recipient,
      subject,
      text,
    });

    return {
      attemptedAt,
      status: "sent",
      recipient,
      messageId: result.messageId,
      previewUrl: previewMode ? (nodemailer.getTestMessageUrl(result) || null) : null,
      error: null,
    };
  } catch (error) {
    return {
      attemptedAt,
      status: "failed",
      recipient,
      messageId: null,
      previewUrl: null,
      error: error instanceof Error ? error.message : "unknown outreach error",
    };
  }
};
