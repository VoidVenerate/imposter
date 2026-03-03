import axios from "axios";

const api = axios.create({
    baseURL: "https://imposter-s0z9.onrender.com", // Removed trailing space
    headers: {
        "Content-Type": "application/json",
    }
})

export const createGame = async (hostName) => {
    const res = await api.post("/create_game", {
        host_name: hostName,
    })
    console.log('Created game data:', res.data);
    return res.data
}

export const joinGame = async (gameId, playerName) => {
    const res = await api.post("/join_game", {
        game_id: gameId,
        player_name: playerName
    })
    console.log("Joined game data:", res.data);
    return res.data
}

export const submitAnswer = async (gameId, playerId, answer) => {
    console.log("Submitting answer with:", { gameId, playerId, answer });
    
    const res = await api.post(`/games/${gameId}/submit-answer`, {
        player_id: playerId,
        answer: answer
    })

    console.log("Submitted answer response:", res.data)
    return res.data
}

export const startGame = async (gameId) => {
    const res = await api.post(`/start_game/${gameId}`)
    return res.data
}

export const VoteForPlayer = async (gameId, playerId, targetId) => {
    const res = await api.post(`/games/${gameId}/vote/${playerId}/${targetId}`)
    return res.data
}
// api.js - Add these functions
export const restartGame = async (gameId) => {
    const res = await api.post(`/games/${gameId}/restart`)
    console.log("Restart game data:", res.data)
    return res.data
}

export const endGame = async (gameId) => {
    const res = await api.post(`/games/${gameId}/end`)
    console.log("End game data:", res.data)
    return res.data
}