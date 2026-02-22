import axios from "axios";

const api = axios.create ({
    baseURL: "https://imposter-s0z9.onrender.com",
    headers: {
        "Content-Type": "application/json",
    }
})

export const createGame = async (hostName) =>{
    const res = await api.post("/create_game", {
        host_name: hostName,
    })
    console.log('====================================');
    console.log('Created game data:', res.data);
    console.log('====================================');
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

export const startGame = async (gameId) => {
    const res = await api.post(`/start_game/${gameId}`)

    return res.data
}


export const VoteForPlayer = async (gameId, playerId, targetId) => {
    const res = await api.post(`/games/${gameId}/vote/${playerId}/${targetId}`, {
        game_id: gameId,
        player_id: playerId,
        target_id: targetId
    })
    console.log("Voted player data:", res.data);

    return res.data
}