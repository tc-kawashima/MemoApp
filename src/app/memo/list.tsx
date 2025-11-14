import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { router, useNavigation } from 'expo-router'
import { useEffect, useState, useRef } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { Swipeable } from 'react-native-gesture-handler'

import MemoListItem from '../../components/MemoListItem'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/Icon'
import SideMenu from '../../components/SideMenu'
import { db, auth } from '../../config'
import { type Memo } from '../../../types/memo'

const handlePress = (): void => {
    router.push('/memo/create')
}

const List = () => {
    const [memos, setMemos] = useState<Memo[]>([])
    const navigation = useNavigation()
    const [isSideMenuVisible, setIsSideMenuVisible] = useState(false)
    const [openedSwipeableId, setOpenedSwipeableId] = useState<string | null>(null)
    const isAnySwipeableOpen = openedSwipeableId !== null
    const itemRefs = useRef<{ [key: string]: Swipeable | null }>({})
    const handleSwipeableOpen = (id: string) => {
        if (openedSwipeableId && openedSwipeableId !== id) {
            itemRefs.current[openedSwipeableId]?.close()
        }
        setOpenedSwipeableId(id)
    }
    const closeOpenedSwipeable = () => {
        if (openedSwipeableId && itemRefs.current[openedSwipeableId]) {
            itemRefs.current[openedSwipeableId]?.close()
            setOpenedSwipeableId(null)
        }
    }
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                return (
                    <TouchableOpacity onPress={() => setIsSideMenuVisible(true)} style={{ paddingLeft: 6 }}>
                        <Icon name='feather-menu' size={24} color='#333' />
                    </TouchableOpacity>
                )
            }
        })
    }, [])
    useEffect(() => {
        if (auth.currentUser === null) { return }
        const ref = collection(db, `users/${auth.currentUser.uid}/memos`)
        const q = query(ref, orderBy('updatedAt', 'desc'))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const remoteMemos: Memo[] = []
            snapshot.forEach((doc) => {
                const { bodyText, updatedAt } = doc.data()
                remoteMemos.push({
                    id: doc.id,
                    bodyText,
                    updatedAt
                })
            })
            setMemos(remoteMemos)
        })
        return unsubscribe
    }, [])
    return (
        <View style={styles.container}>
            <FlatList
                data={memos}
                renderItem={({ item }) => (
                    <MemoListItem
                        key={item.id}
                        ref={ref => { itemRefs.current[item.id] = ref as Swipeable }}
                        memo={item}
                        onSwipeableOpen={handleSwipeableOpen}
                        onCloseSwipeable={closeOpenedSwipeable}
                        isAnySwipeableOpen={isAnySwipeableOpen}
                    />
                )}
                keyExtractor={(item) => item.id}
            />
            <CircleButton onPress={handlePress}>
                <Icon name='plus' size={40} color='#FFF' />
            </CircleButton>

            <SideMenu
                visible={isSideMenuVisible}
                onClose={() => setIsSideMenuVisible(false)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    }
})

export default List
