import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SubGuard — Stop Losing Money to Forgotten Subscriptions",
  description:
    "SubGuard detects hidden renewals, predicts charges before they hit, and generates dispute-ready proof in seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
