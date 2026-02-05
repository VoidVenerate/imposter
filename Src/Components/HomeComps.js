import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native'

const HomeComps = () => {
    const [displayedText, setDisplayedText] = useState('')
    const [leftEmoji, setLeftEmoji] = useState('😇')
    const [rightEmoji, setRightEmoji] = useState('😈')
    const fullText = 'IMPOSTER'
    const [pulseAnim] = useState(new Animated.Value(1))

    useEffect(() => {
        let currentIndex = 0
        const typingInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setDisplayedText(fullText.slice(0, currentIndex))
                currentIndex+=1
            } else {
                clearInterval(typingInterval)
            }
        }, 150)

        return () => {clearInterval(typingInterval)}
    },[])

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue:1.05,
                    duration:1000,
                    useNativeDriver:true
                }),
                Animated.timing(pulseAnim, {
                    toValue:1,
                    duration:1000,
                    useNativeDriver:true
                })
            ])
        ).start()
    },[])
  return (
   <View style={styles.container}>
      {/* Animated background gradient effect */}
      <View
        style={{
            position: 'absolute',
            top: 100,
            width: 250,
            height: 250,
            borderRadius: 125,
            backgroundColor: 'rgba(230,57,70,0.2)',
        }}
      />

      {/* Game Title with Emojis */}
      <View style={styles.titleContainer}>
        <Text style={styles.emojiLeft}>{leftEmoji}</Text>
        <Text style={styles.title}>
          {displayedText}
          <Text style={styles.cursor}>|</Text>
        </Text>
        <Text style={styles.emojiRight}>{rightEmoji}</Text>
      </View>

      {/* TagLine */}
      <Text style={styles.subtitle}>
        Trust no one, survive the deception
      </Text>

      {/* Decorative divider */}
      <View style={styles.divider} />

      {/* Buttons */}
      <View style={styles.buttonGroup}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Pressable 
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed
            ]}
          >
            <Text style={styles.primaryButtonText}>🎮 PLAY GAME 🎮</Text>
          </Pressable>
        </Animated.View>

        <Pressable 
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.secondaryButtonPressed
          ]}
        >
          <Text style={styles.secondaryButtonText}>❓ HOW TO PLAY ❓</Text>
        </Pressable>

        <Pressable style={styles.tertiaryButton}>
          <Text style={styles.tertiaryButtonText}>🏆 LEADERBOARD</Text>
        </Pressable>
      </View>

      {/* Footer warning */}
      <Text style={styles.footer}>⚠️ Be careful who you trust ⚠️</Text>
    </View>
  )
}

export default HomeComps

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e17',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    position: 'relative',
  },

  backgroundGlow: {
    position: 'absolute',
    top: '20%',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#E63946',
    opacity: 0.1,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  emojiLeft: {
    fontSize: 20,
    marginRight: 12,
  },

  emojiRight: {
    fontSize: 20,
    marginLeft: 12,
  },

  title: {
    fontSize: 40,
    fontWeight: '900',
    color: '#E63946',
    letterSpacing: 6,
    textShadowColor: '#E63946',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },

  cursor: {
    color: '#E63946',
    opacity: 0.7,
  },

  subtitle: {
    fontSize: 17,
    color: '#b8bdc4',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },

  divider: {
    width: 100,
    height: 2,
    backgroundColor: '#E63946',
    marginBottom: 40,
    borderRadius: 2,
  },

  buttonGroup: {
    width: '100%',
    maxWidth: 400,
  },

  primaryButton: {
    backgroundColor: '#E63946',
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#E63946',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },

  primaryButtonPressed: {
    backgroundColor: '#d32f3c',
    transform: [{ scale: 0.98 }],
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 2,
  },

  secondaryButton: {
    borderWidth: 2,
    borderColor: '#E63946',
    backgroundColor: 'rgba(230, 57, 70, 0.1)',
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 16,
  },

  secondaryButtonPressed: {
    backgroundColor: 'rgba(230, 57, 70, 0.2)',
    transform: [{ scale: 0.98 }],
  },

  secondaryButtonText: {
    color: '#E63946',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1.5,
  },

  tertiaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  tertiaryButtonText: {
    color: '#9AA0A6',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 1,
  },

  footer: {
    position: 'absolute',
    bottom: 40,
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
  },
})