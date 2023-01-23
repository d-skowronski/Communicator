import { useQuery } from "@tanstack/react-query";
import {getRooms} from './api/rooms'
import {getUser} from './api/users'
import { getMessagesForRoom } from "./api/messages";
import {useQueryClient} from '@tanstack/react-query'

export function useQueryMessagesForRoom(room_id) {
    return useQuery({
        queryFn: () => getMessagesForRoom(room_id),
        queryKey: ['messages', `messages-room-${room_id}`],
        staleTime: Infinity,
    })
}

export function useQueryAllRooms(){
    const roomsQuery = useQuery({
        queryFn: getRooms,
        queryKey: ['rooms'],
        staleTime: Infinity,
    })

    return roomsQuery
}
/**
 * Get user while reducing queries to API:
 *
 * Query cache is checked if user is in there,
 * if user is not found it is looked for in each room's users array
 *
 * If user was not found anywhere, request is fetched to API
 *
 * This optimization is possible because /api/rooms returns JSON that has users for each room,
 * @param {int} user_id
 * @returns {Object} user
 */
export function useQueryUser(user_id){

    const queryClient = useQueryClient()

    let user = queryClient.getQueryData(['users', `user-${user_id}`])
    if (!user){
        user = queryClient.getQueryData(['rooms'])?.results.map(room => room.users).flat().find(user => user.id === user_id)
        queryClient.setQueryData(['users', `user-${user_id}`], user)
    }

    const userQuery = useQuery({
        queryFn: () => getUser(user_id),
        queryKey: ['users', `user-${user_id}`],
        staleTime: Infinity,
    })
    return userQuery.data
}

