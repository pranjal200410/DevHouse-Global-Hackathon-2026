# Product-Level UX Specification: Subscriptions List Screen

**Purpose:** Enable users to quickly identify, assess, and manage all recurring subscriptions in a single view while minimizing risk of unwanted charges.

---

## INFORMATION HIERARCHY
### What Users See First → Last

#### TIER 1: IMMEDIATE VISUAL HIERARCHY (Processed in ~1 second)
- **Risk Level Badge** – **RIGHT SIDE, TOP-RIGHT** of card (highest visual weight)
  - Color-coded: Red (High) | Orange (Medium) | Green (Low)
  - Single clear word or simplified icon + text
  - Draws eye first due to color psychology
  
- **Merchant Name** – **LEFT SIDE, LARGE TEXT** (~24-28px size)
  - Primary identifier; user confirms "Is this the right subscription?"
  - Example: "Netflix", "Adobe Creative Cloud", "Slack"

#### TIER 2: CRITICAL TEMPORAL INFO (Processed in ~2-3 seconds)
- **Next Renewal Date** – **IMMEDIATELY BELOW MERCHANT** in secondary size (~16-18px)
  - Format: "Renews: April 15, 2026"
  - If renewal is within 3 days: **HIGHLIGHT WITH ACCENT COLOR** + clock icon
  - If renewal is within 24 hours: **BOLD + BLINKING/PULSING BORDER** to signify urgency

- **Billing Amount** – **SAME ROW AS RENEWAL or BELOW**, right-aligned
  - Format: "$9.99/month" (clear periodicity)
  - Font weight: Medium-bold for visual distinction
  - Supports easy comparison when scanning multiple cards

#### TIER 3: STATUS & ACTIONS (Processed in ~4-5 seconds)
- **Status Badge** – **BOTTOM-LEFT** of card
  - Options: "Active" (blue) | "Cancelling" (amber) | "Cancelled" (slate/gray)
  - Visual distinctness: Border style or background shade

- **Click Target/CTA** – **BOTTOM-RIGHT or FULL CARD CLICKABLE**
  - "View Details" button OR entire card is clickable
  - Reveal on hover (desktop) or always visible (mobile)

---

## VISUAL PRIORITY RULES

### Rule 1: High-Risk Subscriptions Dominate Page
- **High-Risk cards FLOAT TO TOP** (sorting below)
- **Red/danger accent color** on badge AND left card border
- **Optional:** Subtle warning icon (⚠️) in risk badge
- **Intent:** User cannot miss critical financial risks

### Rule 2: Imminent Renewals (Within 3 Days) Stand Out
- **Yellow/amber highlight box** around renewal date
- **Color intensity increases** as renewal approaches
  - 3+ days: Soft highlight
  - 1-3 days: Bold orange highlight + icon
  - < 24 hours: Bold red highlight + pulsing animation
- **Intent:** Prepare user for upcoming charge; prevent surprise

### Rule 3: Cancelling Status Signals Transition State
- **Amber/warning badge** instead of blue
- **Strikethrough or faded effect** on merchant name (optional)
- **Secondary label:** "Cancellation pending" if needed
- **Intent:** Clarify this is NOT active; distinguish from normal subscriptions

