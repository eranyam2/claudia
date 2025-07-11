# Theme System Documentation

## Overview

The Claudia app now features a **professional, sophisticated theme system** with enhanced dark and light themes. The implementation focuses on **visual hierarchy, professional aesthetics, and reduced monotony** while maintaining excellent accessibility standards.

## Architecture

### Core Files

1. **`src/lib/theme.ts`** - Theme definitions, constants, and utility functions
2. **`src/contexts/ThemeContext.tsx`** - React context for theme management
3. **`src/components/ThemeToggle.tsx`** - Theme toggle UI component
4. **`src/styles.css`** - Updated CSS with dynamic theming support

### Theme System Features

- **Professional Color Schemes**: Sophisticated dark and light themes with enhanced visual hierarchy
- **Reduced Monotony**: Varied color tones and subtle accents to eliminate flat appearance
- **Visual Hierarchy**: Clear distinction between primary, secondary, and accent colors
- **System Theme Detection**: Automatically detects user's system preference
- **Theme Persistence**: Saves user preference in localStorage
- **Seamless Integration**: Works with existing Tailwind CSS v4 setup
- **Enhanced Interactions**: Smooth transitions and hover effects
- **Professional Aesthetics**: Subtle gradients, better shadows, and refined typography
- **Accessibility**: WCAG-compliant contrast ratios and proper focus management

## How It Works

### 1. Theme Definitions

The theme system uses OKLCH color space values for superior color consistency and professional aesthetics:

```typescript
// Enhanced Dark Theme - Sophisticated with subtle blue undertones
export const themes = {
  dark: {
    background: 'oklch(0.11 0.015 240)',        // Deep, rich background
    foreground: 'oklch(0.95 0.008 240)',        // Crisp, readable text
    primary: 'oklch(0.65 0.15 260)',            // Elegant purple-blue
    accent: 'oklch(0.55 0.18 240)',             // Vibrant blue highlights
    // ... sophisticated color palette
  },
  light: {
    background: 'oklch(0.99 0.005 240)',        // Clean, warm white
    foreground: 'oklch(0.15 0.008 240)',        // Professional dark text
    primary: 'oklch(0.45 0.15 240)',            // Deep professional blue
    accent: 'oklch(0.55 0.18 240)',             // Consistent accent color
    // ... professional color palette
  }
}
```

### Key Color Improvements:

- **Enhanced Contrast**: Better readability with refined lightness values
- **Subtle Undertones**: Blue undertones add sophistication without being overwhelming
- **Visual Hierarchy**: Distinct primary, secondary, and accent colors for clear organization
- **Professional Palette**: Colors chosen for modern, professional applications

### 2. Theme Provider

The `ThemeProvider` wraps the entire app and provides:

- Theme state management
- Automatic theme application
- System theme detection
- Theme persistence
- Real-time theme switching

### 3. Theme Toggle Component

A reusable component that can be placed anywhere in the UI:

```tsx
<ThemeToggle size="sm" variant="ghost" />
```

### 4. CSS Integration

The CSS system dynamically updates CSS custom properties:

```css
/* Theme variables are updated dynamically */
:root {
  --color-background: oklch(0.12 0.01 240); /* Dark theme */
  --color-foreground: oklch(0.98 0.01 240);
  /* ... */
}

/* Light theme automatically updates these */
[data-theme="light"] {
  --color-background: oklch(0.98 0.01 240);
  --color-foreground: oklch(0.12 0.01 240);
  /* ... */
}
```

## Usage

### Basic Usage

The theme system is automatically initialized when the app starts. Users can toggle between themes using the theme toggle button in the top bar.

### Programmatic Usage

```tsx
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { theme, setTheme, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme('light')}>Light Mode</button>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  );
}
```

### Custom Components

For components that need theme-aware styling:

```tsx
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { theme } = useTheme();
  
  return (
    <div data-theme={theme}>
      {/* Component content */}
    </div>
  );
}
```

## Theme Persistence

The theme system automatically:

