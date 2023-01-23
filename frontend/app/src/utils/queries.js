import { useQuery } from "@tanstack/react-query";
import getUsersSharedRooms from './api'

export function allUsersSharedRooms(){
    return useQuery({
        queryFn: getUsersSharedRooms,
        queryKey: ['users', 'users-known'],
        staleTime: Infinity,
    })
}