import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const Layout = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#1D428A'
                    },
                    headerTintColor: '#FFF',
                    headerTitle: 'Memo App',
                    headerTitleStyle: {
                        fontSize: 22,
                        fontWeight: 'bold'
                    },
                    headerBackButtonDisplayMode: 'minimal'
                }}
            >
            </Stack>
        </GestureHandlerRootView>
    )
}

export default Layout
