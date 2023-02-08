import authedAxios from "./authedAxios"

export async function getMessagesForRoom(room_id) {
    const response = await authedAxios.get(`messages/?room_id=${room_id}`)
    return response.data
}

export async function getMessage(message_id) {
    const response = await authedAxios.get(`messages/${message_id}`)
    return response.data
}
