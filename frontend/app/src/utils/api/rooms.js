import authedAxios from "./authedAxios"

export async function getRooms() {
    const response = await authedAxios.get(`rooms/`)
    return response.data
}
