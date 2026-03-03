import { StyleSheet, Text, View, Pressable, Animated, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useWebsocket } from '../websocket'

const RevealImposterScreen = ({ route, navigation }) => {
  const { gameId, playerName, playerId, isHost, imposterName, imposterId, winner } = route.params
  
  const [fadeAnim] = useState(new Animated.Value(0))
  const [scaleAnim] = useState(new Animated.Value(0.5))
  const [rotateAnim] = useState(new Animated.Value(0))
  const [revealed, setRevealed] = useState(false)

  // Dramatic reveal animation
  useEffect(() => {
    // Sequence: fade in -> scale up -> rotate -> reveal text
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      })
    ]).start(() => setRevealed(true))
  }, [])

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  })

  const isImposterRevealed = playerId === imposterId
  const didWin = winner === 'crewmates' ? !isImposterRevealed : isImposterRevealed

  const { send } = useWebsocket(gameId, playerName, (msg) => {
    if (msg.event === 'restart_game' || msg.stage === 'waiting_for_players') {
      navigation.replace('LobbyScreen', {
        gameId,
        playerName,
        playerId,
        isHost
      })
    }
  })

  const handlePlayAgain = () => {
    send({ event: 'play_again', playerId })
  }

  const handleEndGame = () => {
    navigation.navigate('HomeScreen')
  }

  return (
    <View style={styles.container}>
      <View style={styles.backgroundGlow} />
      
      {/* Animated Header */}
      <Animated.View style={[
        styles.headerContainer,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
      ]}>
        <Text style={styles.emoji}>🎭</Text>
        <Text style={styles.title}>THE IMPOSTER IS...</Text>
        <Text style={styles.emoji}>🎭</Text>
      </Animated.View>

      <View style={styles.divider} />

      {/* Imposter Reveal Card */}
      <Animated.View style={[
        styles.revealCard,
        { 
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { rotate: spin }
          ]
        }
      ]}>
        <View style={styles.cardInner}>
          <Text style={styles.revealLabel}>🕵️ IMPOSTER REVEALED</Text>
          
          <View style={styles.imposterContainer}>
            <Text style={styles.imposterEmoji}>😈</Text>
            <Text style={styles.imposterName}>{imposterName}</Text>
            <Text style={styles.imposterSubtitle}>was the imposter!</Text>
          </View>

          {revealed && (
            <Animated.View style={[styles.resultBadge, { opacity: fadeAnim }]}>
              <Text style={styles.resultEmoji}>
                {didWin ? '🎉' : '😢'}
              </Text>
              <Text style={[styles.resultText, didWin ? styles.winText : styles.loseText]}>
                {didWin ? 'YOU WON!' : 'YOU LOST!'}
              </Text>
              <Text style={styles.resultSubtext}>
                {winner === 'crewmates' 
                  ? 'The crewmates successfully identified the imposter!' 
                  : 'The imposter fooled everyone!'}
              </Text>
            </Animated.View>
          )}
        </View>
      </Animated.View>

      {/* Score Board */}
      {revealed && (
        <ScrollView style={styles.scoreContainer} contentContainerStyle={styles.scoreContent}>
          <Text style={styles.scoreTitle}>🏆 FINAL SCORES</Text>
          {/* Scores would be passed in params or fetched */}
          <View style={styles.scoreRow}>
            <Text style={styles.scoreName}>Crewmates</Text>
            <Text style={styles.scoreValue}>{winner === 'crewmates' ? 'WIN' : 'LOSS'}</Text>
          </View>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreName}>Imposter ({imposterName})</Text>
            <Text style={styles.scoreValue}>{winner === 'imposter' ? 'WIN' : 'LOSS'}</Text>
          </View>
        </ScrollView>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {isHost ? (
          <Pressable 
            style={({ pressed }) => [
              styles.playAgainButton,
              pressed && styles.buttonPressed
            ]}
            onPress={handlePlayAgain}
          >
            <Text style={styles.playAgainText}>🔄 PLAY AGAIN</Text>
          </Pressable>
        ) : (
          <Text style={styles.waitingText}>⏳ Waiting for host...</Text>
        )}

        <Pressable 
          style={({ pressed }) => [
            styles.endButton,
            pressed && styles.buttonPressed
          ]}
          onPress={handleEndGame}
        >
          <Text style={styles.endButtonText}>🏠 END GAME</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default RevealImposterScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e17',
    padding: 24,
    alignItems: 'center',
  },

  backgroundGlow: {
    position: 'absolute',
    top: '15%',
    alignSelf: 'center',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(230, 57, 70, 0.12)',
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    marginBottom: 20,
  },

  emoji: {
    fontSize: 36,
    marginHorizontal: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#E63946',
    letterSpacing: 2,
    textShadowColor: '#E63946',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },

  divider: {
    width: 100,
    height: 3,
    backgroundColor: '#E63946',
    marginBottom: 30,
    borderRadius: 2,
  },

  revealCard: {
    width: '100%',
    backgroundColor: 'rgba(230, 57, 70, 0.15)',
    borderWidth: 3,
    borderColor: '#E63946',
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    shadowColor: '#E63946',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
  },

  cardInner: {
    alignItems: 'center',
  },

  revealLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#E63946',
    letterSpacing: 3,
    marginBottom: 20,
  },

  imposterContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  imposterEmoji: {
    fontSize: 80,
    marginBottom: 12,
  },

  imposterName: {
    fontSize: 42,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    textShadowColor: '#E63946',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    marginBottom: 8,
  },

  imposterSubtitle: {
    fontSize: 18,
    color: '#9AA0A6',
    fontStyle: 'italic',
  },

  resultBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  resultEmoji: {
    fontSize: 60,
    marginBottom: 12,
  },

  resultText: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 3,
    marginBottom: 8,
  },

  winText: {
    color: '#4ade80',
    textShadowColor: '#4ade80',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },

  loseText: {
    color: '#E63946',
    textShadowColor: '#E63946',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },

  resultSubtext: {
    fontSize: 14,
    color: '#9AA0A6',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  scoreContainer: {
    width: '100%',
    maxHeight: 150,
    marginBottom: 24,
  },

  scoreContent: {
    paddingBottom: 10,
  },

  scoreTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#b8bdc4',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 2,
  },

  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  scoreName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  scoreValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#E63946',
  },

  buttonContainer: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 30,
  },

  playAgainButton: {
    backgroundColor: '#4ade80',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#4ade80',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },

  playAgainText: {
    color: '#0a0e17',
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 2,
  },

  waitingText: {
    color: '#9AA0A6',
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 20,
  },

  endButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 18,
    borderRadius: 16,
  },

  endButtonText: {
    color: '#9AA0A6',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1.5,
  },

  buttonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
})