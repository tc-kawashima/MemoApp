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
  secondary: '#4d618aff',
  background: '#F0F4F8',
  text: '#000',
  listItemBackground: '#FFFFFF',
  listItemSeparator: 'rgba(0,0,0,0.15)'
}

// 2. モノクロテーマ
export const MONOCHROME_THEME: ThemeColors = {
  primary: '#333',
  secondary: '#888',
  background: '#FFF',
  text: '#000',
  listItemBackground: '#F7F7F7',
  listItemSeparator: 'rgba(0,0,0,0.1)'
}

// 3. ダークテーマ
export const DARK_THEME: ThemeColors = {
  primary: 'rgba(4, 4, 4, 1)',
  secondary: '#333',
  background: '#111',
  text: '#edf4f8ff',
  listItemBackground: '#171923',
  listItemSeparator: 'rgba(255,255,255,0.2)'
}

// 4. イエローテーマ
export const YELLOW_THEME: ThemeColors = {
  primary: '#FFA500',
  secondary: '#444',
  background: '#FFFFE0',
  text: '#444',
  listItemBackground: '#FFFFF0',
  listItemSeparator: 'rgba(0,0,0,0.1)'
}

export const THEMES = {
  default: DEFAULT_THEME,
  monochrome: MONOCHROME_THEME,
  dark: DARK_THEME,
  yellow: YELLOW_THEME
}
