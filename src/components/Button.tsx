import { Text, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native'

interface Props {
    label: string
    onPress?: () => void
    style?: StyleProp<ViewStyle>
}

const Button = (props: Props) => {
    const { label, onPress, style } = props
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            <Text style={styles.buttonLabel}>{label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#1D428A',
        borderRadius: 4,
        alignSelf: 'flex-end',
        marginBottom: 12
    },
    buttonLabel: {
        fontSize: 16,
        lineHeight: 28,
        color: '#FFF',
        paddingVertical: 8,
        paddingHorizontal: 24
    }
})

export default Button
