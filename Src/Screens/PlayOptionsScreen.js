import { StyleSheet, Text, View, Pressable, Animated } from 'react-native'
import React, { useState, useEffect } from 'react'

const PlayOptionsScreen = ({navigation}) => {
  const [pulseAnim] = useState(new Animated.Value(1))

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true
        })
      ])
    ).start()
  }, [])

  return (
    <View style={styles.container}>
      {/* Background glow effect */}
      <View style={styles.backgroundGlow} />

      {/* Header with emojis */}
      <View style={styles.header}>
        <Text style={styles.emoji}>🎮</Text>
        <Text style={styles.title}>CHOOSE MODE</Text>
        <Text style={styles.emoji}>🎮</Text>
      </View>

      <Text style={styles.subtitle}>How do you want to play?</Text>

      {/* Decorative divider */}
      <View style={styles.divider} />

      {/* Buttons container */}
      <View style={styles.buttonContainer}>
        {/* Host Game Button */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Pressable 
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed
            ]} 
            onPress={() => {navigation.navigate('CreateGame')}}
          >
            <Text style={styles.buttonIcon}>👑</Text>
            <Text style={styles.buttonText}>HOST GAME</Text>
            <Text style={styles.buttonHint}>Create a new lobby</Text>
          </Pressable>
        </Animated.View>

        {/* Join Game Button */}
        <Pressable 
          style={({ pressed }) => [
            styles.buttonSecondary,
            pressed && styles.buttonSecondaryPressed
          ]}
          onPress={() => {navigation.navigate('JoinGame')}}
        >
          <Text style={styles.buttonIconSecondary}>🔑</Text>
          <Text style={styles.buttonTextSecondary}>JOIN GAME</Text>
          <Text style={styles.buttonHintSecondary}>Enter a game code</Text>
        </Pressable>
      </View>

      {/* Back button */}
      <Pressable 
        onPress={() => navigation.goBack()} 
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>← Back to Menu</Text>
      </Pressable>

      {/* Info text */}
      <Text style={styles.infoText}>
        ⚡ Quick tip: Hosting lets you control the game settings
      </Text>
    </View>
  )
}

export default PlayOptionsScreen

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 24,
    backgroundColor: '#0a0e17',
  },

  backgroundGlow: {
    position: 'absolute',
    top: '25%',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(230, 57, 70, 0.12)',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  emoji: {
    fontSize: 32,
    marginHorizontal: 10,
  },

  title: { 
    fontSize: 38, 
    fontWeight: '900', 
    color: '#E63946',
    letterSpacing: 3,
    textShadowColor: '#E63946',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },

  subtitle: {
    fontSize: 16,
    color: '#9AA0A6',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },

  divider: {
    width: 100,
    height: 2,
    backgroundColor: '#E63946',
    marginBottom: 40,
    borderRadius: 2,
  },

  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#E63946',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#E63946',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },

  buttonPressed: {
    backgroundColor: '#d32f3c',
    transform: [{ scale: 0.98 }],
  },

  buttonIcon: {
    fontSize: 36,
    marginBottom: 8,
  },

  buttonText: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: '800', 
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 4,
  },

  buttonHint: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontWeight: '500',
    fontStyle: 'italic',
  },

  buttonSecondary: {
    borderWidth: 2,
    borderColor: '#E63946',
    backgroundColor: 'rgba(230, 57, 70, 0.1)',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignItems: 'center',
  },

  buttonSecondaryPressed: {
    backgroundColor: 'rgba(230, 57, 70, 0.2)',
    transform: [{ scale: 0.98 }],
  },

  buttonIconSecondary: {
    fontSize: 36,
    marginBottom: 8,
  },

  buttonTextSecondary: { 
    color: '#E63946', 
    fontSize: 20, 
    fontWeight: '800', 
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 4,
  },

  buttonHintSecondary: {
    color: 'rgba(230, 57, 70, 0.7)',
    fontSize: 13,
    fontWeight: '500',
    fontStyle: 'italic',
  },

  backButton: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 10,
    minWidth: 200,
  },

  backButtonText: {
    color: '#9AA0A6',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
  },

  infoText: {
    position: 'absolute',
    bottom: 30,
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
})