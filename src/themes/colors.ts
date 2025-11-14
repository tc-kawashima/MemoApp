export interface ThemeColors {
  primary: string
  secondary: string
  background: string
  text: string
  listItemBackground: string
  listItemSeparator: string
}

// 1. デフォルトテーマ
export const DEFAULT_THEME: ThemeColors = {
  primary: '#1D428A',
  secondary: '#3366CC',
  background: '#F0F4F8',
  text: '#333333',
  listItemBackground: '#FFFFFF',
  listItemSeparator: 'rgba(0,0,0,0.15)'
}

// 2. モノクロテーマ
export const MONOCHROME_THEME: ThemeColors = {
  primary: '#555555',
  secondary: '#AAAAAA',
  background: '#FFFFFF',
  text: '#222222',
  listItemBackground: '#F7F7F7',
  listItemSeparator: 'rgba(0,0,0,0.1)'
}

// 3. ダークテーマ
export const DARK_THEME: ThemeColors = {
  primary: '#1A202C',
  secondary: '#4A90E2',
  background: '#000000',
  text: '#F7FAFC',
  listItemBackground: '#171923',
  listItemSeparator: 'rgba(255,255,255,0.2)'
}

// 4. イエローテーマ
export const YELLOW_THEME: ThemeColors = {
  primary: '#FFA500',
  secondary: '#FFD700',
  background: '#FFFFE0',
  text: '#555555',
  listItemBackground: '#FFFFFF',
  listItemSeparator: 'rgba(0,0,0,0.1)'
}

export const THEMES = {
  default: DEFAULT_THEME,
  monochrome: MONOCHROME_THEME,
  dark: DARK_THEME,
  yellow: YELLOW_THEME
}
