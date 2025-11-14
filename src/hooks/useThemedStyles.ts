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

    // useMemo を使って、テーマが変更された時のみスタイルを再計算（パフォーマンス最適化）
    const styles = React.useMemo(() => {
        // 受け取ったファクトリ関数に現在のテーマを渡してスタイルを生成
        return styleFactory(theme)
    }, [theme, styleFactory])

    return { theme, styles }
}
