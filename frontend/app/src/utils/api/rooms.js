import authedAxios from "./authedAxios"

export async function getRooms() {
    const response = await authedAxios.get(`rooms/`)
    return response.data
}

export async function createRoom(usersId) {
    const response = await authedAxios.post(`rooms/`, JSON.stringify({'users_id': usersId}))
}