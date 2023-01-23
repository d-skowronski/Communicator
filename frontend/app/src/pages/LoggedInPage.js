import { useQuery } from '@tanstack/react-query'
import React, { useContext, useEffect, useState } from 'react'
import { getRooms } from '../api.js/rooms'
import { getUsersSharedRooms } from '../api.js/users'
import Main from '../components/Main'
import Sidebar from '../components/Sidebar'
import AuthContext from '../context/AuthContext'
import '../css/LoggedInPage.css'
import { atom, useAtom } from 'jotai'

function ChatPage() {
    const {user, logoutUser, authTokens} = useContext(AuthContext)

    const usersQuery = useQuery({
        queryFn: getUsersSharedRooms,
        queryKey: ['users', 'users-known'],
        staleTime: 100000,
    })

    const [currentRoom, setCurrentRoom] = useAtom(currentRoomAtom)
    const roomsQuery = useQuery({
        queryFn: getRooms,
        queryKey: ['rooms'],
        staleTime: 10000,
    })
    if(usersQuery.isLoading || roomsQuery.isLoading) return <h1>Loading...</h1>
    if(usersQuery.isSuccess && roomsQuery.isSuccess) {
        if(currentRoom === undefined){
            setCurrentRoom(roomsQuery.data.results[0])
        }
        return (
            <div className='wrapper'>

                <Sidebar/>
                <Main/>
            </div>
        )
    }

}

export default ChatPage
export const currentRoomAtom = atom()