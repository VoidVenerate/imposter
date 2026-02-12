import { useRef, useEffect, useState } from 'react';

export const useWebsocket = (gameId, playerName, onmessage) => {
  const websocketRef = useRef(null)
  const [status, setStatus] = useState("connecting")

  useEffect(() => {
    const ws = new WebSocket(`wss://imposter-s0z9.onrender.com/ws/games/${gameId}/${playerName}`)
    console.log('WebSocket connecting...')

    ws.onopen = () => {
      console.log('Connected')
      setStatus('open')
    }

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data)
      onmessage(data)
      console.log("CURRENT_STATE RECEIVED:", data)

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
    if (websocketRef.current && status === 'open') {
      websocketRef.current.send(JSON.stringify(msg))
    } else {
      console.warn("WebSocket cannot send message", msg)
    }
  }

  return { send, status }
}
