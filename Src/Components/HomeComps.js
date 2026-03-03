import React, { useState, useEffect, useRef } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Animated, 
  Dimensions,
  Easing 
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

const { width, height } = Dimensions.get('window')

const HomeComps = () => {
  const [displayedText, setDisplayedText] = useState('')
  const [glitchText, setGlitchText] = useState('IMPOSTER')
  const [isGlitching, setIsGlitching] = useState(false)
  const fullText = 'IMPOSTER'
  const navigation = useNavigation()
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current
  const scanlineAnim = useRef(new Animated.Value(0)).current
  const floatAnim = useRef(new Animated.Value(0)).current
  const opacityAnim = useRef(new Animated.Value(0)).current
  const rotateAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current
  
  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`'

  // Typing effect with occasional glitch
  useEffect(() => {
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        // Random glitch chance during typing
        if (Math.random() > 0.85 && currentIndex > 2) {
          triggerGlitch()
        }
        setDisplayedText(fullText.slice(0, currentIndex))
        currentIndex += 1
      } else {
        clearInterval(typingInterval)
        // Occasional glitches after complete
        setInterval(() => {
          if (Math.random() > 0.7) triggerGlitch()
        }, 3000)
      }
    }, 180)

    return () => clearInterval(typingInterval)
  }, [])

  // Glitch effect
  const triggerGlitch = () => {
    setIsGlitching(true)
    let iterations = 0
    const maxIterations = 8
    
    const glitchInterval = setInterval(() => {
      setGlitchText(
        fullText
          .split('')
          .map((char, index) => {
            if (index < iterations) return fullText[index]
            return glitchChars[Math.floor(Math.random() * glitchChars.length)]
          })
          .join('')
      )
      
      iterations += 1/3
      
      if (iterations >= fullText.length) {
        clearInterval(glitchInterval)
        setGlitchText(fullText)
        setIsGlitching(false)
      }
    }, 50)
  }

  // Ambient animations
  useEffect(() => {
    // Breathing pulse for primary button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        })
      ])
    ).start()

    // Scanline movement
    Animated.loop(
      Animated.timing(scanlineAnim, {
        toValue: height,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start()

    // Floating animation for title
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        }),
        Animated.timing(floatAnim, {
          toValue: 10,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        })
      ])
    ).start()

    // Fade in
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start()

    // Scale in
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true
    }).start()
  }, [])

  const handlePlayGame = () => {
    navigation.navigate('PlayOptions')
  }

  // Paranoia indicator dots
  const renderParanoiaDots = () => {
    return (
      <View style={styles.paranoiaContainer}>
        {[...Array(5)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.paranoiaDot,
              {
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.08],
                  outputRange: [0.3 + (i * 0.15), 1]
                }),
                transform: [{
                  scale: pulseAnim.interpolate({
                    inputRange: [1, 1.08],
                    outputRange: [1, 1.2 + (i * 0.1)]
                  })
                }]
              }
            ]}
          />
        ))}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* CRT Scanline Effect */}
      <Animated.View
        style={[
          styles.scanline,
          {
            transform: [{ translateY: scanlineAnim }]
          }
        ]}
      />
      
      {/* Vignette Overlay */}
      <View style={styles.vignette} />
      
      {/* Grid Background */}
      <View style={styles.gridOverlay} />

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              left: `${15 + (i * 15)}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              opacity: 0.1 + (Math.random() * 0.2)
            }
          ]}
        />
      ))}

      {/* Suspicion Meter */}
      <View style={styles.suspicionMeter}>
        <Text style={styles.suspicionLabel}>SUSPICION LEVEL</Text>
        <View style={styles.suspicionBar}>
          <Animated.View 
            style={[
              styles.suspicionFill,
              {
                width: pulseAnim.interpolate({
                  inputRange: [1, 1.08],
                  outputRange: ['60%', '95%']
                })
              }
            ]} 
          />
        </View>
      </View>

      {/* Main Content */}
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Warning Badge */}
        <View style={styles.warningBadge}>
          <Text style={styles.warningText}>⚠️ CLASSIFIED</Text>
        </View>

        {/* Title with Glitch Effect */}
        <Animated.View 
          style={[
            styles.titleContainer,
            { transform: [{ translateY: floatAnim }] }
          ]}
        >
          <Text style={styles.emojiLeft}>👁️</Text>
          <View style={styles.titleWrapper}>
            <Text style={[
              styles.title,
              isGlitching && styles.titleGlitch
            ]}>
              {isGlitching ? glitchText : displayedText}
              {!isGlitching && displayedText.length < fullText.length && (
                <Text style={styles.cursor}>█</Text>
              )}
            </Text>
            {isGlitching && (
              <Text style={[styles.title, styles.titleGlitchOffset]}>
                {glitchText}
              </Text>
            )}
          </View>
          <Text style={styles.emojiRight}>🔪</Text>
        </Animated.View>

        {/* Paranoia Indicators */}
        {renderParanoiaDots()}

        {/* Tagline with Typewriter feel */}
        <View style={styles.taglineContainer}>
          <Text style={styles.subtitle}>
            <Text style={styles.redacted}>█ █ █ █</Text> TRUST NO ONE{' '}
            <Text style={styles.redacted}>█ █ █ █</Text>
          </Text>
          <Text style={styles.subtitleSecondary}>
            Deception is survival. Survival is deception.
          </Text>
        </View>

        {/* Trust Indicator */}
        <View style={styles.trustIndicator}>
          <Text style={styles.trustLabel}>CREWMATES: ?? / 10</Text>
          <Text style={styles.trustLabel}>IMPOSTORS: ?? / 2</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Pressable 
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed
              ]}
              onPress={handlePlayGame}
              android_ripple={{ color: 'rgba(255,0,0,0.3)' }}
            >
              <View style={styles.buttonGlow} />
              <Text style={styles.primaryButtonText}>
                🚨 ENTER THE SHIP
              </Text>
              <Text style={styles.buttonSubtext}>Begin Deception Protocol</Text>
            </Pressable>
          </Animated.View>

          <View style={styles.secondaryRow}>
            <Pressable 
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.secondaryButtonPressed
              ]}
            >
              <Text style={styles.secondaryButtonText}>📋 DOSSIER</Text>
              <Text style={styles.buttonHint}>How to Survive</Text>
            </Pressable>

            <Pressable 
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.secondaryButtonPressed,
                styles.leaderboardButton
              ]}
            >
              <Text style={styles.secondaryButtonText}>📊 INTEL</Text>
              <Text style={styles.buttonHint}>Leaderboard</Text>
            </Pressable>
          </View>
        </View>

        {/* Footer Warning */}
        <View style={styles.footerContainer}>
          <Animated.Text 
            style={[
              styles.footer,
              {
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.08],
                  outputRange: [0.4, 1]
                })
              }
            ]}
          >
            ⚠️ WATCH YOUR BACK ⚠️
          </Animated.Text>
          <Text style={styles.version}>v2.0.4 // SECURE CONNECTION</Text>
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  
  // CRT Effects
  scanline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    zIndex: 100,
    pointerEvents: 'none',
  },
  
  vignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'radial-gradient(circle, transparent 40%, #000 100%)',
    opacity: 0.8,
    zIndex: 1,
  },
  
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03,
    backgroundColor: 'transparent',
    backgroundImage: `
      linear-gradient(rgba(255, 0, 0, 0.3) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 0, 0, 0.3) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
  },

  // Floating Particles
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#ff3333',
    borderRadius: 2,
    shadowColor: '#ff0000',
    shadowRadius: 10,
    shadowOpacity: 0.8,
  },

  // Suspicion Meter
  suspicionMeter: {
    position: 'absolute',
    top: 60,
    right: 20,
    alignItems: 'flex-end',
    zIndex: 10,
  },
  
  suspicionLabel: {
    color: '#ff4444',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 4,
    opacity: 0.8,
  },
  
  suspicionBar: {
    width: 100,
    height: 4,
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  
  suspicionFill: {
    height: '100%',
    backgroundColor: '#ff4444',
    shadowColor: '#ff0000',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 1,
  },

  // Content
  content: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 5,
  },

  warningBadge: {
    borderWidth: 1,
    borderColor: '#ff4444',
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 30,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    transform: [{ skewX: '-10deg' }],
  },
  
  warningText: {
    color: '#ff4444',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 3,
    transform: [{ skewX: '10deg' }],
  },

  // Title
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  
  titleWrapper: {
    position: 'relative',
  },
  
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 8,
    textShadowColor: '#ff0000',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    fontFamily: 'monospace',
  },
  
  titleGlitch: {
    color: '#ff4444',
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 2, height: 0 },
    opacity: 0.9,
  },
  
  titleGlitchOffset: {
    position: 'absolute',
    top: 0,
    left: 0,
    color: '#00ffff',
    opacity: 0.5,
    transform: [{ translateX: -2 }],
  },
  
  cursor: {
    color: '#ff4444',
    opacity: 0.8,
  },
  
  emojiLeft: {
    fontSize: 28,
    marginRight: 16,
    opacity: 0.9,
    transform: [{ rotate: '-15deg' }],
  },
  
  emojiRight: {
    fontSize: 28,
    marginLeft: 16,
    opacity: 0.9,
    transform: [{ rotate: '15deg' }],
  },

  // Paranoia Dots
  paranoiaContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  
  paranoiaDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff4444',
  },

  // Tagline
  taglineContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 8,
  },
  
  subtitleSecondary: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    letterSpacing: 1,
    fontStyle: 'italic',
  },
  
  redacted: {
    backgroundColor: '#333',
    color: '#333',
    overflow: 'hidden',
    borderRadius: 2,
  },

  // Trust Indicator
  trustIndicator: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 40,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,68,68,0.3)',
    borderRadius: 8,
  },
  
  trustLabel: {
    color: '#ff4444',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    fontFamily: 'monospace',
  },

  // Buttons
  buttonGroup: {
    width: '100%',
    maxWidth: 380,
    gap: 16,
  },
  
  primaryButton: {
    backgroundColor: '#1a0000',
    paddingVertical: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ff4444',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#ff0000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  
  buttonGlow: {
    position: 'absolute',
    top: -50,
    left: -50,
    right: -50,
    bottom: -50,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderRadius: 100,
  },
  
  primaryButtonPressed: {
    backgroundColor: '#2a0000',
    transform: [{ scale: 0.98 }],
    borderColor: '#ff6666',
  },
  
  primaryButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: 4,
  },
  
  buttonSubtext: {
    color: '#ff4444',
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 2,
    opacity: 0.8,
    fontWeight: '600',
  },
  
  secondaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  
  secondaryButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.4)',
    alignItems: 'center',
  },
  
  leaderboardButton: {
    borderColor: 'rgba(100, 100, 100, 0.4)',
  },
  
  secondaryButtonPressed: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderColor: '#ff4444',
  },
  
  secondaryButtonText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  
  buttonHint: {
    color: '#666',
    fontSize: 10,
    letterSpacing: 1,
  },

  // Footer
  footerContainer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  
  footer: {
    fontSize: 12,
    color: '#ff4444',
    fontWeight: '800',
    letterSpacing: 4,
    marginBottom: 8,
  },
  
  version: {
    fontSize: 9,
    color: '#444',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
})

export default HomeComps