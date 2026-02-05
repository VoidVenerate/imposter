import axios from "axios";

const api = axios.create ({
    baseURL: "https://imposter-s0z9.onrender.com/docs",
    headers: {
        "Content-Type": "application-json",
    }
})

export const createGame = async (hostName) =>{
    const res = await api.post("/create-game", {
        host_name: hostName,
    })
    return res.data
}

export const joinGame = async (gameId, playerName) => {
    const res = await api.post("/join-game", {
        game_id: gameId,
        player_name: playerName
    })

    return res.data
}

export const startGame = async (gameId) => {
    const res = await api.post(`/start-game/${gameId}`)

    return res.data
}