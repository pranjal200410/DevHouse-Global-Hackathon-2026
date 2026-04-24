import { detectCandidatesFromCSV } from "../src/lib/csvParser";

const testCSV = `Date,Description,Amount
2026-01-05,Netflix Subscription,15.99
2026-02-05,Netflix Subscription,15.99
2026-03-05,Netflix Subscription,15.99
2026-01-08,Spotify Premium,12.99
2026-02-08,Spotify Premium,12.99
2026-03-08,Spotify Premium,12.99
2026-01-12,Adobe Creative Cloud,54.99
2026-02-12,Adobe Creative Cloud,54.99
2026-03-12,Adobe Creative Cloud,54.99`;

console.log("Testing CSV Parser...");
const results = detectCandidatesFromCSV(testCSV);
console.log(`✓ Found ${results.length} subscription candidates`);
console.log("Candidates:");
results.forEach((c: any) => {
  console.log(`  - ${c.merchant}: $${c.amount.toFixed(2)}/month (confidence: ${(c.confidence * 100).toFixed(0)}%)`);
});

const hasNetflix = results.some((r) => r.merchant.includes("Netflix"));
const hasSpotify = results.some((r) => r.merchant.includes("Spotify"));
const hasAdobe = results.some((r) => r.merchant.includes("Adobe"));

if (hasNetflix && hasSpotify && hasAdobe) {
  console.log("✓ All expected merchants detected");
  process.exit(0);
} else {
  console.log("✗ Missing expected merchants");
  process.exit(1);
}
