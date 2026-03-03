import { StyleSheet, Text, View, Pressable, Animated, Dimensions } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'

const { width, height } = Dimensions.get('window')

const PlayOptionsScreen = ({navigation}) => {
  const [selectedOption, setSelectedOption] = useState(null)
  const [scanOffset, setScanOffset] = useState(0)
  
  // Animation refs
  const pulseAnim = useRef(new Animated.Value(1)).current
  const scanAnim = useRef(new Animated.Value(0)).current
  const hostScale = useRef(new Animated.Value(1)).current
  const joinScale = useRef(new Animated.Value(1)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Entry animation
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true
    }).start()

    // Ambient pulse for urgency
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 2000,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true
        })
      ])
    ).start()

    // Scanner line animation
    Animated.loop(
      Animated.timing(scanAnim, {
        toValue: height * 0.6,
        duration: 3000,
        useNativeDriver: true
      })
    ).start()
  }, [])

  const handleHostPress = () => {
    setSelectedOption('host')
    Animated.sequence([
      Animated.timing(hostScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(hostScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start(() => navigation.navigate('CreateGame'))
  }

  const handleJoinPress = () => {
    setSelectedOption('join')
    Animated.sequence([
      Animated.timing(joinScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(joinScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start(() => navigation.navigate('JoinGame'))
  }

  return (
    <View style={styles.container}>
      {/* CRT Scanline Overlay */}
      <Animated.View 
        style={[
          styles.scanline,
          { transform: [{ translateY: scanAnim }] }
        ]} 
      />
      
      {/* Vignette */}
      <View style={styles.vignette} />
      
      {/* Tactical Grid */}
      <View style={styles.grid} />

      {/* Header Section */}
      <Animated.View style={[styles.headerContainer, { opacity: opacityAnim }]}>
        <View style={styles.classifiedBadge}>
          <Text style={styles.classifiedText}>SECURE CONNECTION</Text>
          <View style={styles.statusDot} />
        </View>

        <View style={styles.titleWrapper}>
          <Text style={styles.titleIcon}>⚠️</Text>
          <Text style={styles.title}>SELECT PROTOCOL</Text>
          <Text style={styles.titleIcon}>⚠️</Text>
        </View>

        <Text style={styles.subtitle}>
          <Text style={styles.redacted}>████</Text> CHOOSE YOUR ROLE{' '}
          <Text style={styles.redacted}>████</Text>
        </Text>

        {/* Security Level Indicator */}
        <View style={styles.securityBar}>
          <Text style={styles.securityLabel}>SECURITY LEVEL: MAXIMUM</Text>
          <View style={styles.securityTrack}>
            <Animated.View 
              style={[
                styles.securityFill,
                {
                  width: pulseAnim.interpolate({
                    inputRange: [1, 1.03],
                    outputRange: ['85%', '100%']
                  })
                }
              ]} 
            />
          </View>
        </View>
      </Animated.View>

      {/* Main Options */}
      <View style={styles.optionsContainer}>
        {/* Host Game Option */}
        <Animated.View 
          style={[
            styles.optionCard,
            { 
              transform: [
                { scale: hostScale },
                { scale: selectedOption === 'host' ? pulseAnim : 1 }
              ],
              opacity: opacityAnim
            }
          ]}
        >
          <Pressable 
            style={({ pressed }) => [
              styles.cardInner,
              styles.hostCard,
              pressed && styles.cardPressed
            ]}
            onPress={handleHostPress}
          >
            <View style={styles.cardGlow} />
            
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Text style={styles.cardIcon}>👑</Text>
                <View style={styles.pingIndicator} />
              </View>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>COMMAND</Text>
              </View>
            </View>

            <Text style={styles.cardTitle}>INITIATE MISSION</Text>
            <Text style={styles.cardSubtitle}>Create secure lobby</Text>

            <View style={styles.cardDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>CONTROL:</Text>
                <Text style={styles.detailValue}>FULL</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>ACCESS:</Text>
                <Text style={styles.detailValue}>ADMIN</Text>
              </View>
            </View>

            <View style={styles.selectBar}>
              <Text style={styles.selectText}>► SELECT</Text>
            </View>
          </Pressable>
        </Animated.View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Join Game Option */}
        <Animated.View 
          style={[
            styles.optionCard,
            { 
              transform: [
                { scale: joinScale },
                { scale: selectedOption === 'join' ? pulseAnim : 1 }
              ],
              opacity: opacityAnim,
              animationDelay: '200ms'
            }
          ]}
        >
          <Pressable 
            style={({ pressed }) => [
              styles.cardInner,
              styles.joinCard,
              pressed && styles.cardPressed
            ]}
            onPress={handleJoinPress}
          >
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Text style={styles.cardIcon}>🔑</Text>
                <View style={[styles.pingIndicator, styles.pingSlow]} />
              </View>
              <View style={[styles.roleBadge, styles.roleBadgeSecondary]}>
                <Text style={[styles.roleText, styles.roleTextSecondary]}>INFILTRATE</Text>
              </View>
            </View>

            <Text style={[styles.cardTitle, styles.cardTitleSecondary]}>JOIN OPERATION</Text>
            <Text style={[styles.cardSubtitle, styles.cardSubtitleSecondary]}>Enter access code</Text>

            <View style={styles.cardDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>CONTROL:</Text>
                <Text style={[styles.detailValue, styles.detailValueSecondary]}>LIMITED</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>ACCESS:</Text>
                <Text style={[styles.detailValue, styles.detailValueSecondary]}>GUEST</Text>
              </View>
            </View>

            <View style={[styles.selectBar, styles.selectBarSecondary]}>
              <Text style={[styles.selectText, styles.selectTextSecondary]}>► SELECT</Text>
            </View>
          </Pressable>
        </Animated.View>
      </View>

      {/* Footer Controls */}
      <Animated.View style={[styles.footer, { opacity: opacityAnim }]}>
        <Pressable 
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>ABORT / RETURN</Text>
        </Pressable>

        <View style={styles.tipContainer}>
          <Text style={styles.tipIcon}>ℹ️</Text>
          <Text style={styles.tipText}>
            Hosts maintain tactical advantage and settings control
          </Text>
        </View>
      </Animated.View>

      {/* Corner Decorations */}
      <View style={[styles.corner, styles.cornerTL]} />
      <View style={[styles.corner, styles.cornerTR]} />
      <View style={[styles.corner, styles.cornerBL]} />
      <View style={[styles.corner, styles.cornerBR]} />
    </View>
  )
}

export default PlayOptionsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },

  // Effects
  scanline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 68, 68, 0.3)',
    zIndex: 100,
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.8,
  },

  vignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'radial-gradient(circle, transparent 30%, #000 100%)',
    opacity: 0.9,
    zIndex: 1,
  },

  grid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.02,
    backgroundImage: `
      linear-gradient(rgba(255, 68, 68, 0.5) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 68, 68, 0.5) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
  },

  // Header
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
    zIndex: 10,
  },

  classifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 20,
    gap: 8,
  },

  classifiedText: {
    color: '#00ff00',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00ff00',
    shadowColor: '#00ff00',
    shadowRadius: 4,
    shadowOpacity: 1,
  },

  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },

  titleIcon: {
    fontSize: 24,
    opacity: 0.8,
  },

  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 4,
    textShadowColor: '#ff4444',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
    letterSpacing: 2,
    marginBottom: 20,
    fontWeight: '700',
  },

  redacted: {
    backgroundColor: '#333',
    color: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },

  securityBar: {
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
  },

  securityLabel: {
    color: '#ff4444',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 6,
    fontFamily: 'monospace',
  },

  securityTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },

  securityFill: {
    height: '100%',
    backgroundColor: '#ff4444',
    shadowColor: '#ff0000',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.8,
  },

  // Options
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
    zIndex: 10,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },

  optionCard: {
    width: '100%',
  },

  cardInner: {
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },

  hostCard: {
    borderColor: '#ff4444',
    shadowColor: '#ff0000',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    shadowOpacity: 0.3,
  },

  joinCard: {
    borderColor: '#444',
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
  },

  cardPressed: {
    transform: [{ scale: 0.98 }],
    borderColor: '#ff6666',
  },

  cardGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
    borderRadius: 50,
    blur: 40,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  iconContainer: {
    position: 'relative',
  },

  cardIcon: {
    fontSize: 32,
  },

  pingIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00ff00',
    shadowColor: '#00ff00',
    shadowRadius: 6,
    shadowOpacity: 1,
  },

  pingSlow: {
    backgroundColor: '#ffaa00',
    shadowColor: '#ffaa00',
    opacity: 0.7,
  },

  roleBadge: {
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: '#ff4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    transform: [{ skewX: '-10deg' }],
  },

  roleBadgeSecondary: {
    backgroundColor: 'rgba(100, 100, 100, 0.2)',
    borderColor: '#666',
  },

  roleText: {
    color: '#ff4444',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    transform: [{ skewX: '10deg' }],
  },

  roleTextSecondary: {
    color: '#888',
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 4,
  },

  cardTitleSecondary: {
    color: '#ccc',
  },

  cardSubtitle: {
    fontSize: 13,
    color: '#ff4444',
    opacity: 0.8,
    marginBottom: 16,
    letterSpacing: 1,
  },

  cardSubtitleSecondary: {
    color: '#666',
  },

  cardDetails: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 12,
    marginBottom: 16,
    gap: 8,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  detailLabel: {
    color: '#666',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: 'monospace',
  },

  detailValue: {
    color: '#ff4444',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    fontFamily: 'monospace',
  },

  detailValueSecondary: {
    color: '#888',
  },

  selectBar: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.5)',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  selectBarSecondary: {
    backgroundColor: 'rgba(100, 100, 100, 0.1)',
    borderColor: 'rgba(100, 100, 100, 0.5)',
  },

  selectText: {
    color: '#ff4444',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 3,
  },

  selectTextSecondary: {
    color: '#888',
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    opacity: 0.5,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },

  dividerText: {
    color: '#444',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },

  // Footer
  footer: {
    marginTop: 20,
    alignItems: 'center',
    gap: 16,
    zIndex: 10,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  backButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  backIcon: {
    color: '#666',
    fontSize: 16,
  },

  backText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },

  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    opacity: 0.6,
  },

  tipIcon: {
    fontSize: 12,
  },

  tipText: {
    color: '#444',
    fontSize: 11,
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },

  // Corner Decorations
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#ff4444',
    zIndex: 5,
    opacity: 0.5,
  },

  cornerTL: {
    top: 20,
    left: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },

  cornerTR: {
    top: 20,
    right: 20,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },

  cornerBL: {
    bottom: 20,
    left: 20,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },

  cornerBR: {
    bottom: 20,
    right: 20,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
})