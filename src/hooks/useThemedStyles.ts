import React from 'react'
import { ViewStyle, TextStyle, ImageStyle } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import { ThemeColors } from '../themes/colors'

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle }
type StyleFactory<T> = (theme: ThemeColors) => T

export const useThemedStyles = <T extends NamedStyles<T>>(
    styleFactory: StyleFactory<T>
) => {
    const { theme } = useTheme()

    const styles = React.useMemo(() => {
        return styleFactory(theme)
    }, [theme, styleFactory])

    return { theme, styles }
}
