// src/app/settings/delete_account.tsx

import React from 'react'
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import {
    auth,
    db
} from '../../config' // auth と db (Firestore) をインポート
import {
    deleteUser,
    User
} from 'firebase/auth'
import {
    collection,
    query,
    getDocs,
    writeBatch
} from 'firebase/firestore'

// ------------------------------------------------
// 1. ユーザーの全メモデータをFirestoreから削除する関数
// ------------------------------------------------
const deleteUserMemos = async (uid: string) => {
    // ユーザーのメモコレクションへの参照
    const userMemosRef = collection(db, `users/${uid}/memos`)
    const q = query(userMemosRef)

    const snapshot = await getDocs(q)
    if (snapshot.empty) {
        console.log("No memos found to delete.")
        return
    }

    // バッチ処理を使用して全てのドキュメントを削除
    const batch = writeBatch(db)
    snapshot.forEach((memoDoc) => {
        batch.delete(memoDoc.ref)
    })

    await batch.commit()
    console.log(`Successfully deleted ${snapshot.size} memos.`)
}


// ------------------------------------------------
// 2. 削除実行とエラー処理を行うメイン関数
// ------------------------------------------------
const performDeletion = async (user: User) => {
    try {
        const uid = user.uid

        // ① Firestore: メモデータの削除
        await deleteUserMemos(uid)

        // ② Firebase Auth: 認証アカウントの削除
        await deleteUser(user)

        Alert.alert('完了', 'アカウントと全てのデータが削除されました。')
        router.replace('/auth/log_in') // ログイン画面へ遷移（履歴を置き換える）

    } catch (error: unknown) {

        console.error('Deletion failed:', error)

        // Firebaseのエラーコードを安全に抽出
        if (typeof error === 'object' && error !== null && 'code' in error) {
            const firebaseError = error as { code: string, message: string }

            // セキュリティエラー処理: 'auth/requires-recent-login'
            if (firebaseError.code === 'auth/requires-recent-login') {
                Alert.alert(
                    '削除失敗',
                    'セキュリティのため、アカウント削除には再ログインが必要です。'
                )
                // ユーザーをログアウトさせ、再認証を促す
                await auth.signOut()
                router.replace('/auth/log_in')
                return
            }
        }

        Alert.alert('削除失敗', '予期せぬエラーが発生しました。時間を置いてお試しください。')
    }
}


// ------------------------------------------------
// 3. 削除ボタンの onPress イベント（確認ダイアログ表示）
// ------------------------------------------------
const handleDeleteAccount = () => {
    const user = auth.currentUser
    if (!user) {
        Alert.alert('エラー', 'ログイン状態を確認できません。')
        router.replace('/auth/log_in')
        return
    }

    Alert.alert(
        'アカウントを完全に削除しますか？',
        'この操作は元に戻せません。\n作成した全てのメモデータが永久に削除されます。',
        [
            { text: 'キャンセル', style: 'cancel' },
            {
                text: '削除する',
                style: 'destructive',
                onPress: () => performDeletion(user) // 削除実行
            }
        ]
    )
}


// ------------------------------------------------
// 4. UIコンポーネント
// ------------------------------------------------
const DeleteAccountScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.inner}>
                <Text style={styles.warningTitle}>アカウント削除</Text>
                <Text style={styles.warningText}>
                    ※アカウントを削除すると、全てのメモデータが削除され、復元することはできません。
                </Text>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeleteAccount}
                >
                    <Text style={styles.deleteButtonText}>アカウントとデータを完全に削除</Text>
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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F4F8', padding: 27 },
    inner: { alignItems: 'center', paddingTop: 30 },
    warningTitle: { fontSize: 24, fontWeight: 'bold', color: '#D9534F', marginBottom: 15 },
    warningText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
        paddingHorizontal: 10
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
        color: '#222',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    deleteButton: {
        backgroundColor: '#D9534F',
        borderRadius: 4,
        paddingVertical: 15,
        width: '100%'
    },
    deleteButtonText: {
        fontSize: 18,
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold'
    }
})

export default DeleteAccountScreen
