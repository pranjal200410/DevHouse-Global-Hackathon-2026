# Dispute Studio Feature Specification

**Purpose:** Empower users to challenge unexpected subscription charges by organizing and presenting clear, chronological proof of their dispute claim.

---

## PAGE STRUCTURE

### Section 1: Header & Status

#### Header Layout
```
┌────────────────────────────────────────────────────────┐
│ ← Back                                              ⋮   │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Netflix Unwanted Charge                                │
│ Dispute #1847 | Active dispute                         │
│ Started: April 8, 2026                                 │
│                                                        │
└────────────────────────────────────────────────────────┘
```

#### Header Content
- **Breadcrumb:** Back arrow (returns to Dashboard or Subscriptions)
- **Subscription Name:** Large, bold (e.g., "Netflix", "Adobe Creative")
- **Dispute ID:** Secondary gray text (reference number for tracking)
- **Status Badge:** Color-coded
  - "Active dispute" (Blue) — In progress, evidence collected, waiting on provider
  - "Resolved" (Green) — Charge reversed or confirmed legitimate
  - "Disputed pending" (Orange) — Awaiting response from merchant
  - "Unresolved" (Red) — 30+ days, escalation needed
- **Timestamp:** When dispute was started

---

## Section 2: Timeline (Central Trust-Building Element)

### Visual Design Principles
- **Chronological Order:** Top-to-bottom flow (newest events at top OR oldest first — user preference)
- **Clear Vertical Line:** Visual thread connecting all events (left side)
- **Event Dots:** Numbered or icon-based dots on the line
  - Large, distinct colors per event type
  - Numbered dots (1, 2, 3...) to show sequence clarity
- **Right-Aligned Content:** Event details on right side of line

### Timeline Events (in typical dispute flow)

#### Event 1: Charge Detection
```
1 [Blue Circle]
  Unexpected Charge Detected
  April 9, 2026 at 3:14 PM
  
  $14.99 charged to •••• 4829
  Card statement shows subscription renewal
  User flagged as "unusual activity"
```
- **Icon:** Credit card or alert icon
- **Timestamp:** Exact date & time of charge
- **Details:** Amount, last 4 digits of card, brief description

#### Event 2: Free Trial End / Renewal
```
2 [Orange Circle]
  Free Trial Ended → Paid Plan Activated
  April 8, 2026 at 12:00 AM
  
  Netflix free trial was supposed to end Apr 15
  Renewal triggered 7 days EARLY
  No email warning received before charge
```
- **Icon:** Calendar or alert icon
- **Timestamp:** When renewal occurred
- **Details:** Expected date vs. actual date, discrepancy explanation

#### Event 3: Cancellation Attempt
```
3 [Purple Circle]
  Cancel Request Submitted
  April 9, 2026 at 11:45 AM
  
  User attempted cancellation via Netflix settings
  Status: "Processing" (no confirmation yet)
  Screenshot attached: [View]
```
- **Icon:** X or cancel icon
- **Timestamp:** When user tried to cancel
- **Details:** Method used (in-app, email, phone), confirmation status
- **Evidence Link:** Expandable screenshot or proof

#### Event 4: System Alert Generated
```
4 [Red Circle]
  Alert: Charge NOT Covered by Trial Agreement
  April 9, 2026 at 2:30 PM
  
  Our system detected: Charge was issued 7 days
  before trial end date. This violates Netflix's
  stated policy. Mark for dispute escalation.
```
- **Icon:** Warning or flag icon
- **Timestamp:** When system flagged the issue
- **Details:** Why it failed policy verification

#### Event 5: Dispute Started (If User Initiated)
```
5 [Green Circle]
  Dispute Initiated by User
  April 10, 2026 at 9:15 AM
  
  User chose "Early renewal charge" as dispute reason
  Evidence package compiled
  Ready for merchant challenge
```
- **Icon:** Checkmark or flag icon
- **Timestamp:** When dispute officially started
- **Details:** Reason selected, evidence status

### Timeline Interaction Rules
- **Expandable Events:** Click event → show full details in modal or expandable card
- **Evidence Preview:** Hover over event → show thumbnail of attached proof (screenshot, email)
- **Highlight Current Status:** The most recent event should have a subtle glow or emphasis
- **Mobile:** Stack vertically with dots on left; swipe to expand event details

