module.exports = {
  content: ["./*.html", "./projects/**/*.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: 'var(--md-sys-color-primary)',
        onPrimary: 'var(--md-sys-color-on-primary)',
        primaryContainer: 'var(--md-sys-color-primary-container)',
        onPrimaryContainer: 'var(--md-sys-color-on-primary-container)',
        secondary: 'var(--md-sys-color-secondary)',
        onSecondary: 'var(--md-sys-color-on-secondary)',
        tertiary: 'var(--md-sys-color-tertiary)',
        onTertiary: 'var(--md-sys-color-on-tertiary)',
        background: 'var(--md-sys-color-background)',
        onBackground: 'var(--md-sys-color-on-background)',
        surface: 'var(--md-sys-color-surface)',
        onSurface: 'var(--md-sys-color-on-surface)',
        surfaceContainerLow: 'var(--md-sys-color-surface-container-low)',
        surfaceContainer: 'var(--md-sys-color-surface-container)',
        surfaceContainerHigh: 'var(--md-sys-color-surface-container-high)',
        surfaceContainerHighest: 'var(--md-sys-color-surface-container-highest)',
      },
      borderRadius: {
        '4xl': '28px',
        '5xl': '32px',
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif']
      }
    }
  }
}
