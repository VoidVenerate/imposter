import { StyleSheet, Text, View, Pressable, TextInput, ActivityIndicator, Animated } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useWebsocket } from '../websocket'

const QuestionScreen = ({route, navigation}) => {

    const {gameId, playerName, question, isImposter, playerId} = route.params

    const [answer, setAnswer] = useState("")
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [pulseAnim] = useState(new Animated.Value(1))

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

    const { send } = useWebsocket(gameId, playerName,(msg) => {
        console.log("QUESTION SCREEN MESSAGE:", msg)

        if (msg.event === 'reveal_answers') {
            navigation.replace('RevealScreen', {
                gameId,
                playerName,
                question,
                answer,
            })
        }
    })

    const handleSubmit = () => {
        if (!answer.trim()) return

        send({
            event: "submit_answer",
            answer: answer.trim()
        })

        setSubmitted(true)
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <View style={styles.backgroundGlow} />
                
                <View style={styles.loadingContent}>
                    <Text style={styles.loadingEmoji}>🎲</Text>
                    <ActivityIndicator size="large" color="#E63946" />
                    <Text style={styles.loadingText}>Preparing your question...</Text>
                    <Text style={styles.loadingHint}>Get ready to answer!</Text>
                </View>
            </View>
        )
    }
    
    return (
        <View style={styles.container}>
            {/* Background glow effect */}
            <View style={styles.backgroundGlow} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.emoji}>❓</Text>
                <Text style={styles.title}>YOUR QUESTION</Text>
                <Text style={styles.emoji}>❓</Text>
            </View>

            {/* Decorative divider */}
            <View style={styles.divider} />

            {/* Question Box */}
            <View style={styles.questionBox}>
                <Text style={styles.questionLabel}>📝 Question</Text>
                <Text style={styles.questionText}>{question}</Text>
            </View>

            {!submitted ? (
                <>
                    {/* Answer Input */}
                    <View style={styles.answerSection}>
                        <Text style={styles.answerLabel}>✍️ Your Answer</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Type your answer here..."
                            placeholderTextColor="#6b7280"
                            value={answer}
                            onChangeText={setAnswer}
                            multiline
                            maxLength={100}
                        />
                        {answer.length > 0 && (
                            <Text style={styles.charCount}>{answer.length}/100</Text>
                        )}
                    </View>

                    {/* Submit Button */}
                    <Animated.View style={{ transform: [{ scale: answer.trim() ? pulseAnim : 1 }] }}>
                        <Pressable 
                            style={({ pressed }) => [
                                styles.button,
                                !answer.trim() && styles.buttonDisabled,
                                pressed && styles.buttonPressed
                            ]} 
                            onPress={handleSubmit}
                            disabled={!answer.trim()}
                        >
                            <Text style={styles.buttonText}>
                                {answer.trim() ? '🚀 SUBMIT ANSWER 🚀' : '⚠️ TYPE AN ANSWER FIRST'}
                            </Text>
                        </Pressable>
                    </Animated.View>
                </>
            ) : (
                <View style={styles.submittedContainer}>
                    <Text style={styles.submittedEmoji}>✅</Text>
                    <Text style={styles.submittedTitle}>Answer Submitted!</Text>
                    <Text style={styles.submittedText}>
                        Waiting for other players to finish...
                    </Text>
                    
                    <View style={styles.submittedAnswerBox}>
                        <Text style={styles.submittedAnswerLabel}>Your answer:</Text>
                        <Text style={styles.submittedAnswerText}>{answer}</Text>
                    </View>
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

    loadingContainer: {
        flex: 1,
        backgroundColor: '#0a0e17',
        justifyContent: 'center',
        alignItems: 'center',
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

    loadingContent: {
        alignItems: 'center',
        gap: 16,
    },

    loadingEmoji: {
        fontSize: 64,
        marginBottom: 8,
    },

    loadingText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#E63946',
        marginTop: 16,
        letterSpacing: 1,
    },

    loadingHint: {
        fontSize: 14,
        color: '#9AA0A6',
        fontStyle: 'italic',
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

    charCount: {
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'right',
        marginTop: 8,
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
        marginBottom: 32,
    },

    submittedAnswerBox: {
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
        borderWidth: 2,
        borderColor: '#4ade80',
        borderRadius: 12,
        padding: 20,
        width: '100%',
    },

    submittedAnswerLabel: {
        fontSize: 12,
        color: '#9AA0A6',
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    submittedAnswerText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '700',
        letterSpacing: 0.5,
    },
})