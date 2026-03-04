// GameEndScreen.js
import { StyleSheet, Text, View, Pressable, Animated, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { restartGame, endGame } from '../api'

const GameEndScreen = ({ route, navigation }) => {
    const { gameId, playerName, isHost, isImposter, imposterName, winner } = route.params
    
    const [loading, setLoading] = useState(false)
    const [scaleAnim] = useState(new Animated.Value(1))
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

    const handleRestart = async () => {
        if (!isHost) {
            alert("Only the host can restart the game!")
            return
        }
        
        setLoading(true)
        try {
            const data = await restartGame(gameId)
            console.log("Game restarted:", data)
            
            // Navigate back to lobby with new game data
            navigation.replace('LobbyScreen', {
                gameId: data.game_id || gameId,
                playerName: playerName,
                isHost: isHost,
                // Note: backend needs to return player_id in restart response
                // or we need to get it from previous state
            })
        } catch (error) {
            console.error("Restart error:", error.response?.data || error.message)
            alert("Failed to restart game. Please try again.")
            setLoading(false)
        }
    }

    const handleEndGame = async () => {
        if (!isHost) {
            alert("Only the host can end the game!")
            return
        }
        
        setLoading(true)
        try {
            await endGame(gameId)
            console.log("Game ended successfully")
            
            // Navigate back to main menu
            navigation.navigate('Home')
        } catch (error) {
            console.error("End game error:", error.response?.data || error.message)
            alert("Failed to end game. Please try again.")
            setLoading(false)
        }
    }

    const getWinnerText = () => {
        if (winner === 'imposter') {
            return isImposter ? '🎉 You won! The imposter prevails!' : '😞 The imposter won!'
        } else {
            return isImposter ? '😞 You were caught!' : '🎉 The crew won! Imposter exposed!'
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.backgroundGlow} />

            <View style={styles.header}>
                <Text style={styles.emoji}>🏆</Text>
                <Text style={styles.title}>GAME OVER</Text>
                <Text style={styles.emoji}>🏆</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.resultBox}>
                <Text style={styles.resultText}>{getWinnerText()}</Text>
                {imposterName && (
                    <Text style={styles.imposterReveal}>
                        The imposter was: <Text style={styles.imposterName}>{imposterName}</Text>
                    </Text>
                )}
            </View>

            <View style={styles.playersBox}>
                <Text style={styles.playersTitle}>👥 Final Standings</Text>
                {/* You can pass player scores/data via route.params and display here */}
                <Text style={styles.comingSoon}>Scoreboard coming soon...</Text>
            </View>

            <View style={styles.buttonContainer}>
                {isHost ? (
                    <>
                        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                            <Pressable 
                                onPress={handleRestart}
                                disabled={loading}
                                style={({ pressed }) => [
                                    styles.restartButton,
                                    pressed && styles.buttonPressed,
                                    loading && styles.buttonDisabled
                                ]}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#0a0e17" />
                                ) : (
                                    <Text style={styles.restartButtonText}>🔄 RESTART GAME</Text>
                                )}
                            </Pressable>
                        </Animated.View>

                        <Pressable 
                            onPress={handleEndGame}
                            disabled={loading}
                            style={({ pressed }) => [
                                styles.endButton,
                                pressed && styles.buttonPressed,
                                loading && styles.buttonDisabled
                            ]}
                        >
                            <Text style={styles.endButtonText}>🚪 END GAME</Text>
                        </Pressable>
                    </>
                ) : (
                    <View style={styles.waitingBox}>
                        <Text style={styles.waitingText}>
                            ⏳ Waiting for host to decide...
                        </Text>
                        <Text style={styles.waitingSubtext}>
                            The host can restart or end the game
                        </Text>
                    </View>
                )}
            </View>

            <Pressable 
                onPress={() => navigation.navigate('Home')} 
                style={styles.homeButton}
            >
                <Text style={styles.homeButtonText}>← Back to Main Menu</Text>
            </Pressable>
        </View>
    )
}

export default GameEndScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0e17',
        padding: 24,
        justifyContent: 'center',
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
        marginBottom: 20,
    },
    emoji: {
        fontSize: 40,
        marginHorizontal: 12,
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
    divider: {
        width: 80,
        height: 2,
        backgroundColor: '#E63946',
        alignSelf: 'center',
        marginBottom: 32,
        borderRadius: 2,
    },
    resultBox: {
        backgroundColor: 'rgba(230, 57, 70, 0.1)',
        borderWidth: 2,
        borderColor: '#E63946',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        alignItems: 'center',
    },
    resultText: {
        fontSize: 22,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 12,
    },
    imposterReveal: {
        fontSize: 16,
        color: '#9AA0A6',
        textAlign: 'center',
    },
    imposterName: {
        color: '#E63946',
        fontWeight: '800',
    },
    playersBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
        alignItems: 'center',
    },
    playersTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#b8bdc4',
        marginBottom: 12,
    },
    comingSoon: {
        fontSize: 14,
        color: '#6b7280',
        fontStyle: 'italic',
    },
    buttonContainer: {
        gap: 16,
        marginBottom: 24,
    },
    restartButton: {
        backgroundColor: '#4ade80',
        padding: 20,
        borderRadius: 14,
        shadowColor: '#4ade80',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 8,
    },
    restartButtonText: {
        color: '#0a0e17',
        textAlign: 'center',
        fontWeight: '900',
        fontSize: 18,
        letterSpacing: 1.5,
    },
    endButton: {
        backgroundColor: '#E63946',
        padding: 20,
        borderRadius: 14,
        shadowColor: '#E63946',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 8,
    },
    endButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '900',
        fontSize: 18,
        letterSpacing: 1.5,
    },
    buttonPressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.9,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    waitingBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
    },
    waitingText: {
        fontSize: 16,
        color: '#b8bdc4',
        fontWeight: '600',
        marginBottom: 8,
    },
    waitingSubtext: {
        fontSize: 13,
        color: '#6b7280',
        fontStyle: 'italic',
    },
    homeButton: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    homeButtonText: {
        color: '#9AA0A6',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 15,
    },
})