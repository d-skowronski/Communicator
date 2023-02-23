import authedAxios from "./authedAxios"

export async function getUsersSharedRooms() {
    const response = await authedAxios.get(`users?shared_rooms=true`)
    return response.data
}

export async function getUser(user_id) {
    const response = await authedAxios.get(`users/${user_id}`)
    return response.data
}

export async function findUsers(query) {
    const response = await authedAxios.get(`users/?q=${query}`)
    return response.data
}