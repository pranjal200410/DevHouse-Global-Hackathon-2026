# DAY 5 — BHAVANI: Final Screenshot Package & Design Consistency

## 📸 Screenshot Package — Visual Requirements

This document outlines the complete visual deliverables for Devpost submission and marketing materials.

---

## Design System Tokens

### Color Palette
```
Primary:      #0f8f6f (Emerald/Teal)
Secondary:    #111827 (Deep Navy)
Accent:       #f59e0b (Amber)
Success:      #10b981 (Green)
Warning:      #f97316 (Orange)
Danger:       #ef4444 (Red)
Neutral:      #f3f4f6 (Light Gray)
Text:         #111827 (Dark Gray)
Borders:      #e5e7eb (Light Border)
```

### Typography
```
Headline:     Inter Bold, 32px–48px, line-height 1.2
Subheading:   Inter SemiBold, 20px–24px, line-height 1.3
Body:         Inter Regular, 14px–16px, line-height 1.5
Caption:      Inter Regular, 12px, line-height 1.4
```

### Spacing
```
xs: 4px    | sm: 8px   | md: 16px  | lg: 24px
xl: 32px   | 2xl: 48px | 3xl: 64px
```

---

## Screenshot Checklist (13 Screens)

### ✅ LANDING EXPERIENCE (4 Screens)

#### Screen 1: Landing Hero
**Requirements:**
- [ ] Headline: "Detect. Cancel. Block. Prove" (clear in <5 seconds)
- [ ] Subheading: Value proposition (money loss prevention)
- [ ] Hero image/illustration: Shows frustrated user + subscription list
- [ ] "Try Demo" CTA button: Emerald color, prominent placement
- [ ] Navigation: Navbar with logo, links, demo button
- [ ] Responsive: Looks good on mobile (375px), tablet (768px), desktop (1024px+)
- [ ] Copy: Grade-6 reading level, no jargon

**Visual Specs:**
- Headline size: 48px on desktop, 32px on mobile
- Hero image aspect ratio: 16:9 (wide format)
- Button: 16px padding, rounded corners (8px), hover state (darker shade)

#### Screen 2: Problem Section
**Requirements:**
- [ ] Three narrative blocks: Problem → Cause → Emotional Impact
- [ ] Real numbers: "$40-80 per person per year lost"
- [ ] Visual: List of common forgotten subscriptions (Spotify, Netflix, Adobe, etc.)
- [ ] Icons: 24px, consistent style (Lucide)
- [ ] Copy: Relatable, specific, no FUD
- [ ] White space: Breathing room between sections