### Rule 4: Color Coding Consistency
- **Risk Level:** Low (Green #10B981) | Medium (Amber #F59E0B) | High (Red #EF4444)
- **Status:** Active (Blue #3B82F6) | Cancelling (Amber #F59E0B) | Cancelled (Gray #6B7280)
- **Renewal Urgency:** Normal (Black text) | 3-day warning (Orange highlight) | Imminent (Red highlight)

### Rule 5: Card Depth & Spacing
- **Active, Low-Risk:** Standard card depth (subtle shadow)
- **High-Risk or Imminent Renewal:** Elevated shadow OR left border accent (3-5px red/orange stripe)
- **Cancelled Subscriptions:** Reduced opacity (~60-70%) + flat appearance
- **Intent:** Visual hierarchy reflects urgency and active state

---

## VISUAL BEHAVIOR & INTERACTION

### Card Layout (Desktop & Mobile Responsive)
```
┌─────────────────────────────────────────┐
│ 🔴 HIGH RISK    [LEFT 3px RED BORDER]   │
│                                         │
│ Netflix                      $15.99/mo  │
│ Renews: Apr 12, 2026 ⏰ [3 DAY WARNING] │
│                                         │
│ [Active]  [View Details →]              │
└─────────────────────────────────────────┘
```

### Desktop Interaction
- **Hover State:** Subtle lift (shadow increase) + background slight brightening
- **Clickable Area:** Entire card acts as link
- **Visual Feedback:** Cursor changes to pointer; all text becomes slightly bolder on hover
- **Exit Animation:** Smooth 200ms fade when transitioning to detail view

### Mobile Interaction
- **Tap State:** Background emphasizes (slightly darker shade for 100ms)
- **Clickable Area:** Full card is tappable (min 44px × 44px touch target)
- **Visual Feedback:** Instant highlight feedback on tap

### Detail View Flow
- **Entry:** Slide up from bottom (mobile) OR fade in overlay (desktop)
- **Breadcrumb/Header:** Show merchant name + back arrow
- **Content:** Full subscription details (billing history, cancellation options, auto-block toggles)
- **Exit:** Swipe down (mobile) OR click back arrow; return to list view

---

## FILTERING & SORTING BEHAVIOR

### Filter Section (Top of List, Below Page Header)

#### Available Filters
- **Status:** Checkboxes for Active | Cancelling | Cancelled
  - Default view: Active + Cancelling enabled (show all relevant subscriptions)
  - Can combine: "Show Active AND Cancelling"
  
- **Risk Level:** Checkboxes for Low | Medium | High
  - Default: All enabled
  - Use case: "Show me only HIGH-RISK subscriptions"

#### Filter UX Rules
- **Visual Indicator:** Active filters shown in bold OR with badge count (e.g., "Active (3)")
- **Real-Time Updates:** Results update immediately without page reload
- **Clear Button:** Prominent "Clear all filters" link
- **Mobile:** Collapsible filter panel OR slide-in drawer
- **Apply Persists:** Selected filters persist during session (use localStorage)

### Sorting Options (Dropdown, Top-Right of List)

#### Sort Orders
1. **Renewal Date (Upcoming First)** – DEFAULT
   - Imminent renewals float to top
   - Helps users prepare for charges
   
2. **Risk Level (High → Low)**
   - Critical subscriptions first
   - User can focus on risky ones
   
3. **Price (High → Low)**
   - Largest expenses first
   - Supports budget prioritization
   
4. **Price (Low → High)**
   - Cheapest first
   - Rare but available for completeness
   
5. **Merchant Name (A → Z)**
   - Alphabetical for quick lookup

#### Sort UX Rules
- **Selected Sort:** Show current selection in dropdown label
- **Icon Indicator:** Small arrow showing ascending/descending direction
- **Mobile:** Simplify to 2-3 most-used sorts (Renewal, Risk, Price)
- **Persistence:** Remember last sort selection per session

---

## SUBSCRIPTION LIST SCANNING RULES
### Goal: 5-Second Comprehension Maximum

#### What Users Should Understand After 5 Seconds
1. ✅ How many subscriptions they have (count/number visible)
2. ✅ Which ones renew soon (imminent renewals highlighted)
3. ✅ Which ones are risky (high-risk badges visible at top)
4. ✅ How much they spend monthly (total shown in page header)
5. ✅ Quick action available (click card to drill down)

#### Content Minimalism Rules
- **No descriptions or explanations** on cards
- **No hidden content** requiring hover to reveal
- **Show only:** Merchant | Price | Renewal Date | Risk | Status
- **Rationale:** Overwhelming users delays comprehension

#### White Space Rules
- **Card padding:** 16-20px minimum
- **Card gap:** 12-16px between cards (vertical & horizontal)
- **List max-width:** 1200px (readability on ultra-wide screens)
- **Grid layout:** Desktop: 2-3 cards per row; Mobile: 1 card per row

---

## EDGE STATES & SPECIAL CASES

### Empty State (No Subscriptions)
- **Header:** "No subscriptions found"
- **Icon:** Wallet or checkmark (positive tone)
- **Message:** "You're all set! No active subscriptions."
- **CTA:** "How to add subscriptions" (link to onboarding/help)

### Loading State
- **Skeleton Cards:** Show 3-4 placeholder cards
- **Animation:** Gentle shimmer or pulse effect on skeletons
- **Timeout:** If loading > 5s, show error message

### Error State
- **Message:** "Could not load subscriptions. Please refresh."
- **Action:** Manual "Retry" button below message
- **Fallback:** "Last known subscriptions" (cached data if available)

### Filtered Results State
- **Message if zero results:** "No subscriptions match your filters."
- **Suggestion:** "Try adjusting filters or clearing selection."
- **Active Filters Display:** Show selected filters as removable chips/tags

### High-Risk Alert (3+ High-Risk Subscriptions)
- **Banner Alert:** Top of page, red/amber background
- **Message:** "⚠️ You have 3 HIGH-RISK subscriptions. Review now."
- **Action:** Auto-filter to HIGH RISK on banner click

---

## DEVICE-SPECIFIC RULES

### Desktop (1024px+)
- **Grid Layout:** 2-3 cards per row
- **Hover Effects:** Full card lift + shadow increase + text highlight
- **Filter/Sort:** Horizontal layout, both visible at top
- **Card Width:** ~300-400px optimal

### Tablet (768px - 1023px)
- **Grid Layout:** 2 cards per row
- **Touch Optimizations:** Larger click targets, no hover effects
- **Filter/Sort:** Filter in collapsible drawer; sort in dropdown

### Mobile (< 768px)
- **Grid Layout:** 1 card per row, full width with padding
- **Touch Optimizations:** 44px minimum tap target
- **Filter/Sort:** Filter hidden in drawer; sort in dropdown
- **Card Padding:** 12px (reduced to save space)

---

## ACCESSIBILITY RULES

- **Color Contrast:** All badges and text must pass WCAG AA (4.5:1 ratio)
- **Alt Text:** Risk/status badges include aria-label (e.g., "High risk subscription")
- **Keyboard Navigation:** Tab through cards in order; Enter to open detail
- **Screen Reader:** Announce merchant, price, renewal, risk, status in logical order
- **Focus Indicator:** Clear blue border (or custom) around focused card

---

## SUCCESS METRICS (Data to Track)

1. **Comprehension Time:** Measure avg time to first card click → target ≤ 5 seconds
2. **Filter Usage:** % of sessions using filters → indicates if finding needed subscriptions
3. **High-Risk Detection:** % of users clicking high-risk cards in first 30 seconds
4. **Renewal Awareness:** % of users clicking imminent renewal cards
5. **Error Recovery:** Time to retry after error state
6. **Cancellation Rate:** % of users viewing detail → initiating cancellation

---

## DEVELOPER HANDOFF CHECKLIST

- [ ] Implement 2-3 card per row desktop grid layout
- [ ] Apply risk-based color coding (Green/Amber/Red)
- [ ] Sort default: Renewal Date (Upcoming First)
- [ ] Highlight imminent renewals (< 3 days) in yellow/orange
- [ ] Add filter controls (Status & Risk Level)
- [ ] Make entire card clickable to detail view
- [ ] Test 5-second comprehension with users
- [ ] Add loading/error/empty states
- [ ] Ensure mobile responsiveness (1 card per row, 44px touch targets)
- [ ] Implement accessibility features (alt text, WCAG AA contrast)

## Sorting

### Sort Criteria
1. **Price:** Low to high or high to low
2. **Renewal Date:** Nearest first or furthest first

### Default Sort
- Recommend: **Renewal Date (Nearest First)**
- Rationale: Helps users focus on imminent charges first
- Alternative: Active subscriptions first, then cancelling/cancelled

### UI Implementation
- Sort controls should be visible and labeled clearly
- Current sort order should be always indicated (e.g., "Sorted by: Renewal Date ↑")
- Change sort with single click/tap

---

## UX Rules

### Rule 1: 5-Second Comprehension
- **Target:** User understands everything within 5 seconds
- **Implementation:**
  - Minimal text per card
  - Strong visual contrast between elements
  - No unnecessary decorative elements
  - Hierarchy is immediately obvious

### Rule 2: Avoid Clutter
- **Target:** Show only essential information
- **What to Include:** Merchant, price, renewal date, status, risk
- **What to Exclude:** Secondary details, fine print, rarely-used actions
- **Card Density:** Comfortable whitespace, not cramped

### Rule 3: Important Items Must Stand Out Immediately
- **Typography:** Use size, weight, and color to differentiate importance
- **Spacing:** Group related items; separate distinct concepts
- **Color:** Ensure contrast meets WCAG AA standards (4.5:1 for text)
- **Order:** Place high-importance items first

### Rule 4: Consistency & Balance
- **Spacing:** Uniform padding and margins across all cards
- **Grouping:** Related information grouped logically
- **Visual Weight:** Each card feels balanced, not lopsided
- **Alignment:** Elements align cleanly (left, center, or right consistently)

### Rule 5: Responsiveness
- **Desktop:** Cards in grid layout (2-3 columns depending on screen width)
- **Mobile:** Single column, full-width cards
- **Tablet:** 2-column layout
- **Priority Hierarchy:** Maintained across all screen sizes

---

## Visual Styling Guidelines

### Status Badge Colors
| Status | Color | Text |
|--------|-------|------|
| Active | Green | "Active" |
| Cancelling | Amber/Orange | "Cancelling" |
| Cancelled | Gray | "Cancelled" |

### Risk Level Colors
| Risk | Color | Icon |
|------|-------|------|
| Low | Green | ✓ |
| Medium | Amber | ⚠ |
| High | Red | ✕ or ⚠ |

### Card States
- **Default:** Clean, neutral background
- **Hover:** Subtle shadow lift or background color shift
- **Active/Selected:** Border or background accent
- **High Risk:** Stronger visual presence (e.g., colored left border)

---

## Accessibility Considerations

- Alt text for all icons and badges
- Color should not be the only differentiator (use text labels and icons)
- Sufficient contrast ratios for text and controls
- Keyboard navigation support for all interactive elements
- Screen reader friendly labels for status and risk badges

---

## Example Card Hierarchy (Low Risk vs. High Risk)

### Low Risk, Active Subscription
```
[Netflix]                          ← Merchant (Largest, Primary)
$15.99/month                       ← Price (Large, Secondary)
Renews: May 10, 2026               ← Renewal (Normal)
[Active Badge] [Low Risk Badge]    ← Status/Risk (Small)
```

### High Risk, Cancelling Subscription
```
[Expensive App]                    ← Merchant (Largest, Primary)
$49.99/month                       ← Price (Large, Strong)
Renews: April 12, 2026 ⚠           ← Renewal (Highlighted, Within 3 Days)
[⚠ Cancelling Badge] [✕ High Risk] ← Status/Risk (Prominent, Warning Colors)
```

---

## Implementation Checklist

- [ ] Card layout follows top-to-bottom hierarchy
- [ ] Merchant name is most prominent text element
- [ ] Price is visually strong and comparable
- [ ] Renewal dates within 3 days are highlighted
- [ ] Status and risk badges use distinct colors
- [ ] High-risk subscriptions stand out immediately
- [ ] Cancelling subscriptions show warning state
- [ ] Card click opens detail view
- [ ] Filter UI supports status filtering
- [ ] Sorting options are visible and functional
- [ ] All text readable within 5 seconds
- [ ] No visual clutter or unnecessary elements
- [ ] Responsive design tested on mobile/tablet/desktop
- [ ] Accessibility standards met (WCAG AA)
- [ ] Consistent spacing and alignment across cards
