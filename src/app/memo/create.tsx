import {
    View, TextInput, StyleSheet
} from 'react-native'
import { router } from 'expo-router'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { useState } from 'react'

import KeyboardAvoidingView from '../../components/KeyboardAvoidingView'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/Icon'
import { db, auth } from '../../config'
import { useThemedStyles } from '../../hooks/useThemedStyles'
import { ThemeColors } from '../../themes/colors'

const handlePress = (bodyText: string): void => {
    if (auth.currentUser === null) { return }
    const ref = collection(db, `users/${auth.currentUser.uid}/memos`)
    addDoc(ref, {
        bodyText,
        updatedAt: Timestamp.fromDate(new Date())
    })
        .then((docRef) => {
            console.log('succces', docRef.id)
            router.back()
        })
        .catch((error) => {
            console.log(error)
        })
}

const Create = () => {
    const { theme, styles } = useThemedStyles(createStyles)
    const [bodyText, setBodyText] = useState('')
    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    multiline
                    style={styles.input}
                    value={bodyText}
                    onChangeText={(text) => { setBodyText(text) }}
                    autoFocus
                    placeholderTextColor={theme.text + '99'}
                />
            </View>
            <CircleButton onPress={() => { handlePress(bodyText) }} style={{ backgroundColor: theme.primary }}>
                <Icon name='check' size={40} color='#FFF' />
            </CircleButton>
        </KeyboardAvoidingView>
    )
}

const createStyles = (theme: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background
    },
    inputContainer: {
        paddingVertical: 32,
        paddingHorizontal: 27,
        flex: 1,
        backgroundColor: theme.background
    },
    input: {
        flex: 1,
        textAlignVertical: 'top',
        fontSize: 16,
        lineHeight: 24,
        color: theme.text
    }
})

export default Create
