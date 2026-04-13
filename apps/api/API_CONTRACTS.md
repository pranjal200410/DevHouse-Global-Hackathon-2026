# API Contracts (Pranjal Scope)

Base URL: `http://localhost:4000`

All responses use this envelope:

```json
{
  "success": true,
  "data": {}
}
```

Error envelope:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

## Health

### GET `/health`

Returns service health and timestamp.

## Auth

### POST `/v1/auth/demo-login`

Request body:

```json
{
  "email": "demo@devhouse.app",
  "pin": "2026"
}
```

`pin` is required. Invalid PIN returns `401 INVALID_CREDENTIALS`.

Response `200`:

```json
{
  "success": true,
  "data": {
    "token": "uuid",
    "expiresAt": "2026-04-06T12:00:00.000Z",
    "demoMode": true,
    "user": {
      "id": "user_demo_001",
      "email": "demo@devhouse.app",
      "name": "demo",
      "onboardingCompleted": true,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  }
}
```

### GET `/v1/auth/session`

Headers: `Authorization: Bearer <token>`

Returns current session and user data.

### POST `/v1/auth/logout`

Headers: `Authorization: Bearer <token>`

Revokes current token.

### POST `/v1/auth/demo-reset`

Headers:

- `Authorization: Bearer <token>`
- `x-demo-reset-key: <reset-key>`

Resets deterministic demo data for the authenticated demo user only.
If the reset key is invalid, returns `403 RESET_FORBIDDEN`.

## Dashboard

### GET `/v1/dashboard/summary`

Headers: `Authorization: Bearer <token>`

Response includes:

- `monthlySpend`
- `activeSubscriptions`
- `highRiskCount`
- `riskBand` (`stable|watch|critical`)
- `nextRenewalDate`
- `potentialSavings`

## Subscriptions

### GET `/v1/subscriptions`

Headers: `Authorization: Bearer <token>`

Query params:

- `status`: `active|canceling|cancelled`
- `riskLevel`: `low|medium|high`
- `sort`: `renewal-asc|amount-desc|amount-asc`

Returns subscription cards.

### GET `/v1/subscriptions/:id`

Headers: `Authorization: Bearer <token>`

Returns detail payload:

- `subscription`
- `history`
- `cancellation`
- `blockRule`
- `disputes`
- `actions`

### POST `/v1/subscriptions/:id/cancel`

Headers: `Authorization: Bearer <token>`

Marks cancellation as in-progress and updates subscription status.

### POST `/v1/subscriptions/:id/cancel/complete`

Headers: `Authorization: Bearer <token>`

Completes cancellation and sets subscription as cancelled.

### POST `/v1/subscriptions/:id/block`

Headers: `Authorization: Bearer <token>`

Request body:

```json
{
  "enabled": true
}
```

Updates auto-block flag for this subscription.

## Renewal Calendar

### GET `/v1/renewals/calendar`

Headers: `Authorization: Bearer <token>`

Returns upcoming charge events with risk color:

- `emerald` for low risk
- `amber` for medium risk
- `rose` for high risk

## Screen 10: Cancellation Center

### GET `/v1/cancellations/center`

Headers: `Authorization: Bearer <token>`

Returns cancellation center rows with:

- `merchant`
- `method`
- `state`
- `progressPercent`
- `nextAction`
- `steps`

## Screen 11: Protection Controls

### GET `/v1/protection-controls`

Headers: `Authorization: Bearer <token>`

Returns:

- `summary`
- `controls[]`

Each control contains:

- `subscriptionId`
- `merchant`
- `riskLevel`
- `nextRenewalDate`
- `autoBlockEnabled`

### POST `/v1/protection-controls/:id`

Headers: `Authorization: Bearer <token>`

Request body:

```json
{
  "enabled": true
}
```

Updates Auto-Block for the selected subscription and returns refreshed protection payload.

## Screen 12: Dispute Studio

### GET `/v1/disputes/studio`

Headers: `Authorization: Bearer <token>`

Returns:

- `summary`
  - `openDisputes`
  - `totalDisputedAmount`
  - `highPriorityDisputes`
  - `evidenceReadyDisputes`
- `disputes[]`

Each dispute row contains:

- `disputeId`
- `subscriptionId`
- `merchant`
- `incidentDate`
- `amount`
- `reason`
- `status` (`draft|submitted|won|lost`)
- `riskLevel` (`low|medium|high`)
- `cancellationState` (`not-started|in-progress|completed|null`)
- `evidenceProgressPercent`
- `recommendedAction`
- `checklist[]`

## Screen 13: Alerts & Incident Feed

### GET `/v1/alerts/feed`

Headers: `Authorization: Bearer <token>`

Returns severity-coded alert timeline with:

- `type` (`renewal-risk|blocked-charge|dispute|cancellation-followup`)
- `severity` (`low|medium|high`)
- `title`
- `message`
- `actionLabel`
- `actionHref`
- `occurredAt`
