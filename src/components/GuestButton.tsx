import { Text, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native'

interface Props {
    label: string
    onPress?: () => void
    style?: StyleProp<ViewStyle>
}

const GuestButton = (props: Props) => {
    const { label, onPress, style } = props
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            <Text style={styles.buttonLabel}>{label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'rgba(29,66,138,0.75)',
        borderRadius: 4,
        alignSelf: 'stretch',
        marginTop: 24
    },
    buttonLabel: {
        fontSize: 16,
        lineHeight: 28,
        color: '#FFF',
        textAlign: 'center',
        paddingVertical: 8,
        paddingHorizontal: 24
    }
})

export default GuestButton
