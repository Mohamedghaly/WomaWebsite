# 🎨 WOMA Sportswear - Design System Quick Reference

## Color Palette

### Gradients
```css
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
--gradient-sunset: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)
--gradient-ocean: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)
--gradient-cyber: linear-gradient(135deg, #00d4ff 0%, #7b2ff7 100%)
```

### Usage in Components
```tsx
// Gradient Background
className="bg-gradient-to-r from-purple-600 to-pink-600"

// Gradient Text
className="gradient-text"
className="gradient-text-sunset"
className="gradient-text-cyber"
```

## Typography

### Fonts
- **Headings**: Outfit (800 weight)
- **Body**: Inter (400-700 weight)

### Sizes
```tsx
// Hero Title
className="text-6xl md:text-9xl font-black"

// Section Title
className="text-5xl md:text-6xl font-black"

// Card Title
className="text-base font-bold uppercase"

// Body Text
className="text-sm leading-relaxed"
```

## Spacing

```css
--spacing-xs: 0.25rem    /* 4px */
--spacing-sm: 0.5rem     /* 8px */
--spacing-md: 1rem       /* 16px */
--spacing-lg: 1.5rem     /* 24px */
--spacing-xl: 2rem       /* 32px */
--spacing-2xl: 3rem      /* 48px */
--spacing-3xl: 4rem      /* 64px */
```

## Border Radius

```css
--radius-sm: 0.375rem    /* 6px */
--radius-md: 0.5rem      /* 8px */
--radius-lg: 0.75rem     /* 12px */
--radius-xl: 1rem        /* 16px */
--radius-2xl: 1.5rem     /* 24px */
--radius-full: 9999px    /* Full circle */
```

### Common Usage
```tsx
// Cards
className="rounded-2xl"

// Buttons
className="rounded-xl"

// Pills/Badges
className="rounded-full"
```

## Buttons

### Primary Button (Gradient)
```tsx
<button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold uppercase tracking-widest hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
  <span className="relative z-10">Button Text</span>
  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
</button>
```

### Secondary Button (Outline)
```tsx
<button className="px-8 py-4 border-2 border-white rounded-lg font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
  Button Text
</button>
```

### Icon Button
```tsx
<button className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center">
  <Icon size={20} />
</button>
```

## Cards

### Product Card
```tsx
<div className="group cursor-pointer">
  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
    <img className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </div>
  <h3 className="font-bold text-base uppercase group-hover:gradient-text transition-all">
    Product Name
  </h3>
</div>
```

### Glass Card
```tsx
<div className="glass-dark p-6 rounded-2xl backdrop-blur-md">
  Content
</div>
```

## Badges

### Category Badge
```tsx
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100">
  <span className="text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
    Category
  </span>
</div>
```

### Glass Badge
```tsx
<div className="px-3 py-1.5 rounded-full glass-dark text-white backdrop-blur-md text-[10px] font-bold uppercase tracking-wider">
  Badge Text
</div>
```

## Animations

### Entrance Animations
```tsx
// Fade In
style={{ animation: 'fadeIn 0.3s ease-out' }}

// Slide Up
style={{ animation: 'slideUp 0.6s ease-out' }}

// Scale In
style={{ animation: 'scaleIn 0.3s ease-out' }}

// Staggered
style={{ animation: `slideUp 0.6s ease-out ${index * 0.1}s both` }}
```

### Hover Effects
```tsx
// Lift
className="hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"

// Scale
className="hover:scale-105 transition-transform duration-300"

// Rotate
className="hover:rotate-90 transition-transform duration-300"
```

## Inputs

### Text Input
```tsx
<input
  type="text"
  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 text-sm transition-all duration-300"
  placeholder="Enter text"
/>
```

### Textarea
```tsx
<textarea
  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 text-sm h-28 resize-none transition-all duration-300"
  placeholder="Enter text"
/>
```

## Glassmorphism

### Light Glass
```tsx
className="glass-effect"
// or
className="bg-white/10 backdrop-blur-xl border border-white/20"
```

### Dark Glass
```tsx
className="glass-dark"
// or
className="bg-black/30 backdrop-blur-xl border border-white/10"
```

## Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

### Usage
```tsx
className="shadow-xl"
className="hover:shadow-2xl"
```

## Transitions

```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1)
```

### Usage
```tsx
className="transition-all duration-300"
className="transition-transform duration-500"
```

## Common Patterns

### Gradient Overlay on Image
```tsx
<div className="relative">
  <img src="..." />
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
</div>
```

### Shimmer Effect Button
```tsx
<button className="group relative overflow-hidden">
  <span className="relative z-10">Text</span>
  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
</button>
```

### Floating Element
```tsx
<div style={{ animation: 'float 6s ease-in-out infinite' }}>
  Content
</div>
```

### Gradient Text
```tsx
<h1 className="gradient-text">
  Gradient Heading
</h1>
```

### Animated Underline
```tsx
<a className="relative group">
  <span>Link Text</span>
  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300" />
</a>
```

## Responsive Breakpoints

```tsx
// Mobile First
className="text-sm md:text-base lg:text-lg"

// Grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"

// Spacing
className="p-4 md:p-8 lg:p-12"

// Display
className="hidden md:flex"
```

## Icon Sizing

```tsx
// Small
<Icon size={16} />

// Medium
<Icon size={20} />

// Large
<Icon size={24} />

// Extra Large
<Icon size={40} />
```

## Z-Index Layers

```
1. Background: z-0
2. Content: z-10
3. Navbar: z-40
4. Drawer/Modal: z-50
```

---

**Quick Tips:**
- Always use `transition-all duration-300` for smooth interactions
- Combine gradients with `hover:scale-105` for engaging CTAs
- Use `rounded-2xl` for modern card designs
- Apply `backdrop-blur-md` for glassmorphism effects
- Add `group` class to parent for child hover effects