---

## Section 3: Evidence Repository

### Evidence Subsection Layout
```
┌─ Evidence Collected ──────────────────────────────────┐
│                                                       │
│ Transaction Details                [✓ Complete]      │
│ ├─ Charge amount: $14.99                            │
│ ├─ Date charged: April 9, 2026                      │
│ ├─ Merchant: Netflix Subscription                   │
│ ├─ Card: Visa ••••4829                              │
│ └─ Reference ID: TXN-847392847                       │
│                                                       │
│ Subscription Agreement                [✓ Complete]   │
│ ├─ Plan: Netflix Premium                            │
│ ├─ Start date: Mar 25, 2026                         │
│ ├─ Trial length: 14 days (ends Apr 8)              │
│ ├─ Stated renewal: April 8, 2026                    │
│ ├─ Actual charge: March 9, 2026 (7 DAYS EARLY)     │
│ └─ Agreement screenshot: [View PDF]                  │
│                                                       │
│ Cancellation Records                    [✓ Complete] │
│ ├─ Cancel attempt 1: Apr 9, 11:45 AM               │
│ │  Status: "Pending" (no confirmation)              │
│ │  Screenshot: [View]                               │
│ ├─ Cancel attempt 2: None recorded                  │
│ └─ System note: Cancellation may not have processed │
│                                                       │
│ User Communications                     [✓ Complete] │
│ ├─ Email alerts received: 0 (None about renewal)    │
│ ├─ SMS notification: None                           │
│ ├─ Last statement: Mar 28, 2026                     │
│ └─ All docs: [Download ZIP]                         │
│                                                       │
│ Chargeback Keywords                     [✓ Complete] │
│ ├─ "Unauthorized charge" → Supported ✓              │
│ ├─ "Early renewal" → Supported ✓                    │
│ ├─ "Trial breach" → Supported ✓                     │
│ └─ Confidence score: 87%                            │
│                                                       │
└───────────────────────────────────────────────────────┘
```

### Evidence Sections Explained

#### 1. Transaction Details
- **Content:** Charge amount, date, time, merchant name, last 4 of card, reference ID
- **Purpose:** Prove the charge happened and is real
- **Format:** Simple key-value pairs with green checkmark if verified
- **Action:** Click → See full bank statement extract

#### 2. Subscription Agreement
- **Content:** Plan name, start date, trial length, stated renewal date, actual charge date
- **Purpose:** Show the discrepancy between promised date and actual charge
- **Format:** Timeline comparison (expected vs. actual)
- **Action:** Click → View original T&C screenshot or email

#### 3. Cancellation Records
- **Content:** All cancellation attempts (date, time, method, status, proof)
- **Purpose:** Document that user tried to stop the charge and it wasn't processed
- **Format:** Numbered list with status indicators
- **Action:** Click → Expand screenshot of cancellation attempt

#### 4. User Communications
- **Content:** Email alerts (or lack thereof), SMS notifications, billing statements
- **Purpose:** Show user was not warned and had no visibility
- **Format:** Timeline of communications received vs. missing
- **Action:** Click → View email headers or download docs

#### 5. Chargeback Keywords / Confidence Score
- **Content:** Dispute reason keywords and percentage match to policy violations
- **Purpose:** Give user confidence they have a strong case
- **Format:** Checklist with confidence score (e.g., 87%)
- **Action:** Click → See dispute reason details and what to tell bank

### Evidence Completeness Indicator
- **Visual:** Green checkmark + "Complete" label per section
- **Purpose:** Users feel confident all proof is organized
- **Rule:** Section is "complete" when all key facts are documented
- **Incomplete Sections:** Show orange warning "Missing X proof — add screenshot"

---

## Section 4: Document Proof Area

