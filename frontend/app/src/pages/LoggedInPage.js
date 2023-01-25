import { useQuery } from '@tanstack/react-query'
import React, { useContext, useEffect, useState } from 'react'
import Main from '../components/Main'
import Sidebar from '../components/Sidebar'
import AuthContext from '../context/AuthContext'
import '../css/LoggedInPage.css'
import { atom, useAtom } from 'jotai'
import { useQueryAllRooms } from '../utils/queries'
import useWebsocket from '../utils/websocket'

function LoggedInPage() {
    const [loading, setLoading] = useState(true)
    const {user, logoutUser, authTokens} = useContext(AuthContext)
    useWebsocket()

    const [,setCurrentRoom] = useAtom(handleCurrentRoomAtom)
    const roomsQuery = useQueryAllRooms()

    if(roomsQuery.isLoading) return <h1>Loading...</h1>
    if(roomsQuery.isSuccess) {
        // On first component load set current room to first one
        if(loading) setLoading((prevLoading) => {
            setCurrentRoom(roomsQuery.data.results[0])
            return !prevLoading
        })
        return (
            <div className='wrapper'>

                <Sidebar/>
                <Main/>
            </div>
        )
    }

}

export default LoggedInPage
export const currentRoomAtom = atom({})
export const handleCurrentRoomAtom = atom(null, (get, set, update) => {
    set(currentRoomAtom, update)
})