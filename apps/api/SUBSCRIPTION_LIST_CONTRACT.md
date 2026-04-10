# Subscription List API - Data Structure & Contract

**Created by**: Yashaswini  
**Date**: April 8, 2026  
**Purpose**: Comprehensive subscription tracking for fintech app demo

---

## Subscription Object Structure

### Core Interface

```typescript
interface Subscription {
  // Unique identifiers
  id: string;                                    // e.g., "sub_netflix"
  userId: string;                                // Associated user ID
  
  // Service information
  merchant: string;                              // Service provider name (e.g., "Netflix")
  category: string;                              // Category (Streaming, Music, Productivity, etc.)
  
  // Billing information
  amount: number;                                // Billing amount in USD
  billingCycle: "monthly" | "yearly";           // Renewal frequency
  
  // Status tracking
  status: "active" | "canceling" | "cancelled"; // Current subscription state
  riskLevel: "low" | "medium" | "high";         // Financial/cancellation risk
  
  // Renewal information
  nextRenewalDate: string | null;               // ISO 8601 timestamp (null if cancelled)
  startedAt: string;                            // When subscription was activated
  
  // Cancellation details
  cancelMethod: "in-app" | "email" | "phone" | "chat";  // How to cancel
  cancellationUrl: string;                       // Cancellation endpoint/contact
}
```

### Field Specifications

| Field | Type | Description | Examples |
|-------|------|-------------|----------|
| `id` | string | Unique subscription ID | `sub_netflix`, `sub_spotify_premium` |
| `userId` | string | User who owns subscription | `user_demo_001` |
| `merchant` | string | Service provider name | Netflix, Spotify, Adobe Creative Cloud |
| `category` | string | Service category | Streaming, Music, SaaS, Productivity, Fitness, Learning |
| `amount` | number | Monthly/yearly cost in USD | 15.99, 99.99, 59.99 |
| `billingCycle` | enum | Billing frequency | `monthly`, `yearly` |
| `status` | enum | Current status | `active`, `canceling`, `cancelled` |
| `riskLevel` | enum | Risk assessment | `low`, `medium`, `high` |
| `nextRenewalDate` | ISO 8601 / null | Next charge date | `2026-04-15T10:00:00.000Z` or `null` |
| `startedAt` | ISO 8601 | When subscription began | `2025-05-02T10:00:00.000Z` |
| `cancelMethod` | enum | How to cancel | `in-app`, `email`, `phone`, `chat` |
| `cancellationUrl` | string | Link to cancel | `https://netflix.com/cancel`, `tel:+1234567890` |

---

## Risk Level Definitions

### 🟢 Low Risk
- Easy to cancel (in-app option)
- Low monthly cost
- No past issues
- Services: Netflix, Spotify, Prime Video

### 🟡 Medium Risk
- Moderate cancellation difficulty
- Quarterly or annual billing
- Minor issues or missed payments
- Services: Notion, NewsPlus, CloudAI

### 🔴 High Risk
- Difficult to cancel (phone/email required)
- High monthly cost (>$50)
- Past disputes or dual-billing
- Services: Adobe Creative Cloud, MasterClass, GymPro

---

## Demo Dataset: 10 Realistic Fintech App Subscriptions

### 1. Netflix (Low Risk - Active)
```javascript
{
  id: "sub_netflix",
  userId: "user_demo_001",
  merchant: "Netflix",
  category: "Streaming",
  amount: 15.99,
  billingCycle: "monthly",
  status: "active",
  riskLevel: "low",
  nextRenewalDate: "2026-04-08T10:00:00.000Z",
  cancelMethod: "in-app",
  cancellationUrl: "https://www.netflix.com/cancelplan",
  startedAt: "2025-05-02T10:00:00.000Z",
}
```
**Notes**: Easy cancellation via app, low cost, popular streaming service.

---

