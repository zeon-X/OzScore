/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// const tintColorLight = '#0a7ea4';
// const tintColorDark = '#fff';

// export const Colors = {
//   light: {
//     text: '#11181C',
//     background: '#fff',
//     tint: tintColorLight,
//     icon: '#687076',
//     tabIconDefault: '#687076',
//     tabIconSelected: tintColorLight,
//   },
//   dark: {
//     text: '#ECEDEE',
//     background: '#151718',
//     tint: tintColorDark,
//     icon: '#9BA1A6',
//     tabIconDefault: '#9BA1A6',
//     tabIconSelected: tintColorDark,
//   },
// };


// Professional Brand Palette extracted from OzScore Logo
const brandPrimary = '#1A2B56';   // Deep Navy (from "Oz")
const brandSecondary = '#4CAF50'; // Sporty Green (from "Score")
const brandAccent = '#4555C7';    // Action Blue (from the "Apply" button in UI)
const surfaceGray = '#F5F7FA';    // Light background for cards/list

export const Colors = {
  text: '#11181C',
  textMuted: '#687076',
  background: '#FFFFFF',
  surface: surfaceGray,
  tint: brandAccent,
  icon: '#687076',
  tabIconDefault: '#9BA1A6',
  tabIconSelected: brandPrimary,
  headerBackground: "#323232",
  border: '#E1E4E8',

  // UI Specific
  button: brandAccent,
  buttonText: '#FFFFFF',
  success: brandSecondary,
  error: '#FF3B30',
  timer: '#11181C',
};

/**
 * Helper for matching the specific UI components in the screenshots
 */
export const OzScoreTheme = {
  primary: brandPrimary,
  secondary: brandSecondary,
  applyButton: '#445EE2', // Specifically matches the blue "Apply" button
  chipBackground: '#E8EDFF',
  chipText: '#445EE2',
  countdownBadge: '#EDF2FF',
  tipsBadge: '#A5B4FC', // Light purple-blue for the "Tips" icon
  divider: '#E1E4E8',
};


export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});




