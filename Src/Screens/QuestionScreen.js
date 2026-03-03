import { StyleSheet, Text, View, Pressable, TextInput, Animated, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useWebsocket } from '../websocket'
import { submitAnswer } from '../api'

const QuestionScreen = ({ route, navigation }) => {
  const { gameId, playerName, playerId } = route.params

  // Get question and imposter status from WebSocket
  const [question, setQuestion] = useState(null)
  const [isImposter, setIsImposter] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [pulseAnim] = useState(new Animated.Value(1))

  // ------------------- WebSocket -------------------
  const { send } = useWebsocket(gameId, playerName, (msg) => {
    console.log('RAW SERVER MESSAGE:', JSON.stringify(msg, null, 2));

    // Handle game start / question assignment
    if (msg.event === 'game_started' || msg.stage === 'question_answering') {
      console.log('Question data received:', {
        question: msg.question,
        is_imposter: msg.is_imposter,
        data: msg.data
      });
      
      // Try multiple possible locations for the data
      const receivedQuestion = msg.question || msg.data?.question || msg.your_question
      const receivedImposter = msg.is_imposter || msg.data?.is_imposter || msg.isImposter || false
      
      if (receivedQuestion) {
        setQuestion(receivedQuestion)
        setIsImposter(receivedImposter)
        setLoading(false)
      }
    }

    // Navigate to reveal answers
    if (msg.stage === 'question_reveal') {
      navigation.replace('RevealAnswersScreen', {
        gameId,
        playerName,
        playerId,
        question,
        isImposter,
        playersAndAnswers: msg.data || msg.players_and_answers
      })
    }

    // Navigate to end screen if imposter revealed
    if (msg.event === 'reveal_imposter') {
      navigation.replace('GameEndScreen', { gameId, playerName, playerId })
    }
  })

  // ------------------- Pulse Animation -------------------
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

  // ------------------- Submit Answer -------------------
  const handleSubmit = async () => {
    if (!answer.trim()) return
    if (!playerId) return alert('Missing player ID!')

    setSubmitting(true)
    try {
      console.log('Submitting answer', { playerId, answer: answer.trim() })
      await submitAnswer(gameId, playerId, answer.trim())
      setSubmitted(true)
      send({ event: 'answer_submitted', playerId, answer: answer.trim() })
    } catch (err) {
      console.error('Submit failed:', err)
      alert('Failed to submit answer.')
    } finally {
      setSubmitting(false)
    }
  }

  // Show loading until we get the question
  if (loading || !question) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#E63946" />
        <Text style={styles.loadingText}>Getting your question...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.backgroundGlow} />

      <View style={styles.header}>
        <Text style={styles.emoji}>❓</Text>
        <Text style={styles.title}>YOUR QUESTION</Text>
        <Text style={styles.emoji}>❓</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.questionBox}>
        <Text style={styles.questionLabel}>📝 Question</Text>
        <Text style={styles.questionText}>{question}</Text>
        {isImposter && <Text style={styles.imposterTag}>🕵️ You are the IMPOSTER</Text>}
      </View>

      {!submitted ? (
        <>
          <View style={styles.answerSection}>
            <Text style={styles.answerLabel}>✍️ Your Answer</Text>
            <TextInput
              style={styles.input}
              placeholder="Type your answer..."
              placeholderTextColor="#6b7280"
              value={answer}
              onChangeText={setAnswer}
              multiline
              maxLength={100}
            />
          </View>

          <Animated.View style={{ transform: [{ scale: answer.trim() ? pulseAnim : 1 }] }}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                (!answer.trim() || submitting) && styles.buttonDisabled,
                pressed && styles.buttonPressed
              ]}
              onPress={handleSubmit}
              disabled={!answer.trim() || submitting}
            >
              <Text style={styles.buttonText}>
                {submitting ? '⏳ SUBMITTING...' : '🚀 SUBMIT ANSWER 🚀'}
              </Text>
            </Pressable>
          </Animated.View>
        </>
      ) : (
        <View style={styles.submittedContainer}>
          <Text style={styles.submittedEmoji}>✅</Text>
          <Text style={styles.submittedTitle}>Answer Submitted!</Text>
          <Text style={styles.submittedText}>Waiting for others...</Text>
        </View>
      )}
    </View>
  )
}

export default QuestionScreen

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
    marginTop: 16,
  },

  backgroundGlow: {
    position: 'absolute',
    top: '20%',
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
    marginBottom: 32,
    borderRadius: 2,
  },

  questionBox: {
    backgroundColor: 'rgba(230, 57, 70, 0.1)',
    borderWidth: 2,
    borderColor: '#E63946',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
  },

  questionLabel: {
    fontSize: 14,
    color: '#9AA0A6',
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 0.5,
  },

  questionText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 32,
    letterSpacing: 0.5,
  },

  imposterTag: {
    fontSize: 14,
    color: '#E63946',
    fontWeight: '700',
    marginTop: 12,
    textAlign: 'center',
  },

  answerSection: {
    marginBottom: 24,
  },

  answerLabel: {
    fontSize: 16,
    color: '#b8bdc4',
    fontWeight: '600',
    marginBottom: 12,
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
    minHeight: 100,
    textAlignVertical: 'top',
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

  submittedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  submittedEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },

  submittedTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#4ade80',
    marginBottom: 12,
    letterSpacing: 1,
  },

  submittedText: {
    fontSize: 16,
    color: '#9AA0A6',
    textAlign: 'center',
    fontStyle: 'italic',
  },
})