### Attached Documents Section
```
┌─ Proof Documents ──────────────────────────────────┐
│                                                   │
│ 📄 Email: Netflix Trial Confirmation              │
│    Mar 25, 2026 | States "14-day free trial"    │
│    [View] [Remove]                                │
│                                                   │
│ 📄 Email: Netflix Renewal Notice (MISSING)        │
│    Expected but never received                    │
│    [Request from Netflix▼]                        │
│                                                   │
│ 📸 Screenshot: My Netflix Account Settings         │
│    Apr 9, 2026 | Shows active cancel button       │
│    [View] [Remove]                                │
│                                                   │
│ 📊 Bank Statement Extract                          │
│    Apr 9, 2026 | Charge: $14.99 to Netflix       │
│    [View] [Remove]                                │
│                                                   │
│ [+ Add More Proof] [+ Request from Merchant]      │
│                                                   │
└───────────────────────────────────────────────────┘
```

### Document Interaction
- **Upload:** Users can add screenshots, emails, statements as evidence
- **Delete:** Remove documents that are incorrect or duplicate
- **Request:** Button to request missing proof from merchant (auto-generates email to Netflix support with dispute ID)
- **Labels:** Suggested labels appear (Date, type of document)
- **Preview:** Click thumbnail to view full image/PDF

---

## Section 5: Action Bar (Bottom)

### Desktop Layout (Full Width)
```
┌──────────────────────────────────────────────────┐
│ [← Back] [Refresh]    [Export PDF] [Email Draft] │
└──────────────────────────────────────────────────┘
```

### Mobile Layout (Stacked)
```
[← Back]
[Refresh]
[Export PDF]
[Email Draft]
```

### Action Buttons

#### Button 1: Refresh Dispute Status
- **Action:** Polls backend for updates (chargeback response, merchant reply)
- **Visual:** Spinning refresh icon while loading
- **Feedback:** Toast notification ("No updates yet" OR "Status changed to: Resolved")
- **Use Case:** User checking if merchant responded

#### Button 2: Export as PDF
- **Action:** Generates downloadable PDF with:
  - Header (subscription name, dispute ID, status)
  - Full timeline (all events)
  - All evidence sections (formatted for readability)
  - Footer with dispute reference number
- **Filename:** `Dispute-Netflix-Apr10-2026.pdf`
- **Use Case:** User wants to share with bank or lawyer
- **Visual Feedback:** Download starts immediately; "PDF downloaded" toast

#### Button 3: Generate Email Draft
- **Action:** Pre-fills email template with:
  - Subject: "[DISPUTE] Netflix Unauthorized Charge #1847"
  - Body: Narrative of timeline + links to PDF + key proof points
  - Address field: Merchant support email (pre-populated)
  - CC: Bank dispute email (if applicable)
- **Recipient Options:** Merchant | Bank/Credit Card | Both
- **Visual:** Opens email client (Gmail, Outlook) or shows copy-to-clipboard option
- **Use Case:** User emails dispute package to merchant/bank
- **Content Example:**
  ```
  Subject: DISPUTE - Unexpected Netflix Charge #1847
  
  Dear Netflix,
  
  I am disputing a charge on my account dated April 9, 2026 for $14.99.
  
  SUMMARY:
  - I signed up for Netflix on Mar 25, 2026 with a 14-day free trial (ending Apr 8)
  - On Apr 9 (1 day early), I was charged $14.99 without warning
  - I attempted to cancel immediately at 11:45 AM but received no confirmation
  
  ATTACHED: Complete dispute timeline and evidence (see PDF)
  
  Dispute ID: #1847
  Date submitted: April 10, 2026
  
  Please refund this charge and confirm cancellation.
  
  Regards,
  [User Name]
  ```

---

## Section 6: Status & Next Steps

### Status Summary Card
```
┌─ What Happens Next ────────────────────────────┐
│                                                │
│ Your Dispute Status: ACTIVE                    │
│ ├─ Evidence compiled: 4/4 sections complete   │
│ ├─ Confidence score: 87% (strong case)        │
│ └─ Next step: Submit to merchant or bank      │
│                                                │
│ Timeline:                                      │
│ • Day 1-3: Bank reviews your dispute          │
│ • Day 4-5: Bank contacts merchant              │
│ • Day 6-10: Merchant has 10 days to respond   │
│ • Day 11: Bank issues preliminary ruling       │
│ • Day 30: Final decision issued                │
│                                                │
│ Tips:                                          │
│ ✓ Download PDF as backup                      │
│ ✓ Send email to both merchant AND bank        │
│ ✓ Keep dispute ID handy for follow-ups        │
│                                                │
└────────────────────────────────────────────────┘
```