### 2. Spotify Premium (Low Risk - Active)
```javascript
{
  id: "sub_spotify",
  userId: "user_demo_001",
  merchant: "Spotify Premium",
  category: "Music",
  amount: 11.99,
  billingCycle: "monthly",
  status: "active",
  riskLevel: "low",
  nextRenewalDate: "2026-04-12T10:00:00.000Z",
  cancelMethod: "in-app",
  cancellationUrl: "https://www.spotify.com/account/subscription/",
  startedAt: "2024-11-22T10:00:00.000Z",
}
```
**Notes**: Long-time subscriber, straightforward cancellation process.

---

### 3. Prime Video (Low Risk - Active)
```javascript
{
  id: "sub_primevideo",
  userId: "user_demo_001",
  merchant: "Prime Video",
  category: "Streaming",
  amount: 8.99,
  billingCycle: "monthly",
  status: "active",
  riskLevel: "low",
  nextRenewalDate: "2026-04-14T10:00:00.000Z",
  cancelMethod: "in-app",
  cancellationUrl: "https://www.amazon.com/yourmembershipsandsubscriptions",
  startedAt: "2025-03-30T10:00:00.000Z",
}
```
**Notes**: Low cost, integrated with Amazon account, good value.

---

### 4. Adobe Creative Cloud (🔴 High Risk - Active)
```javascript
{
  id: "sub_adobe",
  userId: "user_demo_001",
  merchant: "Adobe Creative Cloud",
  category: "Design",
  amount: 59.99,
  billingCycle: "monthly",
  status: "active",
  riskLevel: "high",
  nextRenewalDate: "2026-04-10T10:00:00.000Z",
  cancelMethod: "chat",
  cancellationUrl: "https://helpx.adobe.com/contact.html",
  startedAt: "2024-04-01T10:00:00.000Z",
}
```
**Notes**: Highest expense in subscription list. Requires chat/customer service to cancel (not straightforward). Long-standing subscriber (2 years). ⚠️ **HIGH PRIORITY FOR MONITORING**

---

### 5. Notion Plus (Medium Risk - Active)
```javascript
{
  id: "sub_notion",
  userId: "user_demo_001",
  merchant: "Notion Plus",
  category: "Productivity",
  amount: 12.00,
  billingCycle: "monthly",
  status: "active",
  riskLevel: "medium",
  nextRenewalDate: "2026-04-18T10:00:00.000Z",
  cancelMethod: "email",
  cancellationUrl: "mailto:support@makenotion.com",
  startedAt: "2025-02-01T10:00:00.000Z",
}
```
**Notes**: Email-only cancellation. Moderate subscription period (~14 months).

---

### 6. GymPro Annual (🔴 HIGH RISK - CANCELING)
```javascript
{
  id: "sub_gym",
  userId: "user_demo_001",
  merchant: "GymPro Annual",
  category: "Fitness",
  amount: 79.00,
  billingCycle: "monthly",
  status: "canceling",
  riskLevel: "high",
  nextRenewalDate: "2026-04-07T10:00:00.000Z",
  cancelMethod: "phone",
  cancellationUrl: "tel:+18005551234",
  startedAt: "2025-07-16T10:00:00.000Z",
}
```
**Notes**: User attempting to cancel (status: "canceling"). High cost. Phone-only cancellation. Requires manual contact. ⚠️ **PROBLEMATIC SERVICE #1**

---

### 7. NewsPlus (Medium Risk - Active)
```javascript
{
  id: "sub_newsplus",
  userId: "user_demo_001",
  merchant: "NewsPlus",
  category: "News",
  amount: 6.49,
  billingCycle: "monthly",
  status: "active",
  riskLevel: "medium",
  nextRenewalDate: "2026-04-09T10:00:00.000Z",
  cancelMethod: "email",
  cancellationUrl: "mailto:support@newsplus.example",
  startedAt: "2024-12-10T10:00:00.000Z",
}
```
**Notes**: Email cancellation required. Low cost news subscription.

---