1. **Detects system preference** on first visit
2. **Saves user choice** in localStorage under `claudia-theme`
3. **Restores saved theme** on app restart
4. **Listens for system changes** (when no explicit theme is set)

## Integration Points

### 1. Main App

The `ThemeProvider` wraps the entire app in `src/App.tsx`:

```tsx
return (
  <ThemeProvider>
    <OutputCacheProvider>
      {/* App content */}
    </OutputCacheProvider>
  </ThemeProvider>
);
```

### 2. Topbar

The theme toggle is integrated into the topbar:

```tsx
<ThemeToggle size="sm" />
```

### 3. Markdown Editor

The markdown editor automatically switches themes:

```tsx
<div data-color-mode={theme}>
  <MDEditor />
</div>
```

## Browser Support

The theme system uses modern CSS features:

- **CSS Custom Properties**: For dynamic theming
- **OKLCH Color Space**: For better color consistency
- **prefers-color-scheme**: For system theme detection
- **localStorage**: For theme persistence

## Performance

- **Minimal Runtime Impact**: Theme changes only update CSS variables
- **No Flash of Unstyled Content**: Themes apply immediately
- **Efficient Updates**: Only affected elements re-render

## Light Theme Contrast Improvements

The light theme has been significantly enhanced to address contrast issues:

### Enhanced Visual Hierarchy

- **Better Contrast**: Clear distinction between background, cards, and UI elements
- **Improved Borders**: More defined borders for better visual separation
- **Enhanced Shadows**: Subtle shadows for card depth and definition
- **Better Form Inputs**: Enhanced input field styling with proper contrast
- **Accessible Colors**: All colors meet WCAG accessibility standards

### Specific Improvements

- **Card Backgrounds**: Distinct card backgrounds with subtle shadows
- **Interactive Elements**: Clear hover states and focus indicators
- **Text Contrast**: Improved text contrast for better readability
- **Status Indicators**: Better color contrast for success/error states
- **Form Elements**: Enhanced input fields with clear borders and focus states

### CSS Enhancements

```css
/* Light theme specific improvements */
[data-theme="light"] {
  --color-border: oklch(0.82 0.01 240);
  --color-card: oklch(0.96 0.005 240);
  --color-accent: oklch(0.90 0.01 240);
  --color-muted: oklch(0.92 0.01 240);
}

/* Enhanced shadows for light theme */
[data-theme="light"] .shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
```

## Accessibility

The theme toggle button now includes:

- **Smooth Scale Animation**: Subtle hover scale effect
- **Professional Shadow**: Elevated appearance on hover
- **Glow Effect**: Subtle glow overlay for premium feel
- **Improved Transitions**: 300ms smooth transitions

## Accessibility

- **High Contrast**: Both themes meet WCAG accessibility standards
- **Focus Management**: Theme toggle has proper focus styles
- **Screen Reader Support**: ARIA labels describe theme state
- **Keyboard Navigation**: Full keyboard support for theme toggle

## Future Enhancements

The theme system is designed to be extensible:

1. **Additional Themes**: Easy to add new themes (e.g., high contrast, custom colors)
2. **Theme Variants**: Support for theme variations (e.g., dark blue, warm dark)
3. **Component-Specific Themes**: Individual components can have custom theming
4. **Theme Scheduling**: Time-based theme switching
5. **Theme Animations**: Smooth transitions between themes

## Migration Notes

The theme system is fully backward compatible:

- **Existing Dark Mode**: Preserved as default
- **CSS Classes**: All existing classes continue to work
- **Component Styles**: No breaking changes to existing components
- **Build Process**: No changes to build configuration

## Testing

To test the theme system:

1. **Toggle Button**: Click the sun/moon icon in the topbar
2. **System Theme**: Change your system theme and reload the app
3. **Persistence**: Toggle theme, reload page, verify theme is preserved
4. **Accessibility**: Test with screen readers and keyboard navigation

The theme system provides a solid foundation for Claudia's visual customization while maintaining the app's existing functionality and design principles.