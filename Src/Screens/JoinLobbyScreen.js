import { StyleSheet, Text, View, Pressable, Animated, TextInput, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { joinGame } from '../api'

const JoinLobbyScreen = ({ navigation }) => {
  const [gameId, setGameId] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [scaleAnim] = useState(new Animated.Value(1))
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.02, duration: 1500, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 1500, useNativeDriver: true })
      ])
    ).start()
  }, [])

  const handleJoin = async () => {
    if (!gameId.trim() || !name.trim()) return
    setLoading(true)
    setErrorMessage('')

    try {
      const data = await joinGame(gameId.trim(), name.trim())

      // Check if player exists
      const player = data.players.find(p => p.name === name.trim())
      if (!player) throw new Error('Player not found in game response')

      navigation.navigate("LobbyScreen", {
        gameId: data.game_id,
        isHost: false,
        playerName: name.trim(),
        playerId: player.id,
      })
    } catch (error) {
      console.error("Error joining game:", error)

      // Show user-friendly error
      if (error.response) {
        if (error.response.status === 404) {
          setErrorMessage(`❌ ${error.response.data.detail}`) // Shows: Player name already taken
        } else if (error.response.status >= 500) {
          setErrorMessage('❌ Server error. Try again later.')
        } else {
          setErrorMessage(`❌ Error: ${error.response.status}`)
        }
      } else {
        setErrorMessage('❌ Network error. Check your connection.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.backgroundGlow} />
      <View style={styles.header}>
        <Text style={styles.emoji}>🔑</Text>
        <Text style={styles.title}>Join Lobby</Text>
        <Text style={styles.emoji}>🔑</Text>
      </View>

      <Text style={styles.subtitle}>Join a game and play with your friends</Text>
      <View style={styles.divider} />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>🎲 Game Code</Text>
        <TextInput
          placeholder='Enter Game ID...'
          placeholderTextColor='#6b7280'
          value={gameId}
          onChangeText={setGameId}
          style={[styles.input, { marginBottom: 20 }]}
          autoCapitalize='characters'
          editable={!loading}
        />

        <Text style={styles.label}>🎭 Your Name</Text>
        <TextInput
          placeholder='Enter your name...'
          placeholderTextColor='#6b7280'
          value={name}
          onChangeText={setName}
          style={styles.input}
          maxLength={20}
          editable={!loading}
        />
        {name.length > 0 && <Text style={styles.charCount}>{name.length}/20</Text>}
        {errorMessage.length > 0 && <Text style={{ color: 'red', marginTop: 6 }}>{errorMessage}</Text>}
      </View>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPress={handleJoin}
          style={({ pressed }) => [
            styles.button,
            (!name.trim() || !gameId.trim() || loading) && styles.buttonDisabled,
            pressed && styles.buttonPressed
          ]}
          disabled={!name.trim() || !gameId.trim() || loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={[styles.buttonText, styles.loadingText]}>⏳ JOINING...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>
              {name.trim() && gameId.trim() ? '🚀 JOIN GAME 🚀' : '⚠️ FILL ALL FIELDS'}
            </Text>
          )}
        </Pressable>
      </Animated.View>

      <Pressable onPress={() => navigation.goBack()} style={styles.backButton} disabled={loading}>
        <Text style={[styles.backButtonText, loading && styles.disabledText]}>← Back to Menu</Text>
      </Pressable>

      <Text style={styles.infoText}>💡 Get the game code from your host to join</Text>
    </View>
  )
}

export default JoinLobbyScreen

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 24,
    backgroundColor: '#0a0e17',
  },

  backgroundGlow: {
    position: 'absolute',
    top: '20%',
    alignSelf: 'center',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(230, 57, 70, 0.15)',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  emoji: {
    fontSize: 36,
    marginHorizontal: 12,
  },

  title: { 
    fontSize: 40, 
    fontWeight: '900', 
    color: '#E63946',
    letterSpacing: 2,
    textShadowColor: '#E63946',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },

  subtitle: {
    fontSize: 15,
    color: '#9AA0A6',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },

  divider: {
    width: 80,
    height: 2,
    backgroundColor: '#E63946',
    alignSelf: 'center',
    marginBottom: 40,
    borderRadius: 2,
  },

  inputContainer: {
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
    color: '#b8bdc4',
    marginBottom: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  input: {
    borderWidth: 2,
    borderColor: '#E63946',
    backgroundColor: 'rgba(230, 57, 70, 0.05)',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  charCount: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 6,
  },

  button: {
    backgroundColor: '#E63946',
    padding: 18,
    borderRadius: 14,
    shadowColor: '#E63946',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 16,
  },

  buttonDisabled: {
    backgroundColor: '#4a4a4a',
    opacity: 0.5,
    shadowOpacity: 0,
  },

  buttonPressed: {
    backgroundColor: '#d32f3c',
    transform: [{ scale: 0.98 }],
  },

  buttonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontWeight: '800',
    fontSize: 17,
    letterSpacing: 1.5,
  },

  backButton: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
    alignSelf: 'center',
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
})