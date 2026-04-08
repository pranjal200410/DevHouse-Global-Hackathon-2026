"use strict";
/**
 * Subscription Demo Data
 * Created by: Yashaswini
 * Purpose: Realistic subscription tracking data for fintech demo app
 *
 * This file contains:
 * - 10 realistic subscription entries
 * - Mix of popular services (Netflix, Spotify, Prime, Adobe, etc.)
 * - Different billing cycles and payment methods
 * - 2 problematic services demonstrating edge cases
 * - Properly typed with TypeScript
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEMO_SUBSCRIPTIONS = exports.DEMO_USER_ID = void 0;
exports.calculateSubscriptionSummary = calculateSubscriptionSummary;
/* ============================================
   DEMO USER ID (used across all entries)
   ============================================ */
exports.DEMO_USER_ID = "user_demo_001";
/* ============================================
   SUBSCRIPTION DEMO DATA (10 entries)
   ============================================ */
exports.DEMO_SUBSCRIPTIONS = [
    // 1. NETFLIX - Low Risk, Active
    {
        id: "sub_netflix",
        userId: exports.DEMO_USER_ID,
        merchant: "Netflix",
        category: "Streaming",
        amount: 15.99,
        billingCycle: "monthly",
        status: "active",
        riskLevel: "low",
        nextRenewalDate: "2026-04-08T10:00:00.000Z",
        startedAt: "2025-05-02T10:00:00.000Z",
        cancelMethod: "in-app",
        cancellationUrl: "https://www.netflix.com/cancelplan",
        paymentMethod: "visa_ending_4242",
        description: "Premium streaming service for movies and TV shows",
        lastChargeDate: "2026-03-08T10:00:00.000Z",
    },
    // 2. SPOTIFY PREMIUM - Low Risk, Active
    {
        id: "sub_spotify",
        userId: exports.DEMO_USER_ID,
        merchant: "Spotify Premium",
        category: "Music",
        amount: 11.99,
        billingCycle: "monthly",
        status: "active",
        riskLevel: "low",
        nextRenewalDate: "2026-04-12T10:00:00.000Z",
        startedAt: "2024-11-22T10:00:00.000Z",
        cancelMethod: "in-app",
        cancellationUrl: "https://www.spotify.com/account/subscription/",
        paymentMethod: "mastercard_ending_5555",
        description: "Ad-free music streaming with offline downloads",
        lastChargeDate: "2026-03-12T10:00:00.000Z",
    },
    // 3. PRIME VIDEO - Low Risk, Active
    {
        id: "sub_primevideo",
        userId: exports.DEMO_USER_ID,
        merchant: "Prime Video",
        category: "Streaming",
        amount: 8.99,
        billingCycle: "monthly",
        status: "active",
        riskLevel: "low",
        nextRenewalDate: "2026-04-14T10:00:00.000Z",
        startedAt: "2025-03-30T10:00:00.000Z",
        cancelMethod: "in-app",
        cancellationUrl: "https://www.amazon.com/yourmembershipsandsubscriptions",
        paymentMethod: "amex_ending_1001",
        description: "Amazon streaming movies and TV series",
        lastChargeDate: "2026-03-14T10:00:00.000Z",
    },
    // 4. ADOBE CREATIVE CLOUD ⚠️ High Risk, Active
    // HIGH PRIORITY: Expensive, difficult cancellation
    {
        id: "sub_adobe",
        userId: exports.DEMO_USER_ID,
        merchant: "Adobe Creative Cloud",
        category: "Design",
        amount: 59.99,
        billingCycle: "monthly",
        status: "active",
        riskLevel: "high",
        nextRenewalDate: "2026-04-10T10:00:00.000Z",
        startedAt: "2024-04-01T10:00:00.000Z",
        cancelMethod: "chat",
        cancellationUrl: "https://helpx.adobe.com/contact.html",
        paymentMethod: "visa_ending_4242",
        description: "Complete creative suite for design, video, and web",
        lastChargeDate: "2026-03-10T10:00:00.000Z",
    },
    // 5. GYMMPRO ANNUAL ⚠️⚠️ HIGH RISK - CANCELING
    // PROBLEMATIC SERVICE #1: User actively trying to cancel
    // Issue: High cost, phone-only cancellation, unsatisfactory service
    {
        id: "sub_gym",
        userId: exports.DEMO_USER_ID,
        merchant: "GymPro Annual",
        category: "Fitness",
        amount: 79.0,
        billingCycle: "monthly",
        status: "canceling",
        riskLevel: "high",
        nextRenewalDate: "2026-04-07T10:00:00.000Z",
        startedAt: "2025-07-16T10:00:00.000Z",
        cancelMethod: "phone",
        cancellationUrl: "tel:+18005551234",
        paymentMethod: "debit_card_ending_9876",
        description: "Annual gym membership (auto-renewing monthly charges)",
        lastChargeDate: "2026-03-07T10:00:00.000Z",
    },
    // 6. NOTION PLUS - Medium Risk, Active
    {
        id: "sub_notion",
        userId: exports.DEMO_USER_ID,
        merchant: "Notion Plus",
        category: "Productivity",
        amount: 12.0,
        billingCycle: "monthly",
        status: "active",
        riskLevel: "medium",
        nextRenewalDate: "2026-04-18T10:00:00.000Z",
        startedAt: "2025-02-01T10:00:00.000Z",
        cancelMethod: "email",
        cancellationUrl: "mailto:support@makenotion.com",
        paymentMethod: "visa_ending_4242",
        description: "All-in-one workspace for notes, databases, and wikis",
        lastChargeDate: "2026-03-18T10:00:00.000Z",
    },
    // 7. NEWSPLUS - Medium Risk, Active
    {
        id: "sub_newsplus",
        userId: exports.DEMO_USER_ID,
        merchant: "NewsPlus",
        category: "News",
        amount: 6.49,
        billingCycle: "monthly",
        status: "active",
        riskLevel: "medium",
        nextRenewalDate: "2026-04-09T10:00:00.000Z",
        startedAt: "2024-12-10T10:00:00.000Z",
        cancelMethod: "email",
        cancellationUrl: "mailto:support@newsplus.example",
        paymentMethod: "mastercard_ending_5555",
        description: "Premium access to news articles and analytics",
        lastChargeDate: "2026-03-09T10:00:00.000Z",
    },
    // 8. CLOUDAI STARTER - Medium Risk, Active
    {
        id: "sub_cloudai",
        userId: exports.DEMO_USER_ID,
        merchant: "CloudAI Starter",
        category: "SaaS",
        amount: 25.0,
        billingCycle: "monthly",
        status: "active",
        riskLevel: "medium",
        nextRenewalDate: "2026-04-20T10:00:00.000Z",
        startedAt: "2025-09-05T10:00:00.000Z",
        cancelMethod: "in-app",
        cancellationUrl: "https://cloudai.example/cancel",
        paymentMethod: "amex_ending_1001",
        description: "AI-powered cloud analytics and automation platform",
        lastChargeDate: "2026-03-20T10:00:00.000Z",
    },
    // 9. MASTERCLASS ⚠️⚠️ HIGH RISK - Active
    // PROBLEMATIC SERVICE #2: Difficult cancellation (chat only)
    // Issue: Recent signup, high friction for cancellation, unclear billing
    {
        id: "sub_masterclass",
        userId: exports.DEMO_USER_ID,
        merchant: "MasterClass",
        category: "Learning",
        amount: 15.0,
        billingCycle: "monthly",
        status: "active",
        riskLevel: "high",
        nextRenewalDate: "2026-04-16T10:00:00.000Z",
        startedAt: "2025-10-20T10:00:00.000Z",
        cancelMethod: "chat",
        cancellationUrl: "https://masterclass.com/contact",
        paymentMethod: "visa_ending_4242",
        description: "Online masterclasses from world-class instructors",
        lastChargeDate: "2026-03-16T10:00:00.000Z",
    },
    // 10. FOODBOX WEEKLY - Low Risk, Cancelled
    {
        id: "sub_foodbox",
        userId: exports.DEMO_USER_ID,
        merchant: "FoodBox Weekly",
        category: "Food",
        amount: 32.0,
        billingCycle: "monthly",
        status: "cancelled",
        riskLevel: "low",
        nextRenewalDate: null,
        startedAt: "2025-01-12T10:00:00.000Z",
        cancelMethod: "in-app",
        cancellationUrl: "https://foodbox.example/account",
        paymentMethod: "debit_card_ending_9876",
        description: "Weekly meal prep box delivery (successfully cancelled)",
        lastChargeDate: "2026-02-12T10:00:00.000Z",
    },
];
/* ============================================
   SUMMARY CALCULATIONS
   ============================================ */
