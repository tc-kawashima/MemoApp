import React, { useEffect, useRef, useState } from 'react'
import {
    View, Text, StyleSheet, TouchableOpacity, Animated,
    Dimensions, Alert, Modal, StyleProp, ViewStyle, TextStyle
} from 'react-native'
import { router } from 'expo-router'
import { auth } from '../config'
import { useTheme, ThemeName} from '../context/ThemeContext'
import { ThemeColors } from '../themes/colors'

const { width, height } = Dimensions.get('window')
const THEME_OPTIONS: { name: string, value: ThemeName }[] = [
    { name: 'デフォルト', value: 'default' },
    { name: 'モノクロ', value: 'monochrome' },
    { name: 'ダーク', value: 'dark' },
    { name: 'イエロー', value: 'yellow' }
]

type MenuState = 'main' | 'theme_selection'

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
    // useTheme からテーマ状態と切り替え関数を取得 ★
    const { themeName, setThemeName, theme } = useTheme()
    const [currentView, setCurrentView] = useState<MenuState>('main')
    const styles = createStyles(theme)
    const handleBackToMain = () => {
        setCurrentView('main')
    }
    const handleGoToThemes = () => {
        setCurrentView('theme_selection')
    }
    const handleThemeChange = (newTheme: ThemeName) => {
        setThemeName(newTheme)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setIsAnonymous(user?.isAnonymous ?? false)
        })
        return unsubscribe
    }, [])

    // visible の変更に応じてアニメーションを実行
    useEffect(() => {
        if (visible) {
            setCurrentView('main')
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

    // アカウント連携画面への遷移
    const handleLinkAccount = () => {
        onClose()
        router.replace('/settings/link_account')
    }

    // アカウント削除画面への遷移
    const handleDeleteAccount = () => {
        onClose()
        router.replace('/settings/delete_account')
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
                style={[styles.overlay, { backgroundColor: theme.background + '99' } as StyleProp<ViewStyle>]}
                activeOpacity={1}
                onPress={onClose} // オーバーレイタップで閉じる
            >
                {/* 2. 中央表示されるメニュー本体 */}
                <Animated.View
                    style={[
                        styles.menuContainer,
                        {
                            opacity: fadeAnim, // フェードアニメーション
                            transform: [{ scale: scaleAnim }], // スケールアニメーション
                            backgroundColor: theme.listItemBackground
                        }
                    ]}
                >
                    <View style={styles.menuHeader}>
                        <Text style={styles.menuTitle}>Menu</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={[styles.closeButtonText, { color: theme.text }]}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {currentView === 'main' && (
                        <View>
                            <TouchableOpacity style={styles.menuItem} onPress={handleGoToThemes}>
                                <Text style={styles.menuItemText}>カラーテーマ設定</Text>
                            </TouchableOpacity>
                            {isAnonymous && (
                                <TouchableOpacity style={styles.menuItem} onPress={handleLinkAccount}>
                                    <Text style={styles.menuItemText}>アカウント連携</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                                <Text style={styles.menuItemText}>ログアウト</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount}>
                                <Text style={[styles.menuItemText, { color: '#D9534F' } as StyleProp<TextStyle>]}>アカウント削除</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {currentView === 'theme_selection' && (
                        <View style={styles.themeOptionsContainer}>
                            {THEME_OPTIONS.map(option => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.themeOptionItem,
                                        themeName === option.value && {
                                            backgroundColor: theme.primary + '1A',
                                            borderColor: theme.primary
                                        }
                                    ]}
                                    onPress={() => handleThemeChange(option.value)}
                                >
                                    <Text style={[styles.menuItemText, { color: styles.menuItemText.color }]}>{option.name}</Text>
                                </TouchableOpacity>
                            ))}
                            <View style={styles.backButtonContainer}>
                                <TouchableOpacity style={styles.backButton} onPress={handleBackToMain}>
                                    <Text style={styles.backButtonText}>＜ 戻る</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Animated.View>
            </TouchableOpacity>
        </Modal>
    )
}

const createStyles = (theme: ThemeColors) => StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center', // 中央寄せ
        alignItems: 'center'     // 中央寄せ
    },
    menuContainer: {
        width: width * 0.8,
        borderRadius: 15,
        padding: 20,
        maxHeight: height * 0.7,
        shadowColor: theme.text === '#F7FAFC' ? '#FFF' : '#000',
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
        borderBottomColor: theme.listItemSeparator,
        paddingBottom: 15
    },
    menuTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.text
    },
    closeButton: {
        padding: 5
    },
    closeButtonText: {
        fontSize: 24
    },
    menuItem: {
        paddingVertical: 12,
        backgroundColor: theme.primary + '1A',
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
        color: theme.text
    },
    sectionHeader: {
        marginTop: 30,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#CCC',
        paddingBottom: 5
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.text
    },
    menuItemSelected: {
        backgroundColor: 'rgba(29, 66, 138, 0.1)',
        borderWidth: 1,
        borderColor: '#1D428A'
    },
    themeOptionItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: theme.listItemSeparator,
        borderRadius: 4,
        alignSelf: 'center',
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8
    },
    backButtonContainer: {
        // backButtonを囲むView
        width: '100%',
        marginTop: 16,
        alignItems: 'flex-end' // ボタンを右に寄せる
    },
    backButton: {
        alignSelf: "flex-end",
        marginRight: 16
    },
    backButtonText: {
        fontSize: 16,
        color: theme.text
    },
    themeOptionsContainer: {

    }
})

export default SideMenu
