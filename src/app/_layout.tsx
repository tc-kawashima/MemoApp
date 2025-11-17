import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ThemeProvider } from '../context/ThemeContext'
import { useTheme } from '../context/ThemeContext'

const RootStack = () => {
    const { theme } = useTheme()
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.primary
                },
                headerTintColor: theme.text,
                headerTitle: 'Memo App',
                headerTitleStyle: {
                    fontSize: 22,
                    fontWeight: 'bold',
                    color: theme.text
                },
                headerBackTitle: '',
                headerBackButtonDisplayMode: 'minimal'
            }}
        >
            <Stack.Screen name="memo/list" />
            <Stack.Screen name="memo/detail" />
            <Stack.Screen name="memo/edit" />
            <Stack.Screen name="memo/create" />
        </Stack>
    )
}


const Layout = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
                <RootStack />
            </ThemeProvider>
        </GestureHandlerRootView>
    )
}

export default Layout
