import { Stack } from 'expo-router'

const Layout = () => {
    return <Stack screenOptions={{
        headerStyle: {
            backgroundColor: '#1D428A'
        },
        headerTintColor: '#FFF',
        headerTitle: 'Memo App',
        headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold'
        },
        headerBackTitle: 'Back',
        headerBackTitleStyle: {
            fontSize: 16
        }
    }} />
}

export default Layout
