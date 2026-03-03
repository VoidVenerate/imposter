import { View, Text, Pressable, FlatList, StyleSheet, Animated } from 'react-native'
import { useState, useEffect } from 'react'
import { useWebsocket } from '../websocket'
import { startGame } from '../api'

const LobbyScreen = ({ route, navigation }) => {
  const { gameId, playerName, isHost, playerId } = route.params
  const [pulseAnim] = useState(new Animated.Value(1))
  
  // UI state
  const [players, setPlayers] = useState([])
  
  // Socket hook
  const { send, status } = useWebsocket(gameId, playerName, (msg) => {
    console.log('RAW SERVER MESSAGE:', JSON.stringify(msg, null, 2));
    
    if (msg.event === 'player_joined' || msg.event === 'current_state') {
      setPlayers(msg.players || [])
    }
    
    if (msg.stage === 'question_answering') {
      // Just navigate - QuestionScreen will get question from WebSocket
      navigation.replace('QuestionScreen', { 
        gameId, 
        playerName, 
        playerId
      })
    }
    
    if (msg.stage === 'question_reveal') {
      navigation.replace('RevealAnswersScreen')
    }

    if (msg.event === 'reveal_imposter') {
      navigation.replace('GameEndScreen', {
        gameId,
        playerName,
        isHost,
      })
    }
  })

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        })
      ])
    ).start()
  }, [])

  const handleStartGame = async () => {
    try {
      if (players.length < 3) {
        alert("Need at least 3 players to start!")
        return
      }
      const data = await startGame(gameId)
      console.log("START GAME RESPONSE:", data)
    } catch (error) {
      console.log("START GAME ERROR:", error.response?.data || error.message)
    }
  }

  const getStatusColor = () => {
    switch(status) {
      case 'open': return '#4ade80'
      case 'connecting': return '#fbbf24'
      case 'closed': return '#ef4444'
      default: return '#9AA0A6'
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.backgroundGlow} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.emoji}>🎮</Text>
        <Text style={styles.title}>LOBBY</Text>
        <Text style={styles.emoji}>🎮</Text>
      </View>

      {/* Game ID */}
      <View style={styles.gameCodeContainer}>
        <Text style={styles.gameCodeLabel}>Game Code</Text>
        <Text style={styles.gameCode}>{gameId}</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {(status||'closed').toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Players */}
      <View style={styles.playersSection}>
        <Text style={styles.playersTitle}>👥 Players ({players.length})</Text>
        <FlatList
          data={players}
          keyExtractor={(item) => item.id || item.player_id}
          renderItem={({ item }) => (
            <View style={styles.playerItem}>
              <Text style={styles.playerEmoji}>
                {(item.id === playerId || item.player_id === playerId) ? '👑' : '🎭'}
              </Text>
              <Text style={styles.playerName}>
                {item.name} {(item.id === playerId || item.player_id === playerId) ? "(You)" : ""}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.playersListContent}
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {isHost && (
          <Animated.View style={{ transform: [{ scale: players.length >= 3 ? pulseAnim : 1 }] }}>
            <Pressable 
              onPress={handleStartGame}
              disabled={players.length < 3 || status !== 'open'}
              style={({ pressed }) => [
                styles.startButton,
                (players.length < 3 || status !== 'open') && styles.buttonDisabled,
                pressed && styles.startButtonPressed
              ]}
            >
              <Text style={styles.startButtonText}>
                {players.length >= 3 && status === 'open' 
                  ? '🚀 START GAME 🚀' 
                  : '⏳ WAITING FOR PLAYERS'
                }
              </Text>
            </Pressable>
          </Animated.View>
        )}

        <Pressable 
          onPress={() => navigation.goBack()} 
          style={styles.leaveButton}
        >
          <Text style={styles.leaveButtonText}>🚪 Leave Lobby</Text>
        </Pressable>
      </View>

      {isHost && <Text style={styles.hostIndicator}>👑 You are the host</Text>}
    </View>
  )
}

export default LobbyScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e17',
    padding: 24,
  },

  backgroundGlow: {
    position: 'absolute',
    top: '10%',
    alignSelf: 'center',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(230, 57, 70, 0.1)',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 20,
  },

  emoji: {
    fontSize: 32,
    marginHorizontal: 10,
  },

  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#E63946',
    letterSpacing: 3,
    textShadowColor: '#E63946',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },

  gameCodeContainer: {
    backgroundColor: 'rgba(230, 57, 70, 0.1)',
    borderWidth: 2,
    borderColor: '#E63946',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },

  gameCodeLabel: {
    fontSize: 14,
    color: '#9AA0A6',
    marginBottom: 8,
    fontWeight: '600',
  },

  gameCode: {
    fontSize: 32,
    fontWeight: '900',
    color: '#E63946',
    letterSpacing: 4,
    marginBottom: 12,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },

  divider: {
    width: 80,
    height: 2,
    backgroundColor: '#E63946',
    alignSelf: 'center',
    marginBottom: 24,
    borderRadius: 2,
  },

  playersSection: {
    flex: 1,
    marginBottom: 20,
  },

  playersTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#b8bdc4',
    letterSpacing: 1,
  },

  playersListContent: {
    paddingBottom: 20,
  },

  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },

  playerEmoji: {
    fontSize: 24,
    marginRight: 12,
  },

  playerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },

  buttonContainer: {
    marginTop: 'auto',
  },

  startButton: {
    backgroundColor: '#E63946',
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#E63946',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },

  startButtonPressed: {
    backgroundColor: '#d32f3c',
    transform: [{ scale: 0.98 }],
  },

  startButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 17,
    letterSpacing: 1.5,
  },

  leaveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
  },

  leaveButtonText: {
    color: '#9AA0A6',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
  },

  buttonDisabled: {
    backgroundColor: '#4a4a4a',
    opacity: 0.5,
    shadowOpacity: 0,
  },

  hostIndicator: {
    textAlign: 'center',
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 12,
  },
})