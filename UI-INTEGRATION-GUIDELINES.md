# Neural Data Wallet - UI Integration Guidelines v2.0

**Project:** Neural Data Wallet (CortexVault)
**Version:** 2.0 (Professional Light Mode)
**Purpose:** Trust-focused design for healthcare/neurotech data platform

---

## 🎨 Design Philosophy

### Core Values
1. **Trust** - Clean, clinical aesthetic (like medical software)
2. **Safety** - Whitespace, clear hierarchy, no clutter
3. **Professional** - Enterprise-grade, not consumer-fancy

### Light Mode Only
No dark mode. Pure white backgrounds with subtle gray accents.

---

## 📐 Color Palette

### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Primary Blue | `#1E40AF` | Primary buttons, active states, links |
| Primary Hover | `#1E3A8A` | Button hover states |
| Secondary | `#64748B` | Secondary text, icons |

### Background Colors
| Name | Hex | Usage |
|------|-----|-------|
| Page Background | `#FFFFFF` | Main content area |
| Card Background | `#F8FAFC` | Surface/cards (slightly off-white) |
| Section Background | `#F1F5F9` | Alternate sections |
| Border | `#E2E8F0` | Dividers, card borders |

### Semantic Colors
| Name | Hex | Usage |
|------|-----|-------|
| Success | `#059669` | Success states, positive metrics |
| Warning | `#D97706` | Warnings, attention needed |
| Error | `#DC2626` | Errors, critical alerts |
| Info | `#0284C7` | Informational badges |

### Brain Wave Band Colors (for EEG)
| Band | Hex | Frequency |
|------|-----|-----------|
| Delta | `#8B5CF6` | 0.5-4 Hz |
| Theta | `#3B82F6` | 4-8 Hz |
| Alpha | `#10B981` | 8-13 Hz |
| Beta | `#F59E0B` | 13-30 Hz |
| Gamma | `#EF4444` | 30-100 Hz |

---

## 🅰️ Typography

### Font Family
- **Primary:** Inter (already in project via `next/font/google`)
- **Monospace:** JetBrains Mono (for data values)

### Font Sizes
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | 32px | 700 | 1.2 |
| H2 | 24px | 600 | 1.3 |
| H3 | 20px | 600 | 1.4 |
| Body | 16px | 400 | 1.5 |
| Small | 14px | 400 | 1.5 |
| Caption | 12px | 500 | 1.4 |

---

## 📏 Spacing System

Based on 4px grid:

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight spacing |
| sm | 8px | Icon spacing |
| md | 16px | Standard padding |
| lg | 24px | Section spacing |
| xl | 32px | Major sections |
| 2xl | 48px | Page margins |

---

## 🧩 Component Specifications

### Cards
```tsx
// Standard Card
<div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
  // Content
</div>

// Stats Card (Dashboard)
<div className="bg-white border border-gray-200 rounded-lg p-4">
  <div className="text-sm text-gray-500">{label}</div>
  <div className="text-2xl font-bold text-gray-900">{value}</div>
  <div className="text-xs text-gray-400">{trend}</div>
</div>
```

### Buttons
```tsx
// Primary Button
<button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium">
  {children}
</button>

// Secondary Button
<button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium">
  {children}
</button>

// Ghost Button
<button className="text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium">
  {children}
</button>
```

### Input Fields
```tsx
<input
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  placeholder="Enter wallet address"
/>
```

---

## 📱 Layout Specifications

### Page Layout
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (sticky, h-16, bg-white, border-b)                   │
│ Logo (left) | Nav (center) | Wallet Connect (right)        │
├─────────────────────────────────────────────────────────────┤
│ MAIN CONTENT (max-w-6xl, mx-auto, p-6)                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Stats Row (grid cols-4)                                  │ │
│ │ [Total Data] [Researchers] [Last Upload] [Status]        │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Content Sections                                        │ │
│ │ - Section 1: Data List                                  │ │
│ │ - Section 2: Access Management                          │ │
│ │ - Section 3: Activity Timeline (if applicable)          │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints
- **Mobile:** < 640px (single column)
- **Tablet:** 640px - 1024px (2 columns)
- **Desktop:** > 1024px (full layout)

---

## 🧠 EEG Visualization Guidelines

### Waveform Display
- Background: `#F8FAFC` (light gray)
- Line Color: `#3B82F6` (blue)
- Line Width: 1.5px
- Height per channel: 60px

### Band Power Badges
- Use consistent band colors (see Brain Wave Colors above)
- Display: Band name, power value, frequency range
- Layout: Horizontal grid (5 columns on desktop)

---

## ✅ Implementation Checklist

### Phase 1 - MVP+ (Current)

- [ ] Update `tailwind.config.js` with new color palette
- [ ] Update `globals.css` with Inter font
- [ ] Create `Header` component with navigation
- [ ] Create `Footer` component
- [ ] Create `DashboardStats` component with 4 stat cards
- [ ] Create `ActivityTimeline` component for access history
- [ ] Update Patient page with new layout
- [ ] Update Researcher page with new layout
- [ ] Style all existing components to match new design

### Phase 2 - Post Hackathon
- [ ] Add real-time notifications
- [ ] Add data export functionality
- [ ] Add advanced filtering/search
- [ ] Add mobile responsive polish

---

## 📁 File Changes Needed

| File | Action |
|------|--------|
| `tailwind.config.ts` | Add custom colors |
| `src/app/globals.css` | Add Inter font |
| `src/components/Header.tsx` | NEW - Navigation header |
| `src/components/Footer.tsx` | NEW - Footer |
| `src/components/DashboardStats.tsx` | NEW - Stats cards |
| `src/components/ActivityTimeline.tsx` | NEW - Access history |
| `src/app/patient/page.tsx` | UPDATE - New layout |
| `src/app/researcher/page.tsx` | UPDATE - New layout |
| `src/app/page.tsx` | UPDATE - New layout |

---

*Last Updated: 2026-03-30*
*Version: 2.0*