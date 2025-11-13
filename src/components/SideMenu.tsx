import React, { useEffect, useRef, useState } from 'react'
import {
    View, Text, StyleSheet, TouchableOpacity, Animated,
    Dimensions, Alert, Modal
} from 'react-native'
import { router } from 'expo-router'
import { auth } from '../config'

const { width, height } = Dimensions.get('window') // 画面の幅と高さを取得

interface SideMenuProps {
    visible: boolean;
    onClose: () => void;
}

const SideMenu = ({ visible, onClose }: SideMenuProps) => {
    // スケールアニメーション用の値 (0: 非表示, 1: 表示)
    const scaleAnim = useRef(new Animated.Value(0)).current
    // フェードアニメーション用の値 (0: 透明, 1: 不透明)
    const fadeAnim = useRef(new Animated.Value(0)).current

    // ユーザーの状態を管理（リアルタイムで isAnonymous を判定）
    const [isAnonymous, setIsAnonymous] = useState(auth.currentUser?.isAnonymous ?? false)

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setIsAnonymous(user?.isAnonymous ?? false)
        })
        return unsubscribe
    }, [])

    // visible の変更に応じてアニメーションを実行
    useEffect(() => {
        if (visible) {
            // 表示時にはフェードイン＆スケールアップ
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200, // フェードインの時間
                    useNativeDriver: true
                }),
                Animated.spring(scaleAnim, { // springアニメーションで少し弾むように
                    toValue: 1,
                    friction: 7, // 弾む強さ
                    tension: 40, // スピード
                    useNativeDriver: true
                })
            ]).start()
        } else {
            // 非表示時にはフェードアウト＆スケールダウン
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 150, // フェードアウトの時間
                    useNativeDriver: true
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0,
                    duration: 150, // スケールダウンの時間
                    useNativeDriver: true
                })
            ]).start()
        }
    }, [visible, fadeAnim, scaleAnim])

    // ログアウト処理
    const performLogout = () => {
        auth.signOut().then(() => {
            onClose()
            router.replace('/auth/log_in')
        }).catch(error => {
            console.error('Logout failed:', error)
            Alert.alert('ログアウトに失敗しました')
        })
    }
    const handleLogout = () => {
        if (!isAnonymous) {
            performLogout()
            return
        }
        Alert.alert(
            'ゲストデータが消去されます',
            'アカウントを登録せずにログアウトすると、作成したメモはすべて削除されます。\n\n本当にログアウトしますか？',
            [
                {
                    text: 'キャンセル',
                    style: 'cancel'
                },
                {
                    text: 'ログアウト',
                    style: 'destructive',
                    onPress: performLogout
                }
            ],
            { cancelable: true }
        )
    }

    // アカウント連携画面への遷移 (次のステップで作成)
    const handleLinkAccount = () => {
        onClose()
        router.replace('/settings/link_account')
    }

    // visible が false の間は Modal を非表示にし、描画負荷を軽減
    if (!visible) return null

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="none" // アニメーションは Animated.View で制御
            onRequestClose={onClose}
        >
            {/* 1. オーバーレイ (画面全体を覆う半透明な背景) */}
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose} // オーバーレイタップで閉じる
            >
                {/* 2. 中央表示されるメニュー本体 */}
                <Animated.View
                    style={[
                        styles.menuContainer,
                        {
                            opacity: fadeAnim, // フェードアニメーション
                            transform: [{ scale: scaleAnim }] // スケールアニメーション
                        }
                    ]}
                >
                    <View style={styles.menuHeader}>
                        <Text style={styles.menuTitle}>menu</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {isAnonymous && (
                        <TouchableOpacity style={styles.menuItem} onPress={handleLinkAccount}>
                            <Text style={styles.menuItemText}>Link Email Address</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                        <Text style={styles.menuItemText}>Log out</Text>
                    </TouchableOpacity>

                </Animated.View>
            </TouchableOpacity>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // 半透明の黒背景
        justifyContent: 'center', // 中央寄せ
        alignItems: 'center'     // 中央寄せ
    },
    menuContainer: {
        width: width * 0.8,
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 20,
        maxHeight: height * 0.7,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#888',
        paddingBottom: 15
    },
    menuTitle: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    closeButton: {
        padding: 5
    },
    closeButtonText: {
        fontSize: 24,
        color: '#333'
    },
    menuItem: {
        paddingVertical: 12,
        backgroundColor: 'rgba(29,66,138,0.15)',
        borderBottomWidth: 0,
        borderRadius: 4,
        alignSelf: 'center',
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16
    },
    menuItemText: {
        fontSize: 16,
        color: '#333'
    }
})

export default SideMenu
