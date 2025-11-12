import { TouchableOpacity, Text, StyleSheet } from 'react-native'

const LogOutButton = () => {
    return (
        <TouchableOpacity style={styles.buttonContainer}>
            <Text style={styles.text}>ログアウト</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 12,
        lineHeight: 24,
        color: 'rgba(255,255,255,0.7)'
    },
    buttonContainer: {
        backgroundColor: 'transparent',
        justifyContent: 'center'
    }
})

export default LogOutButton
