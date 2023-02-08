import { useQuery } from "@tanstack/react-query";
import {getRooms} from '../api/rooms'
import {getUser} from '../api/users'
import { getMessagesForRoom } from "../api/messages";
import {useQueryClient} from '@tanstack/react-query'
import { useState } from "react";

/**
 * Check if any messages for a room
 * If not found check in room's field last_message and use as initialData
 * useQuery that subscribes to room's messsages, and if no messages there,
 * use initial data from
 * @param {int} room_id
 * @returns {Object} message
 */


export function useQueryLastMessage(room_id) {
    const queryClient = useQueryClient()

    let message = {}
    if (queryClient.getQueryData(['messages', `messages-room-${room_id}`])?.results === undefined){
        message = queryClient.getQueryData(['rooms'])?.results?.find(room => room.id === room_id)?.last_message
    }

    const userQuery = useQuery({
        queryFn: () => getMessagesForRoom(room_id),
        queryKey: ['messages', `messages-room-${room_id}`],
        staleTime: Infinity,
        initialData: {results: [message]},
    })
    return userQuery.data.results[0]
}

export function useQueryMessagesForRoom(room_id) {
    const queryClient = useQueryClient()

    // 30 is number of messages received from API on each page
    // This will need to be reworked to keep track of received messages
    // when infinite scroll will be implemented and next page will need to be determined
    const [en, setEn] = useState(true)
    if(queryClient.getQueryData(['messages', `messages-room-${room_id}`])?.results?.length < 30){
        queryClient.invalidateQueries(['messages', `messages-room-${room_id}`])
        if(en){
            setEn(false)
        }
    }

    const query = useQuery({
        queryFn: () => getMessagesForRoom(room_id),
        queryKey: ['messages', `messages-room-${room_id}`],
        staleTime: Infinity,
    }, {enabled: en})
    return query
}

export function useQueryAllRooms(){
    const roomsQuery = useQuery({
        queryFn: () => getRooms(),
        queryKey: ['rooms'],
        staleTime: Infinity,
        retry: false
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
        enabled: !isNaN(user_id)
    })
    if(userQuery.data){
        return userQuery.data
    }
    else{
        return {}
    }
}

