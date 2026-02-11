import { useRef, useEffect, useState } from 'react';

export const useWebsocket = (gameId, playerName, onmessage) => {
    const websocketRef = useRef(null)
    const [status, setStatus] = useState("Connecting")

    useEffect(() => {
        const ws = new WebSocket(`wss://imposter-s0z9.onrender.com/ws/games/${gameId}/${playerName}`)
        console.log('====================================');
        console.log('socket established');
        console.log('====================================');

        ws.onmessage = (e) => {
            const data = JSON.parse(e.data)
            onmessage(data)
        }

        websocketRef.current = ws

        ws.onopen = () => {
            console.log('Connected')
            setStatus('open')
        }
        ws.onerror = (err) => {
            console.error('WebSocket error', err)
            setStatus('closed')
        }
        ws.onclose = () => {
            console.log('Disconnected')
            setStatus('closed')
        }


        return () => ws.onclose()
    }, [gameId, playerName])

    const send = (msg) => {
        if (websocketRef.current && status === 'open') {
            websocketRef.current.send(JSON.stringify(msg))
        }else {
            console.warn("Websocket cannot send messages", msg)
        }
    }

    return { send, status }
}