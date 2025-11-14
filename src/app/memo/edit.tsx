import {
    View, TextInput, StyleSheet, Alert
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'

import KeyboardAvoidingView from '../../components/KeyboardAvoidingView'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/Icon'
import { auth, db } from '../../config'
import { useThemedStyles } from '../../hooks/useThemedStyles'
import { ThemeColors } from '../../themes/colors'

const handlePress = (id: string, bodyText: string): void => {
    if (auth.currentUser === null) { return }
    const ref = doc(db, `users/${auth.currentUser.uid}/memos`, id)
    setDoc(ref, {
        bodyText,
        updatedAt: Timestamp.fromDate(new Date())
    })
        .then(() => {
            router.back()
        })
        .catch((error) => {
            console.log(error)
            Alert.alert('更新に失敗しました')
        })
}

const Edit = () => {
    const { theme, styles } = useThemedStyles(createStyles)
    const id = String(useLocalSearchParams().id)
    const [bodyText, setBodyText] = useState('')
    useEffect(() => {
        if (auth.currentUser === null) { return }
        const ref = doc(db, `users/${auth.currentUser.uid}/memos`, id)
        getDoc(ref)
            .then((docRef) => {
                const RemoteBodyText = docRef?.data()?.bodyText
                setBodyText(RemoteBodyText)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])
    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    multiline
                    value={bodyText}
                    onChangeText={(text) => { setBodyText(text) }}
                    autoFocus
                    style={[styles.input, { color: theme.text }]}
                />
            </View>
            <CircleButton onPress={() => { handlePress(id, bodyText) }} style={{ backgroundColor: theme.primary }}>
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
        flex: 1,
        backgroundColor: theme.background
    },
    input: {
        flex: 1,
        paddingVertical: 32,
        paddingHorizontal: 27,
        textAlignVertical: 'top',
        fontSize: 16,
        lineHeight: 24
    }
})

export default Edit
