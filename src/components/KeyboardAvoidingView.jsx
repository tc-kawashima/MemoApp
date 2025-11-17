/* eslint-disable  */
import React, { useRef, useState, useEffect } from 'react'
import {
  Keyboard, Dimensions, Animated
} from 'react-native'

const KeyboardSafeView = ({ children, style }) => {
  const initialViewHeight = useRef(null)
  const animatedViewHeight = useRef(new Animated.Value(Dimensions.get('window').height))
  const [viewHeight, setViewHeight] = useState(null)

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', handleShow)
    const hideSubscription = Keyboard.addListener('keyboardDidHide', handleHide)
    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [])

  useEffect(() => {
    if ([initialViewHeight, animatedViewHeight, viewHeight].some((val) => val === null)) { return }
    if (viewHeight === initialViewHeight.current) {
      Animated.timing(animatedViewHeight.current,
        { toValue: initialViewHeight.current, duration: 300, useNativeDriver: false }).start()
    } else {
      Animated.timing(animatedViewHeight.current,
        { toValue: viewHeight, duration: 300, useNativeDriver: false }).start()
    }
  }, [viewHeight])

  const handleShow = ({ endCoordinates }) => {
    if (endCoordinates.height && initialViewHeight.current) {
      const keyboardHeight = Dimensions.get('window').height - endCoordinates.screenY
      setViewHeight(initialViewHeight.current - keyboardHeight - 100)
    }
  }

  const handleHide = () => {
    setViewHeight(initialViewHeight.current - 110)
  }

  const handleLayout = ({ nativeEvent }) => {
    if (!initialViewHeight.current) {
      const { height } = nativeEvent.layout
      initialViewHeight.current = height
      animatedViewHeight.current = new Animated.Value(height)
    }
  }

  const animatedStyle = viewHeight
    ? {
        height: animatedViewHeight.current,
        flex: 0
      }
    : {}
  return (
    <Animated.View style={[style, animatedStyle]} onLayout={handleLayout}>
      {children}
    </Animated.View>
  )
}
export default KeyboardSafeView