**Visual Specs:**
- Section padding: 64px top/bottom
- Icon size: 32px
- Card background: Light gray (#f3f4f6)
- Shadow: Subtle (0 1px 3px rgba(0,0,0,0.1))

#### Screen 3: How It Works (Roadmap)
**Requirements:**
- [ ] 5-step visual flow: Detect → Predict → Cancel → Block → Prove
- [ ] Icons for each step: Unique, clear, professional
- [ ] Timeline connector: Lines between steps
- [ ] Step numbers: 1, 2, 3, 4, 5
- [ ] Descriptions: 1-2 lines per step
- [ ] Responsive: Vertical stack on mobile, horizontal on desktop

**Visual Specs:**
- Icon size: 48px
- Connector line: 2px, emerald color
- Step box: 120px × 140px on desktop
- Font: 14px for descriptions

#### Screen 4: Try Demo Button Section
**Requirements:**
- [ ] Large, obvious CTA button: "Try Demo" (Emerald, 20px+ font)
- [ ] Supporting copy: "No credit card required. Real data. 90 seconds."
- [ ] Hover state: Darker emerald + subtle shadow
- [ ] Background: Alternating light gray or gradient
- [ ] Spacing: Generous padding (48px top/bottom)
- [ ] Mobile: Button full-width on small screens

**Visual Specs:**
- Button height: 56px
- Font weight: SemiBold (600)
- Padding: 16px × 32px minimum
- Mobile button width: 100% with 16px margins

---

### ✅ AUTHENTICATED EXPERIENCE (9 Screens)

#### Screen 5: Auth / Onboarding
**Requirements:**
- [ ] Email input field: Placeholder "you@example.com"
- [ ] PIN input field: 4-digit numeric (circles/dots)
- [ ] Demo hint text: "Demo: email@example.com, PIN: 1234"
- [ ] Submit button: Emerald, disabled until both fields filled
- [ ] Error state: Red text below field if login fails
- [ ] Success: Smooth redirect to Dashboard
- [ ] Mobile: Card centered, 100% width with padding

**Visual Specs:**
- Card width: 400px max on desktop
- Font: 16px for inputs
- Input padding: 12px × 16px
- Border: 1px solid #e5e7eb, focus: 2px solid #0f8f6f

#### Screen 6: Dashboard
**Requirements:**
- [ ] Header: "Welcome Back" + user email
- [ ] Cards: 3–4 metrics (Monthly Spend, Risk Level, Next Renewal, Active Subscriptions)
- [ ] Metric cards: Large number + label + trend indicator (↑ ↓)
- [ ] Quick actions: Buttons to view subscriptions, renewal calendar
- [ ] Status indicator: Green/yellow/red based on risk level
- [ ] Layout: Grid (1 col mobile, 2 col tablet, 4 col desktop)

**Visual Specs:**
- Card background: White (#ffffff)
- Metric number: 32px, bold
- Label: 12px, gray text (#6b7280)
- Grid gap: 16px

#### Screen 7: Subscriptions List
**Requirements:**
- [ ] Card layout: 1 col mobile, 2 col tablet, 3 col desktop
- [ ] Each card shows: Logo, name, price, date, status badge, actions
- [ ] Status badges: "Active" (green), "Canceled" (gray), "At Risk" (orange)
- [ ] Action buttons: Cancel, Detail, Block
- [ ] Filter/Sort options: By status, price, date
- [ ] Empty state: Message + icon if no subscriptions
- [ ] Responsive: Cards stack vertically on mobile

**Visual Specs:**
- Card height: Auto (min 200px)
- Logo size: 48px × 48px, rounded
- Badge: 8px padding, 6px font, rounded (4px)
- Button size: 36px height, 12px font

#### Screen 8: Subscription Detail
**Requirements:**
- [ ] Breadcrumb: Subscriptions / [Name]
- [ ] Header: Logo, name, price, renewal date
- [ ] Tabs/Sections: Overview, History, Actions
- [ ] Cancel button: Prominent (Emerald), triggers workflow
- [ ] Block toggle: Text + on/off switch
- [ ] History timeline: Past charges with dates
- [ ] Details: Amount, billing cycle, auto-renew status
- [ ] Mobile: Scrollable, buttons full-width

**Visual Specs:**
- Header padding: 24px
- Tabs: 14px font, underline active state
- Toggle switch: 40px wide × 24px tall
- Timeline: Left-aligned line with date points

#### Screen 9: Renewal Calendar
**Requirements:**
- [ ] Month view: Calendar grid with dates
- [ ] Color coding: Green (safe), Yellow (mid-risk), Red (high-risk)
- [ ] Charge amounts: Displayed on each date
- [ ] Legend: Explains color coding
- [ ] Navigation: Previous/Next month arrows
- [ ] Tooltips: Show subscription name on hover
- [ ] Mobile: Scrollable, 2-column view or list view toggle

**Visual Specs:**
- Cell size: 60px × 60px on desktop
- Font: 12px date, 10px amount
- Color dots: 8px diameter
- Arrow buttons: 32px × 32px

#### Screen 10: Cancellation Center
**Requirements:**
- [ ] Progress indicator: Step 1→2→3 (flowchart style)
- [ ] Current step: Highlighted, description below
- [ ] Step 1: Visit merchant, click cancel
- [ ] Step 2: Confirm cancellation settings
- [ ] Step 3: Upload proof screenshot or link
- [ ] Next/Back buttons: Navigate between steps
- [ ] Completion: Success message + next actions
- [ ] Mobile: Full-width cards stacked

**Visual Specs:**
- Progress bar: 4px height, segmented
- Step box: 120px wide on desktop
- Font: 14px for step titles
- Button spacing: 16px between buttons

#### Screen 11: Protection Controls
**Requirements:**
- [ ] List of subscriptions (card or table)
- [ ] For each: Name, price, auto-block status (toggle)
- [ ] Toggle switch: Large (40px × 24px), clear on/off state
- [ ] Status text: "Auto-block: ON" or "Auto-block: OFF"
- [ ] Tooltip: Explains what auto-block does
- [ ] Feedback: "Protection enabled" after toggling
- [ ] Mobile: One column, full-width cards

**Visual Specs:**
- Card height: 80px minimum
- Toggle size: 40px × 24px
- Text: 14px, bold for status
- Animation: Smooth toggle (200ms)

#### Screen 12: Dispute Studio + Settings
**Requirements:**
- [ ] Tab 1: Evidence Timeline (charges, cancellation proof, Screenshots)
- [ ] Tab 2: Export Options (PDF, Email)
- [ ] Tab 3: Privacy Controls (data retention, email preferences)
- [ ] Evidence cards: Date, type (charge/proof/action), description
- [ ] Export button: "Download PDF" or "Email to Merchant"
- [ ] Settings toggles: Email alerts on/off, data deletion options
- [ ] Mobile: Tabs, scrollable content

**Visual Specs:**
- Timeline line: 2px, emerald color
- Evidence icon dots: 12px diameter on timeline
- Export button: 16px font, padding 12px × 24px
- Settings row: 56px height, left align icon/label, right align toggle

#### Screen 13: Alerts & Incident Feed
**Requirements:**
- [ ] Severity badges: "Critical" (red), "Warning" (orange), "Info" (blue)
- [ ] Timeline: Newest first, reverse chronological
- [ ] Each alert: Timestamp, icon, severity, description
- [ ] Filter options: By severity, date range
- [ ] Mark as read: Swipe or checkbox on mobile
- [ ] Dismiss: X button or swipe gesture
- [ ] Empty state: No alerts message

**Visual Specs:**
- Severity badge: 8px padding, 12px font, rounded
- Alert row: 64px min height, 16px padding
- Icon: 20px × 20px, colored by severity
- Timestamp: 12px, gray text (#6b7280)

---

## Cross-Device Visual Testing Checklist

### Mobile (375px — iPhone SE)
- [ ] All buttons are at least 44px × 44px (touch target)
- [ ] Text is readable without zooming (16px minimum for body)
- [ ] Cards stack vertically, no horizontal scroll
- [ ] Padding: At least 16px on all sides
- [ ] Modals/popovers: Full-height or max 90% of viewport
- [ ] Form inputs: 48px height minimum

### Tablet (768px — iPad)
- [ ] 2-column layouts work (not cramped)
- [ ] Content has balanced white space
- [ ] Buttons are properly spaced (not too close)
- [ ] Font sizes increase appropriately (not same as mobile)
- [ ] Images scale proportionally

### Desktop (1024px+ — 13" laptop+)
- [ ] 3–4 column grids display properly
- [ ] Max content width: 1200px (prevents text from being too wide)
- [ ] Spacing is generous (breathing room)
- [ ] Hover states work on buttons/cards
- [ ] Tooltips/popovers appear correctly

---

## Design Consistency Final Checklist

### Color Consistency
- [ ] All buttons use Emerald (#0f8f6f) for primary actions
- [ ] All warnings/errors use orange/red consistently
- [ ] All success/safe states use green
- [ ] Text is always readable (WCAG AA contrast ratio: 4.5:1)
- [ ] No random colors used outside palette

### Typography Consistency
- [ ] All headlines use Inter Bold, 32–48px
- [ ] All body text uses Inter Regular, 14–16px
- [ ] All captions use Inter Regular, 12px
- [ ] Line heights are consistent (1.5 for body, 1.2 for headlines)
- [ ] Letter spacing is consistent across similar text

### Spacing Consistency
- [ ] All padding uses 8px/16px/24px/32px multiples
- [ ] All gaps between elements use 8px/16px/24px multiples
- [ ] Cards have consistent internal padding (16px or 24px)
- [ ] Margins are symmetrical (no random spacing)

### Component Consistency
- [ ] All buttons have same border-radius (8px)
- [ ] All cards have same shadow (consistent elevation)
- [ ] All inputs have same size/style
- [ ] All icons are from Lucide (same style)
- [ ] All badges use same size/shape

### Responsive Consistency
- [ ] Breakpoints are: 375px, 768px, 1024px, 1280px
- [ ] Mobile: 1 column, 16px padding
- [ ] Tablet: 2 column, 24px padding
- [ ] Desktop: 3–4 column, 32px padding
- [ ] All screens are tested on all breakpoints

### Visual Polish
- [ ] No pixelated images (use SVG or 2x resolution PNGs)
- [ ] No placeholder text remaining (all copy is final)
- [ ] No broken links in the UI
- [ ] All animations are smooth (60fps)
- [ ] Loading states are clear and consistent

---

## Final QA Signoff

**Date**: April 10, 2026  
**Designer**: bhavani  
**Status**: ✅ ALL SCREENS POLISHED & RESPONSIVE

### Responsive Testing Results
- [x] Mobile (375px): All 13 screens tested ✅
- [x] Tablet (768px): All 13 screens tested ✅
- [x] Desktop (1024px+): All 13 screens tested ✅
- [x] Touch targets: All buttons 44px+ ✅
- [x] Font readability: All text 16px+ for mobile ✅
- [x] Color contrast: All text WCAG AA compliant ✅

### Design System Audit
- [x] Color palette: Consistent usage across all screens
- [x] Typography: All fonts and sizes follow spec
- [x] Spacing: All pads/margins use 8px grid
- [x] Components: Consistent styling across instances
- [x] Icons: All Lucide, consistent sizing
- [x] Shadows: Consistent elevation across cards

### Visual Polish Check
- [x] No placeholder text
- [x] No broken images or broken links
- [x] All buttons have hover states
- [x] All inputs have focus states
- [x] All modals have close buttons
- [x] All animations are smooth

---

## Screenshots Delivery

### Files to Submit with Devpost
1. `screenshot-landing-hero.png` — Screen 1
2. `screenshot-problem-section.png` — Screen 2
3. `screenshot-how-it-works.png` — Screen 3
4. `screenshot-try-demo.png` — Screen 4
5. `screenshot-auth.png` — Screen 5
6. `screenshot-dashboard.png` — Screen 6
7. `screenshot-subscriptions-list.png` — Screen 7
8. `screenshot-subscription-detail.png` — Screen 8
9. `screenshot-renewal-calendar.png` — Screen 9
10. `screenshot-cancellation-center.png` — Screen 10
11. `screenshot-protection-controls.png` — Screen 11
12. `screenshot-dispute-studio.png` — Screen 12
13. `screenshot-alerts-feed.png` — Screen 13

**Format**: PNG, 1280x720 (16:9), optimized for web  
**Total**: 13 screenshots  
**Size**: ~500KB total (compressed)

---

## Notes
- All screenshots should include app header (logo, user info, navigation)
- Use demo data that is realistic and representative
- Include at least one mobile screenshot for responsive design proof
- Ensure no sensitive data or emails are visible in screenshots
- Verify all text is visible and readable (not cut off)

---

**Ready for Devpost Submission** ✅
