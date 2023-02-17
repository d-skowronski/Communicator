import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {createRoom, getRooms} from '../api/rooms'
import {findUsers, getUser} from '../api/users'
import { getMessagesForRoom } from "../api/messages";
import {useQueryClient} from '@tanstack/react-query'

export function useQueryMessagesForRoom(roomId, isEnabled = true) {
    const query = useInfiniteQuery({
        queryFn: ({pageParam = ''}) => getMessagesForRoom(roomId, pageParam),
        queryKey: ['messages', `messages-room-${roomId}`],
        staleTime: Infinity,
        enabled: isEnabled,
        getNextPageParam: (lastPage) => {
            if(lastPage.next){
                let splittedLink = lastPage.next?.split('/')
                let params = splittedLink[splittedLink.length - 1]
                return params
            }
            return undefined
        },
    })
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

export function useQueryFindUsers(queryStr, isEnabled=true) {
    const usersQuery = useQuery({
        queryFn: () => findUsers(queryStr),
        queryKey: ['user-query', `user-query-${queryStr}`],
        staleTime: 60 * 1000 * 10,
        enabled: isEnabled
    })

    return usersQuery
}

export function useMutationCreateRoom() {
    const queryClient = useQueryClient()
    const roomsMutation = useMutation({
        mutationFn: createRoom,
        onSuccess: () => {
            queryClient.invalidateQueries(['user-query'])
            // queryClient.invalidateQueries(['rooms']) at websocket when room_created message received
        }
    })

    return roomsMutation
}