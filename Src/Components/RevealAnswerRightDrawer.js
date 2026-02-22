import React, { useRef, useState, useEffect, useCallback } from 'react'
import {
    Animated,
    Dimensions,
    PanResponder,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from 'react-native'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const DRAWER_WIDTH = SCREEN_WIDTH * 0.85
const HIDDEN_X = DRAWER_WIDTH

export default function RightDrawer({ children, visible, onClose }) {
    const translateX = useRef(new Animated.Value(HIDDEN_X)).current

    // Keep mounted during close animation so it can play out fully
    const [shouldRender, setShouldRender] = useState(visible)

    const openDrawer = useCallback(() => {
        Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
        }).start()
    }, [translateX])

    const closeDrawer = useCallback(() => {
        Animated.spring(translateX, {
            toValue: HIDDEN_X,
            useNativeDriver: true,
            bounciness: 0,
        }).start(({ finished }) => {
            if (finished) {
                setShouldRender(false)
                onClose?.()
            }
        })
    }, [translateX, onClose])

    useEffect(() => {
        if (visible) {
            setShouldRender(true)
        } else {
            closeDrawer()
        }
    }, [visible])

    useEffect(() => {
        if (shouldRender && visible) {
            openDrawer()
        }
    }, [shouldRender])

    // Refs so PanResponder callbacks are never stale
    const openRef = useRef(openDrawer)
    const closeRef = useRef(closeDrawer)
    useEffect(() => { openRef.current = openDrawer }, [openDrawer])
    useEffect(() => { closeRef.current = closeDrawer }, [closeDrawer])

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) =>
                Math.abs(g.dx) > Math.abs(g.dy) && g.dx > 5,
            onPanResponderMove: (_, g) => {
                if (g.dx > 0) translateX.setValue(g.dx)
            },
            onPanResponderRelease: (_, g) => {
                if (g.dx > DRAWER_WIDTH * 0.3 || g.vx > 0.5) {
                    closeRef.current()
                } else {
                    openRef.current()
                }
            },
        })
    ).current

    if (!shouldRender) return null

    return (
        <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={closeDrawer}>
                <View style={styles.backdrop} />
            </TouchableWithoutFeedback>

            <Animated.View
                style={[styles.drawer, { transform: [{ translateX }] }]}
                {...panResponder.panHandlers}
            >
                {/* Drag handle */}
                <View style={styles.handleContainer}>
                    <View style={styles.handle} />
                </View>

                {children}
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        zIndex: 999,
    },

    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },

    drawer: {
        width: DRAWER_WIDTH,
        height: SCREEN_HEIGHT,
        // Matches the dark game theme
        backgroundColor: '#0a0e17',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        overflow: 'hidden',
        elevation: 16,
        shadowColor: '#E63946',
        shadowOffset: { width: -4, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        // Subtle red left border to tie into the design system
        borderLeftWidth: 2,
        borderLeftColor: 'rgba(230, 57, 70, 0.4)',
    },

    handleContainer: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 4,
    },

    handle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(230, 57, 70, 0.4)',
    },
})
