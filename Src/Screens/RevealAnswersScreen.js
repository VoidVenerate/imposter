import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'  // Added useEffect
import { VoteForPlayer } from '../api'
import { useWebsocket } from '../websocket'  // Added missing import
import RightDrawer from '../Components/RevealAnswerRightDrawer'

const RevealAnswersScreen = ({ route, navigation }) => {
  // Receive both playerName (for WS) and playerId (for voting)
  const { gameId, playerName, playerId, question, playersAndAnswers: initialData } = route.params

  const [playersAndAnswers, setPlayersAndAnswers] = useState(initialData || [])
  const [currentQuestion, setCurrentQuestion] = useState(question || '')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedVote, setSelectedVote] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [votingError, setVotingError] = useState(null)

  // WebSocket - use playerName for connection
  const { send, status } = useWebsocket(gameId, playerName, (msg) => {
    console.log('REVEAL ANSWERS SERVER MESSAGE', msg)

    // Handle incoming answers data
    if (msg.event === 'reveal_answers' || msg.stage === 'question_reveal') {
      setPlayersAndAnswers(msg.data || msg.players_and_answers || [])
      setCurrentQuestion(msg.question || currentQuestion)
    }

    // Handle game end / imposter reveal
    if (msg.event === 'reveal_imposter' || msg.stage === 'reveal_imposter') {
      navigation.replace('GameEndScreen', {
        gameId,
        playerName,
        playerId,
        isHost: route.params?.isHost
      })
    }
    
    // Handle restart / new round
    if (msg.stage === 'question_answering') {
      navigation.replace('QuestionScreen', {
        gameId,
        playerName,
        playerId,
        question: msg.question,
        isImposter: msg.is_imposter
      })
    }
  })

  const handleVote = async () => {
    if (!selectedVote) return
    setVotingError(null)

    try {
      // Use playerId for API call, not playerName
      await VoteForPlayer(gameId, playerId, selectedVote.id)
      setHasVoted(true)
      setDrawerOpen(false)
      
      // Notify server via WebSocket
      send({ event: 'vote_cast', voter_id: playerId, target_id: selectedVote.id })
    } catch (err) {
      console.error('Vote failed:', err)
      setVotingError('Failed to submit vote. Try again.')
    }
  }

  // Show loading if no data yet
  if (!playersAndAnswers || playersAndAnswers.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Waiting for answers...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.backgroundGlow} />

      <View style={styles.header}>
        <Text style={styles.emoji}>🕵️</Text>
        <Text style={styles.title}>ANSWERS</Text>
        <Text style={styles.emoji}>🕵️</Text>
      </View>
      <View style={styles.divider} />

      <View style={styles.questionBox}>
        <Text style={styles.questionLabel}>THE QUESTION</Text>
        <Text style={styles.questionText}>{currentQuestion}</Text>
      </View>

      <ScrollView
        style={styles.answersList}
        contentContainerStyle={styles.answersContent}
        showsVerticalScrollIndicator={false}
      >
        {playersAndAnswers.map((player, index) => (
          <View key={player.id || index} style={styles.playerCard}>
            <View style={styles.playerCardAccent} />
            <View style={styles.playerCardInner}>
              <Text style={styles.playerCardName}>{player.name}</Text>
              <Text style={styles.playerCardAnswer}>{player.answer}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {!hasVoted ? (
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => setDrawerOpen(true)}
        >
          <Text style={styles.buttonText}>🗳️  VOTE FOR IMPOSTER</Text>
        </Pressable>
      ) : (
        <View style={styles.votedContainer}>
          <Text style={styles.votedEmoji}>✅</Text>
          <Text style={styles.votedText}>
            Vote submitted — waiting for others...
          </Text>

          {/* NEW BUTTON */}
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={() => setDrawerOpen(true)}
          >
            <Text style={styles.buttonText}>🔁 Change Vote</Text>
          </Pressable>
        </View>
      )}

      <RightDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <View style={styles.drawerContainer}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerEmoji}>🎯</Text>
            <Text style={styles.drawerTitle}>VOTE</Text>
            <Text style={styles.drawerEmoji}>🎯</Text>
          </View>
          <View style={styles.drawerDivider} />
          <Text style={styles.drawerSubtitle}>Who do you think is the imposter?</Text>

          {votingError && (
            <Text style={styles.errorText}>{votingError}</Text>
          )}

          <ScrollView style={styles.voteList} showsVerticalScrollIndicator={false}>
            {playersAndAnswers.map((player, index) => {
              const isSelected = selectedVote?.id === player.id
              return (
                <Pressable
                  key={player.id || index}
                  style={({ pressed }) => [
                    styles.voteOption,
                    isSelected && styles.voteOptionSelected,
                    pressed && styles.voteOptionPressed,
                  ]}
                  onPress={() => {setSelectedVote(player); console.log('Selected vote:', player)}}
                >
                  <Text style={styles.voteOptionEmoji}>
                    {isSelected ? '🔴' : '⚪'}
                  </Text>
                  <View style={styles.voteOptionTextGroup}>
                    <Text style={[styles.voteOptionName, isSelected && styles.voteOptionNameSelected]}>
                      {player.name}
                    </Text>
                    <Text style={styles.voteOptionAnswer} numberOfLines={1}>
                      "{player.answer}"
                    </Text>
                  </View>
                </Pressable>
              )
            })}
          </ScrollView>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              !selectedVote && styles.buttonDisabled,
              pressed && selectedVote && styles.buttonPressed,
              styles.drawerButton,
            ]}
            onPress={handleVote}
            disabled={!selectedVote}
          >
            <Text style={styles.buttonText}>
            {selectedVote && selectedVote.name 
                ? `🗳️  VOTE FOR ${selectedVote.name.toUpperCase()}` 
                : 'SELECT A PLAYER'}
            </Text>
          </Pressable>
        </View>
      </RightDrawer>
    </View>
  )
}

