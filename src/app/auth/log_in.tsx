import {
    View, Text, TextInput, Alert,
    TouchableOpacity, StyleSheet
} from 'react-native'

import { Link, router } from 'expo-router'
import { useState } from 'react'
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth'

import Button from '../../components/Button'
import GuestButton from '../../components/GuestButton'
import { auth } from '../../config'

const handlePress = (email: string, password: string): void => {
    // ログイン
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(userCredential.user.uid)
            router.replace('/memo/list')
        })
        .catch((error) => {
            const { code, message } = error
            console.log(code, message)
            Alert.alert(message)
        })
}
const handleGuestLogin = async () => {
    try {
        const userCredential = await signInAnonymously(auth)
        console.log('Guest Logged in with uid:', userCredential.user.uid)
        router.replace('/memo/list')
    }
    catch(error) {
        console.error('Guest login failed:', error)
        Alert.alert('ゲストログインに失敗しました')
    }
}

const LogIn = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    return (
        <View style={styles.container}>
            <View style={styles.inner}>
                <Text style={styles.title}>ログイン</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={(text) => { setEmail(text) }}
                    autoCapitalize='none'
                    keyboardType='email-address'
                    placeholder='Email Address'
                    textContentType='emailAddress'
                />
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={(text) => { setPassword(text) }}
                    autoCapitalize='none'
                    secureTextEntry
                    placeholder='Password'
                    textContentType='password'
                />
                <Button label='送信' onPress={() => { handlePress(email, password) }} />
                <View style={styles.footer}>
                    <Text style={styles.footerText}>アカウントをお持ちでないですか？</Text>
                    <Link href='/auth/sign_up' asChild replace>
                        <TouchableOpacity>
                            <Text style={styles.footerLink}>新規登録はこちら</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
                <View style={styles.separator} />
                <GuestButton label="ゲストとしてログイン" onPress={ handleGuestLogin } />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F8'
    },
    inner: {
        paddingVertical: 24,
        paddingHorizontal: 27
    },
    title: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: 'bold',
        marginBottom: 24

    },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#DDD',
        height: 48,
        padding: 8,
        fontSize: 16,
        marginBottom: 16
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 24
    },
    footerText: {
        fontSize: 14,
        lineHeight: 24,
        marginRight: 12,
        color: '#000'
    },
    footerLink: {
        fontSize: 14,
        lineHeight: 24,
        color: '#1D428A'
    },
    separator: {
        height: 1,
        backgroundColor: '#DDD',
        alignSelf: 'stretch'
    }
})

export default LogIn
