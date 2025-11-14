import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { router } from 'expo-router'
import { deleteDoc, doc } from 'firebase/firestore'
import Swipeable from 'react-native-gesture-handler/Swipeable'

import Icon from './Icon'
import { type Memo } from '../../types/memo'
import { auth, db } from '../config'

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

const renderRightActions = (memoId: string) => {
    return (
        <TouchableOpacity
            style={styles.deleteAction}
            onPress={() => handlePress(memoId)}
        >
            <Icon name='delete' size={24} color='#FFF' />
        </TouchableOpacity>
    )
}

const MemoListItem = React.forwardRef((props: Props, ref: React.Ref<Swipeable>) => {
    const { memo, onSwipeableOpen, onCloseSwipeable, isAnySwipeableOpen } = props
    const { bodyText, updatedAt } = memo
    if (bodyText === null || updatedAt === null) { return null }
    const dateString = updatedAt.toDate().toLocaleString('ja-JP')
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

const styles = StyleSheet.create({
    deleteAction: {
        backgroundColor: '#D9534F', // 赤色
        justifyContent: 'center',
        alignItems: 'center',
        width: 80, // ボタンの幅
        height: '100%'
    },
    memoListItem: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 19,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,0.15)'
    },
    memoListItemTitle: {
        fontSize: 16,
        lineHeight: 32
    },
    memoListItemDate: {
        fontSize: 12,
        lineHeight: 16,
        color: '#848484'
    }
})

export default MemoListItem
