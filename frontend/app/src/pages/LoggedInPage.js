import { useQuery } from '@tanstack/react-query'
import React, { useContext, useEffect, useState } from 'react'
import Main from '../components/Main'
import Sidebar from '../components/Sidebar'
import AuthContext from '../context/AuthContext'
import '../css/LoggedInPage.css'
import { atom, useAtom } from 'jotai'
import { useQueryAllRooms } from '../utils/queries'

function ChatPage() {
    const {user, logoutUser, authTokens} = useContext(AuthContext)


    const [currentRoom, setCurrentRoom] = useAtom(currentRoomAtom)
    const roomsQuery = useQueryAllRooms()
    if(roomsQuery.isLoading) return <h1>Loading...</h1>
    if(roomsQuery.isSuccess) {
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