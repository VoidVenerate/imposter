import { useRef, useEffect, useState } from 'react';

export const useWebsocket = (gameId, playerName, onmessage) => {
  const websocketRef = useRef(null)
  const messageHandlerRef = useRef(onmessage)
  const [status, setStatus] = useState("connecting")

  // Always keep latest onmessage
  useEffect(() => {
    messageHandlerRef.current = onmessage
  }, [onmessage])

  useEffect(() => {
    const ws = new WebSocket(
      `wss://imposter-s0z9.onrender.com/ws/games/${gameId}/${playerName}`
    )

    console.log('WebSocket connecting...')

    ws.onopen = () => {
      console.log('Connected')
      setStatus('open')
    }

    ws.onmessage = (e) => {
      console.log('RAW STRING:', e.data); // Log raw before any parsing
      
      let parsedData
      try {
        parsedData = JSON.parse(e.data)
        
        // Log all possible locations of question
        console.log('Possible question locations:', {
          'parsedData.question': parsedData.question,
          'parsedData.data?.question': parsedData.data?.question,
          'parsedData.data?.data?.question': parsedData.data?.data?.question,
          'full parsedData': parsedData
        });
        
        // Your existing unwrap logic...
        if (parsedData.data && typeof parsedData.data === 'string') {
          parsedData = JSON.parse(parsedData.data)
        } else if (parsedData.data && typeof parsedData.data === 'object') {
          parsedData = parsedData.data
        }
        
      } catch (err) {
        console.error("WS Parse Error:", err)
        return
      }

      messageHandlerRef.current?.(parsedData)
    }

    ws.onerror = (err) => {
      console.error('WebSocket error', err)
      setStatus('closed')
    }

    ws.onclose = () => {
      console.log('Disconnected')
      setStatus('closed')
    }

    websocketRef.current = ws

    return () => ws.close()
  }, [gameId, playerName])

  const send = (msg) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify(msg))
    } else {
      console.warn("WebSocket not ready:", msg)
    }
  }

  return { send, status }
}