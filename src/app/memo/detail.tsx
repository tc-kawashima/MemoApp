import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { onSnapshot, doc } from 'firebase/firestore'
import { useState, useEffect } from 'react'

import CircleButton from '../../components/CircleButton'
import Icon from '../../components/Icon'
import { auth, db } from '../../config'
import { type Memo } from '../../../types/memo'
import { useThemedStyles } from '../../hooks/useThemedStyles'
import { ThemeColors } from '../../themes/colors'


const handlePress = (id: string): void => {
    router.push({ pathname: '/memo/edit', params: { id } })
}

const Detail = () => {
    const { styles } = useThemedStyles(createStyles)
    const id = String(useLocalSearchParams().id)
    console.log(id)
    const [memo, setMemo] = useState<Memo | null>(null)
    useEffect(() => {
        if (auth.currentUser === null) { return }
        const ref = doc(db, `users/${auth.currentUser.uid}/memos`, id)
        const unsubscribe = onSnapshot(ref, (memoDoc) => {
            const { bodyText, updatedAt } = memoDoc.data() as Memo
            setMemo({
                id: memoDoc.id,
                bodyText,
                updatedAt
            })
        })
        return unsubscribe
    }, [])
    return (
        <View style={styles.container}>
            <View style={styles.memoHeader}>
                <Text style={styles.memoTitle} numberOfLines={1}>{memo?.bodyText}</Text>
                <Text style={styles.memoDate}>{memo?.updatedAt?.toDate().toLocaleString('ja-JP')}</Text>
            </View>
            <ScrollView style={styles.memoBody}>
                <Text style={styles.memoBodyText}>
                    {memo?.bodyText}
                </Text>
            </ScrollView>
            <CircleButton onPress={() => { handlePress(id) }} style={styles.circleButton}>
                <Icon name='pencil' size={40} color='#FFF' />
            </CircleButton>
        </View>
    )
}

const createStyles = (theme: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background
    },
    memoHeader: {
        backgroundColor: theme.primary,
        height: 96,
        justifyContent: 'center',
        paddingVertical: 24,
        paddingHorizontal: 19
    },
    memoTitle: {
        color: theme.text,
        fontSize: 20,
        lineHeight: 32,
        fontWeight: 'bold'
    },
    memoDate: {
        color: theme.text,
        fontSize: 12,
        lineHeight: 16
    },
    memoBody: {
        paddingHorizontal: 27,
        backgroundColor: theme.background
    },
    memoBodyText: {
        paddingVertical: 32,
        fontSize: 16,
        lineHeight: 24,
        color: theme.text
    },
    circleButton: {
        backgroundColor: theme.secondary, // テーマ適用
        top: 60,
        bottom: 'auto'
    }
})

export default Detail
