import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { router } from 'expo-router'
import { deleteDoc, doc } from 'firebase/firestore'
import Swipeable from 'react-native-gesture-handler/Swipeable'

import Icon from './Icon'
import { type Memo } from '../../types/memo'
import { auth, db } from '../config'
import { useThemedStyles } from '../hooks/useThemedStyles'
import { ThemeColors } from '../themes/colors'

interface Props {
    memo: Memo
    onSwipeableOpen: (id: string) => void
    onCloseSwipeable: () => void
    isAnySwipeableOpen: boolean
}

const handlePress = (id: string): void => {
    if (auth.currentUser === null) { return }
    const ref = doc(db, `users/${auth.currentUser.uid}/memos`, id)
    Alert.alert('メモを削除します', 'よろしいですか？', [
        {
            text: 'キャンセル'
        },
        {
            text: '削除する',
            style: 'destructive',
            onPress: () => {
                deleteDoc(ref)
                    .catch(() => { Alert.alert('削除に失敗しました') })
            }
        }
    ])
}

const STATIC_STYLES = StyleSheet.create({
    deleteAction: {
        backgroundColor: '#D9534F',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%'
    }
})

const renderRightActions = (memoId: string) => {
    return (
        <TouchableOpacity
            style={STATIC_STYLES.deleteAction} // ★ 修正: STATIC_STYLES を参照 ★
            onPress={() => handlePress(memoId)}
        >
            <Icon name='delete' size={24} color='#FFF' />
        </TouchableOpacity>
    )
}

const MemoListItem = React.forwardRef((props: Props, ref: React.Ref<Swipeable>) => {
    const { styles } = useThemedStyles(createStyles)
    const { memo, onSwipeableOpen, onCloseSwipeable, isAnySwipeableOpen } = props
    const { bodyText, updatedAt } = memo
    if (bodyText === null || updatedAt === null) { return null }
    const date = updatedAt.toDate()
    const dateString = date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }) + '  ' + date.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit'
    })
    const handleDetailPress = () => {
        if (isAnySwipeableOpen) {
            onCloseSwipeable()
            return
        }
        router.push({ pathname: '/memo/detail', params: { id: memo.id } })
    }
    const handleSwipeableOpen = () => {
        onSwipeableOpen(memo.id)
    }
    return (
        <Swipeable
            ref={ref}
            renderRightActions={() => renderRightActions(memo.id)}
            rightThreshold={80}
            onSwipeableOpen={handleSwipeableOpen}
        >
            <TouchableOpacity onPress={handleDetailPress} style={styles.memoListItem}>
                <View>
                    <Text numberOfLines={1} style={styles.memoListItemTitle}>{bodyText}</Text>
                    <Text style={styles.memoListItemDate}>{dateString}</Text>
                </View>
            </TouchableOpacity>
        </Swipeable>
    )
})

MemoListItem.displayName = 'MemoListItem'

const createStyles = (theme: ThemeColors) => StyleSheet.create({
    memoListItem: {
        backgroundColor: theme.listItemBackground,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 19,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: theme.listItemSeparator
    },
    memoListItemTitle: {
        fontSize: 16,
        lineHeight: 32,
        color: theme.text
    },
    memoListItemDate: {
        fontSize: 12,
        lineHeight: 16,
        color: theme.text,
        opacity: 0.7
    }
})

export default MemoListItem
