# Digital Life Lessons - Theme Configuration Guide

## 🎨 Centralized Theme Colors

All theme colors are configured in **ONE PLACE**: `tailwind.config.js`

### Primary Color Definitions

```javascript
// Location: tailwind.config.js
primary: "#4f46e5"           // Indigo-600 - Main brand color
primary-focus: "#4338ca"     // Indigo-700 - Hover/focus state (light mode)
primary-focus: "#6366f1"     // Indigo-500 - Hover/focus state (dark mode)
primary-content: "#ffffff"   // White text on primary buttons
```

### How to Use

#### Buttons
```jsx
// Primary button (uses theme primary color)
<button className="btn btn-primary">Click Me</button>

// Primary button with hover (automatically uses primary-focus)
<button className="btn btn-primary hover:btn-primary-focus">Hover Effect</button>

// Secondary button
<button className="btn btn-secondary">Secondary Action</button>
```

#### Text Colors
```jsx
// Primary colored text
<h1 className="text-primary">Heading</h1>

// Secondary colored text
<p className="text-secondary">Description</p>
```

#### Backgrounds
```jsx
// Primary background
<div className="bg-primary text-primary-content">Content</div>

// Secondary background
<div className="bg-secondary">Content</div>
```

## 🔧 How to Change Theme Colors

### Method 1: Update tailwind.config.js (Recommended)

Edit the color values in `tailwind.config.js`:

```javascript
daisyui: {
  themes: [
    {
      light: {
        primary: "#YOUR_COLOR_HERE",        // Change this
        "primary-focus": "#YOUR_HOVER_COLOR", // And this
        // ...
      }
    }
  ]
}
```

### Method 2: Use Different DaisyUI Theme

```javascript
// In tailwind.config.js, replace custom theme with preset
daisyui: {
  themes: ["cupcake", "dark", "cyberpunk"], // Use built-in themes
}
```

## 📋 Complete Color Palette

### Light Mode
- **Primary**: `#4f46e5` (Indigo-600) - Buttons, links, accents
- **Primary Focus**: `#4338ca` (Indigo-700) - Hover states
- **Secondary**: `#06b6d4` (Cyan-500) - Secondary actions
- **Accent**: `#8b5cf6` (Violet-500) - Special highlights
- **Base-100**: `#ffffff` - Main background
- **Base-200**: `#f3f4f6` - Cards, sections
- **Base-300**: `#e5e7eb` - Borders, dividers

### Dark Mode
- **Primary**: `#4f46e5` (Indigo-600) - Consistent with light
- **Primary Focus**: `#6366f1` (Indigo-500) - Lighter for dark bg
- **Secondary**: `#06b6d4` (Cyan-500) - Consistent
- **Base-100**: `#1e293b` (Slate-800) - Main background
- **Base-200**: `#0f172a` (Slate-900) - Cards, sections
- **Base-300**: `#020617` (Slate-950) - Darkest elements

## 🚀 Quick Reference

| Element | Class | Color Used |
|---------|-------|------------|
| Primary Button | `btn-primary` | `primary` |
| Text Link | `text-primary` | `primary` |
| Badge | `badge-primary` | `primary` |
| Alert | `alert-info` | Uses theme colors |
| Input Focus | `input-primary` | `primary` |
| Progress Bar | `progress-primary` | `primary` |

## 💡 Best Practices

1. **Always use `btn-primary`** instead of custom color classes
2. **Let DaisyUI handle hover states** - it uses `primary-focus` automatically
3. **Don't hardcode colors** like `bg-indigo-600` - use theme classes
4. **Test both light and dark modes** after color changes
5. **Keep primary color consistent** across light and dark themes for brand recognition

## 🔄 After Making Changes

1. Save `tailwind.config.js`
2. Restart the dev server:
   ```bash
   npm run dev
   ```
3. Hard refresh browser (Ctrl+Shift+R)
4. Check both light and dark themes

## 📝 Notes

- All components automatically use these colors via DaisyUI classes
- No need to update individual component files
- Theme changes apply instantly to all buttons, badges, alerts, etc.
- Custom CSS in `index.css` includes documentation comments
