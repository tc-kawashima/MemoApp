import { createIconSetFromIcoMoon, Feather } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import { ComponentProps } from 'react'

import fontData from '../../assets/fonts/icomoon.ttf'
import fontSelection from '../../assets/fonts/selection.json'

type FeatherName = ComponentProps<typeof Feather>['name']

const CustomIcon = createIconSetFromIcoMoon(
    fontSelection,
    'IcoMoon',
    'icomoon.ttf'
)

interface Props {
    name: string
    size: number
    color: string
}

const Icon = (props: Props) => {
    const { name, size, color } = props
    const isFeather = name.startsWith('feather-')
    const [fontLoaded] = useFonts({
        IcoMoon: fontData
    })
    if (isFeather) {
        const rawName = name.replace('feather-', '')
        const featherName = rawName as FeatherName
        return (
            <Feather name={featherName} size={size} color={color} />
        )
    }
    if (!fontLoaded) {
        return null
    }

    return (
        <CustomIcon name={name} size={size} color={color} />
    )
}

export default Icon