---

## UX PRINCIPLES

### Principle 1: Timeline Must Feel Clear & Trustworthy
- **Numbered Events:** 1, 2, 3, 4, 5 sequence shows logical flow
- **Color Coding:** Each event type has consistent color (Blue for charge, Orange for renewal, Purple for cancellation, Red for alert, Green for success)
- **Chronological Order:** Events flow top-to-bottom in order they happened
- **Timestamps:** Every event has exact date/time to prove sequence
- **Visual Hierarchy:** Most recent/important event highlighted with subtle glow
- **No Ambiguity:** Each event answer: "What? When? Why is this proof?"

### Principle 2: User Should Feel Confident They Have Proof
- **Checkmarks:** Every evidence section has green ✓ when complete
- **Confidence Score:** Percentage (87%) tells user their case is strong
- **Completeness Meter:** Shows 4/4 sections collected (visual progress)
- **Clear Next Steps:** Tells user exactly what to do (submit PDF to bank)
- **Highlight Discrepancies:** Bold the facts that prove the case: "Promised April 8 → Charged April 9"
- **No Hidden Information:** All proof is visible on one page; nothing buried in menus

### Principle 3: Copy Must Be Simple & Actionable
- **Event Titles:** Short, clear (not "Automated system policy adherence check failed")
- **Evidence Labels:** Use user language (not "Transaction log extract") — use "Charge Details"
- **Actions:** Clear buttons with direct outcomes ("Export PDF" not "Generate formatted export")
- **Warnings:** Red for critical ("Early renewal violates policy") but not alarmist tone

### Principle 4: Proof Must Feel UN-Alterable (Trust Factor)
- **Source Indicators:** Every piece of data shows where it came from ("From your bank statement" or "From Netflix email")
- **Timestamps:** Every fact has exact date/time (can't be challenged as "old information")
- **Document Preview:** Show actual screenshots of emails/statements (not just our paraphrase)
- **Reference Numbers:** Transaction ID, dispute ID, email headers → proof can be verified independently

---

## INTERACTION FLOWS

### Flow 1: User Viewing Dispute for First Time
1. User arrives at Dispute Studio
2. Header shows subscription name + "Active dispute" status
3. User scans timeline (5-10 seconds) → sees clear sequence of events
4. User scrolls down → sees evidence sections with green checkmarks
5. User feels confident → clicks "Export PDF" to back up their case
6. User can then email to bank or merchant

### Flow 2: User Following Up After Bank Response
1. User clicks "Refresh" button
2. System polls backend for updates
3. If merchant responded: Timeline adds new event (e.g., "Bank: Chargeback decision made")
4. Status may change to "Resolved" (green checkmark)
5. User downloads updated PDF showing resolution

### Flow 3: User Adding Missing Proof
1. User sees orange warning: "Missing: Netflix confirmation email"
2. User clicks "Add More Proof"
3. File upload dialog appears
4. User uploads screenshot or email
5. System auto-labels the document
6. Section now shows green ✓ "Complete"
7. Confidence score may increase (e.g., 87% → 92%)

---

## MOBILE CONSIDERATIONS

- **Timeline:** Dots on left, event details on right (same as desktop)
- **Evidence Sections:** Stack vertically, each expandable with a + icon
- **Documents:** Scrollable horizontal list of thumbnails
- **Action Bar:** Stacks into single column
- **Text:** Readable at mobile size (min 14px)
- **Buttons:** 44px + tap targets
- **PDF Export:** Opens in device PDF reader or email client

---

## ACCESSIBILITY

- **Timeline:** Semantic HTML for event list (use `<ol>` element)
- **Color:** Don't rely on color alone (use icons + labels)
- **Contrast:** All text meets WCAG AA (4.5:1 ratio)
- **Screen Reader:** Read timeline top-to-bottom, event types announced
- **Focus Indicators:** Clear blue focus ring on all interactive elements
- **Labels:** Every input, button, and section has accessible name
