# Subscription List Page - UX Specification

## Purpose
- Help users track recurring subscriptions and avoid unwanted charges
- Let users scan current status, upcoming renewals, and risk at a glance
- Reduce anxiety by showing only essential subscription details

---

## Card Layout (Top to Bottom)

### 1. Merchant Name
- **Role:** Primary focus
- **Typography:** Largest, most readable text on the card
- **Purpose:** First item users scan to identify the subscription

### 2. Price
- **Role:** Secondary emphasis
- **Styling:** Visually strong and easy to compare across cards
- **Format:** Show recurring price (e.g., "$9.99/month")

### 3. Next Renewal Date
- **Role:** Important temporal information
- **Display:** Clear date label (e.g., "Renews: April 15, 2026")
- **Special State:** Highlight when renewal is within 3 days
- **Visual Treatment:** Use accent color or badge for imminent renewals

### 4. Status Badge
- **Options:** Active, Cancelling, Cancelled
- **Placement:** Lower section of card
- **Styling:** Visually distinct state styles for each status

### 5. Risk Level Badge
- **Options:** Low, Medium, High
- **Placement:** Near status badge for quick risk reading
- **Purpose:** Surface subscription risk at a glance

---

## Visual Priority Rules

### Rule 1: High Risk Must Be Most Visually Prominent
- Use strong color (e.g., red/danger color palette)
- Apply bold or capitalized label
- Consider accent border or icon to signal urgency
- High-risk cards should dominate the visual hierarchy

### Rule 2: Cancelling Must Show Warning State
- Use warning color (e.g., amber/orange)
- Add warning icon or visual indicator
- Communicate urgency to prevent confusion with active subscriptions
- Contrast sharply from normal subscriptions

### Rule 3: Upcoming Renewal Must Be Highlighted
- If renewal date is within 3 days, apply visual emphasis
- Highlight the date field with accent color or background
- Consider adding a subtle icon (e.g., clock or alert)
- Help users prepare for upcoming charges

### Rule 4: Merchant Name Remains Primary
- Keep as the dominant visual element
- All other information should support rather than compete with merchant name
- Maintain consistent typography hierarchy across all cards

---

## Interaction Behavior

### Card Interaction
- **Clickable Area:** Entire card acts as a tappable/clickable target
- **Action:** Opens detailed subscription view
- **Feedback:** Clear hover/active state (shadow, background shift, or outline)

### Detail View
- **Content:** Full billing information, plan details, cancellation options
- **Navigation:** Clear entry and exit paths to/from card detail
- **Structure:** Maintain context so users understand they're viewing a single subscription

### User Flow
1. User scans card list (5 seconds max comprehension)
2. Clicks specific card for more details
3. Views full subscription information
4. Can cancel, edit, or return to list

---

## Filters

### Available Filter Options
- **Status:** Active, Cancelling, Cancelled
- **Purpose:** Narrow subscriptions to relevant categories
- **UX:** Checkbox or button-based filter UI

### Filter Behavior
- Multiple filters can be combined (AND logic)
- Applied filters should be visually indicated (e.g., active state, count badges)
- "Clear filters" option should be prominent
- Filter results should update in real-time

---

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