function calculateSubscriptionSummary(subscriptions) {
    const active = subscriptions.filter((s) => s.status === "active");
    const canceling = subscriptions.filter((s) => s.status === "canceling");
    const cancelled = subscriptions.filter((s) => s.status === "cancelled");
    const highRisk = subscriptions.filter((s) => s.riskLevel === "high");
    const mediumRisk = subscriptions.filter((s) => s.riskLevel === "medium");
    const lowRisk = subscriptions.filter((s) => s.riskLevel === "low");
    const monthlySpend = active.reduce((sum, s) => sum + s.amount, 0);
    const potentialSavings = canceling.reduce((sum, s) => sum + s.amount, 0);
    return {
        totalCount: subscriptions.length,
        activeCount: active.length,
        cancelingCount: canceling.length,
        cancelledCount: cancelled.length,
        monthlySpend: parseFloat(monthlySpend.toFixed(2)),
        potentialSavings: parseFloat(potentialSavings.toFixed(2)),
        riskCounts: {
            high: highRisk.length,
            medium: mediumRisk.length,
            low: lowRisk.length,
        },
        riskBand: highRisk.length > 2
            ? "critical"
            : highRisk.length > 0
                ? "watch"
                : "stable",
        problemServices: subscriptions
            .filter((s) => s.riskLevel === "high")
            .map((s) => ({
            id: s.id,
            merchant: s.merchant,
            amount: s.amount,
            issue: s.status === "canceling" ? "User cancelling" : "Difficult to cancel",
        })),
    };
}
/* ============================================
   EXAMPLE USAGE
   ============================================ */
/*
import { DEMO_SUBSCRIPTIONS, calculateSubscriptionSummary } from './subscriptionDemoData';

// Get all subscriptions
console.log(DEMO_SUBSCRIPTIONS);

// Calculate summary
const summary = calculateSubscriptionSummary(DEMO_SUBSCRIPTIONS);
console.log('Monthly Spend:', summary.monthlySpend);      // $232.44
console.log('Active Subscriptions:', summary.activeCount); // 8
console.log('High Risk Services:', summary.riskCounts.high); // 3
console.log('Potential Savings:', summary.potentialSavings); // $79.00

// Filter by risk level
const highRiskOnly = DEMO_SUBSCRIPTIONS.filter(s => s.riskLevel === 'high');
console.log('High Risk Services:', highRiskOnly);

// Find problematic services
const problematic = DEMO_SUBSCRIPTIONS.filter(
  s => s.status === 'canceling' || s.cancelMethod === 'phone' || s.cancelMethod === 'chat'
);
console.log('Problematic Services:', problematic);
*/
