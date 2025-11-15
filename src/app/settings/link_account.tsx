import React, { useState } from 'react'
import {
    View, Text, TextInput, Alert,
    StyleSheet, TouchableOpacity
} from 'react-native'
import { router } from 'expo-router'
// Firebase Auth の必要な関数と型をインポート
import { EmailAuthProvider, linkWithCredential } from 'firebase/auth'
import { auth } from '../../config' // auth インスタンスをインポート
import { useThemedStyles } from '../../hooks/useThemedStyles'
import { ThemeColors } from '../../themes/colors'

// ------------------------------------------------
// アカウント連携（昇格）ロジック
// ------------------------------------------------
const handleLinkAccount = async (email: string, password: string): Promise<void> => {
    const user = auth.currentUser

    // 1. ゲスト判定と入力チェック
    if (!user || !user.isAnonymous) {
        Alert.alert('エラー', 'この操作を実行するには、ゲストユーザーとしてサインインしている必要があります。')
        router.replace('/auth/log_in')
        return
    }
    if (password.length < 6) {
        Alert.alert('エラー', 'パスワードは6文字以上である必要があります。')
        return
    }

    try {
        // 2. 新しい認証情報 (Email/Password) を作成
        const credential = EmailAuthProvider.credential(email, password)

        // 3. 既存の匿名アカウントに認証情報を連携させる
        await linkWithCredential(user, credential)

        // 4. 成功後の処理
        Alert.alert('連携完了', 'アカウントがメールアドレスに連携されました！')
        router.replace('/memo/list') // メモ一覧に戻る

    } catch (error: unknown) {

        // ログ出力（デバッグ用）
        console.error('アカウント連携失敗:', error)

        // 1. errorがオブジェクトであり、codeプロパティを持つかをチェックする型ガード
        if (typeof error === 'object' && error !== null && 'code' in error) {
            // Firebaseのエラーオブジェクトとしてアサーション
            const firebaseError = error as { code: string, message: string }

            // 2. Firebaseのエラーコードに基づいた詳細なエラー処理
            if (firebaseError.code === 'auth/email-already-in-use') {
                Alert.alert('連携失敗', 'このメールアドレスは既に別のアカウントで使用されています。')
            } else if (firebaseError.code === 'auth/invalid-email') {
                Alert.alert('連携失敗', 'メールアドレスの形式が正しくありません。')
            } else {
                Alert.alert('連携失敗', `エラーが発生しました: ${firebaseError.message}`)
            }
        } else {
            Alert.alert('連携失敗', '予期せぬエラーが発生しました。時間をおいて再度お試しください。')
        }
    }
}


// ------------------------------------------------
// UI コンポーネント
// ------------------------------------------------
const LinkAccount = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { styles } = useThemedStyles(createStyles)

    return (
        <View style={styles.container}>
            <View style={styles.inner}>
                <Text style={styles.title}>アカウント登録</Text>
                <Text style={styles.subtitle}>
                    ゲストデータを保存するため、メールアドレスとパスワードを設定してください。
                </Text>

                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder='Email Address'
                    keyboardType='email-address'
                    textContentType='emailAddress'
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder='password'
                    textContentType='password'
                    autoCapitalize='none'
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleLinkAccount(email, password)}
                >
                    <Text style={styles.buttonLabel}>アカウントを連携して保存</Text>
                </TouchableOpacity>

                <View style={styles.cancelButtonLabel}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => router.replace('/memo/list')}
                    >
                        <Text style={styles.cancelButtonText}>キャンセルして戻る</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const createStyles = (theme: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
        padding: 27
    },
    inner: {
        paddingVertical: 32,
        paddingHorizontal: 27
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: theme.text
    },
    subtitle: {
        fontSize: 14,
        color: theme.text,
        marginBottom: 24
    },
    input: {
        backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD',
        height: 48, padding: 8, fontSize: 16, marginBottom: 16, borderRadius: 4
    },
    button: {
        backgroundColor: '#1D428A',
        borderRadius: 4,
        paddingVertical: 12,
        marginTop: 16,
        marginBottom: 8
    },
    buttonLabel: {
        fontSize: 18,
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    cancelButtonLabel: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 10
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderRadius: 4,
        paddingVertical: 10
    },
    cancelButtonText: {
        fontSize: 16,
        color: theme.text,
        textAlign: 'center',
        fontWeight: 'bold'
    }
})

export default LinkAccount
