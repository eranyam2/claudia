# Theme System Documentation

## Overview

The Claudia app now supports both dark and light themes with a robust theme switching system. The implementation maintains the existing dark mode as default while adding a clean, accessible light mode.

## Architecture

### Core Files

1. **`src/lib/theme.ts`** - Theme definitions, constants, and utility functions
2. **`src/contexts/ThemeContext.tsx`** - React context for theme management
3. **`src/components/ThemeToggle.tsx`** - Theme toggle UI component
4. **`src/styles.css`** - Updated CSS with dynamic theming support

### Theme System Features

- **Dual Theme Support**: Dark (default) and Light modes
- **System Theme Detection**: Automatically detects user's system preference
- **Theme Persistence**: Saves user preference in localStorage
- **Seamless Integration**: Works with existing Tailwind CSS v4 setup
- **Markdown Editor Support**: Themes apply to all editor components
- **Accessibility**: Proper ARIA labels and focus management

## How It Works

### 1. Theme Definitions

The theme system uses OKLCH color space values for better color consistency:

```typescript
// Dark theme (default)
export const themes = {
  dark: {
    background: 'oklch(0.12 0.01 240)',
    foreground: 'oklch(0.98 0.01 240)',
    // ... other colors
  },
  light: {
    background: 'oklch(0.98 0.01 240)',
    foreground: 'oklch(0.12 0.01 240)',
    // ... other colors
  }
}
```

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