export default RevealAnswersScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e17',
    padding: 24,
  },

  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: '#9AA0A6',
    fontSize: 16,
  },

  backgroundGlow: {
    position: 'absolute',
    top: '20%',
    alignSelf: 'center',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(230, 57, 70, 0.08)',
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
    fontSize: 32,
    fontWeight: '900',
    color: '#E63946',
    letterSpacing: 2,
    textShadowColor: '#E63946',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },

  divider: {
    width: 80,
    height: 2,
    backgroundColor: '#E63946',
    alignSelf: 'center',
    marginBottom: 28,
    borderRadius: 2,
  },

  questionBox: {
    backgroundColor: 'rgba(230, 57, 70, 0.1)',
    borderWidth: 2,
    borderColor: '#E63946',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },

  questionLabel: {
    fontSize: 11,
    color: '#9AA0A6',
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  questionText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 30,
    letterSpacing: 0.3,
  },

  answersList: {
    flex: 1,
    marginBottom: 16,
  },

  answersContent: {
    gap: 12,
    paddingBottom: 8,
  },

  playerCard: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(230, 57, 70, 0.25)',
    flexDirection: 'row',
  },

  playerCardAccent: {
    width: 3,
    backgroundColor: '#E63946',
  },

  playerCardInner: {
    flex: 1,
    padding: 16,
  },

  playerCardName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E63946',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },

  playerCardAnswer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.3,
    lineHeight: 22,
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
  },

  buttonDisabled: {
    backgroundColor: '#4a4a4a',
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },

  buttonPressed: {
    backgroundColor: '#d32f3c',
    transform: [{ scale: 0.98 }],
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 1.5,
  },

  votedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(74, 222, 128, 0.4)',
    backgroundColor: 'rgba(74, 222, 128, 0.07)',
  },

  votedEmoji: {
    fontSize: 20,
  },

  votedText: {
    fontSize: 15,
    color: '#4ade80',
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  drawerContainer: {
    flex: 1,
    backgroundColor: '#0a0e17',
    padding: 24,
    paddingTop: 12,
  },

  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 16,
  },

  drawerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#E63946',
    letterSpacing: 2,
    textShadowColor: '#E63946',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
    marginHorizontal: 10,
  },

  drawerEmoji: {
    fontSize: 26,
  },

  drawerDivider: {
    width: 60,
    height: 2,
    backgroundColor: '#E63946',
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 2,
  },

  drawerSubtitle: {
    fontSize: 14,
    color: '#9AA0A6',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.3,
  },

  errorText: {
    color: '#E63946',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.3,
  },

  voteList: {
    flex: 1,
    marginBottom: 16,
  },

  voteOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(230, 57, 70, 0.2)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginBottom: 10,
  },

  voteOptionSelected: {
    borderColor: '#E63946',
    backgroundColor: 'rgba(230, 57, 70, 0.1)',
  },

  voteOptionPressed: {
    transform: [{ scale: 0.98 }],
  },

  voteOptionEmoji: {
    fontSize: 18,
  },

  voteOptionTextGroup: {
    flex: 1,
  },

  voteOptionName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#b8bdc4',
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  voteOptionNameSelected: {
    color: '#E63946',
  },

  voteOptionAnswer: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    letterSpacing: 0.2,
  },

  drawerButton: {
    marginBottom: 16,
  },
})