### 8. CloudAI Starter (Medium Risk - Active)
```javascript
{
  id: "sub_cloudai",
  userId: "user_demo_001",
  merchant: "CloudAI Starter",
  category: "SaaS",
  amount: 25.00,
  billingCycle: "monthly",
  status: "active",
  riskLevel: "medium",
  nextRenewalDate: "2026-04-20T10:00:00.000Z",
  cancelMethod: "in-app",
  cancellationUrl: "https://cloudai.example/cancel",
  startedAt: "2025-09-05T10:00:00.000Z",
}
```
**Notes**: SaaS tool with in-app cancellation. Moderate cost at $25/month.

---

### 9. MasterClass (🔴 HIGH RISK - Active with Issues)
```javascript
{
  id: "sub_masterclass",
  userId: "user_demo_001",
  merchant: "MasterClass",
  category: "Learning",
  amount: 15.00,
  billingCycle: "monthly",
  status: "active",
  riskLevel: "high",
  nextRenewalDate: "2026-04-16T10:00:00.000Z",
  cancelMethod: "chat",
  cancellationUrl: "https://masterclass.com/contact",
  startedAt: "2025-10-20T10:00:00.000Z",
}
```
**Notes**: Chat-only cancellation method. High friction for users. Recent subscriber with potential for unexpected charges. ⚠️ **PROBLEMATIC SERVICE #2 - Recently signed up, requires chat support**

---

### 10. FoodBox Weekly (Low Risk - 🚫 CANCELLED)
```javascript
{
  id: "sub_foodbox",
  userId: "user_demo_001",
  merchant: "FoodBox Weekly",
  category: "Food",
  amount: 32.00,
  billingCycle: "monthly",
  status: "cancelled",
  riskLevel: "low",
  nextRenewalDate: null,
  cancelMethod: "in-app",
  cancellationUrl: "https://foodbox.example/account",
  startedAt: "2025-01-12T10:00:00.000Z",
}
```
**Notes**: Successfully cancelled subscription. Historical data preserved for user's reference.

---

## Summary Dashboard

| Metric | Value | Notes |
|--------|-------|-------|
| **Total Monthly Spend** | $234.45 | If all active subscriptions renew (including canceling) |
| **Active Subscriptions** | 9 | Includes GymPro (canceling), working to reduce to 8 |
| **Cancelled Subscriptions** | 1 | FoodBox |
| **High Risk Count** | 3 | Adobe, GymPro, MasterClass |
| **Medium Risk Count** | 4 | Notion, NewsPlus, CloudAI |
| **Low Risk Count** | 3 | Netflix, Spotify, Prime Video |
| **Potential Monthly Savings** | $79.00 | GymPro cancellation pending |
| **Up for Renewal Today** | 1 | Netflix (2026-04-08) |
| **Risk Band** | Critical | 3+ high-risk subscriptions require immediate attention |

---

## Data Generation Notes

### Realistic Characteristics ✓
- **Services**: Industry-standard, popular platforms (Netflix, Spotify, Adobe, etc.)
- **Billing Cycles**: Mix of monthly and fixed costs
- **Amounts**: Realistic USD pricing from actual services
- **Risk Distribution**: Diverse risk levels reflecting real user portfolios
- **Dates**: Staggered renewal dates across the month
- **Cancellation Methods**: Mix of channels (in-app, email, phone, chat)
- **Status Variety**: Active, canceling, and cancelled states

### Problematic Service Examples
1. **GymPro**: User actively trying to cancel, high cost, phone-only cancellation
2. **MasterClass**: Chat-only cancellation, recent signup with medium cost
3. Combined Issue: Unexpected high spending on difficult-to-cancel services

---

## API Endpoints Using This Data

### GET `/v1/subscriptions`
Returns array of Subscription objects with filtering/sorting.

### GET `/v1/subscriptions/:id`
Returns detailed Subscription with history and related records.

### GET `/v1/dashboard/summary`
Aggregates data: monthlySpend, activeSubscriptions, highRiskCount, etc.

### GET `/v1/renewals/calendar`
Calendar view of upcoming renewals using nextRenewalDate.

---

**Version**: 1.0  
**Status**: Ready for Implementation