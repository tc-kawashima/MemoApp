import React, { createContext, useState, useContext, useMemo, ReactNode } from 'react'
import { ThemeColors, THEMES } from '../themes/colors'

type ThemeName = 'default' | 'monochrome' | 'dark' | 'yellow';

interface ThemeContextProps {
    theme: ThemeColors;
    themeName: ThemeName;
    setThemeName: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [themeName, setThemeName] = useState<ThemeName>('default')
    const theme = useMemo(() => {
        return THEMES[themeName]
    }, [themeName])

    return (
        <ThemeContext.Provider value={{ theme, themeName, setThemeName }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

export type { ThemeName }
