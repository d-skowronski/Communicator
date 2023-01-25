import { useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import '../css/RoomSelect.css'
import { useAtom } from 'jotai'
import { handleCurrentRoomAtom } from '../pages/LoggedInPage'
import { useQueryLastMessage, useQueryUser } from '../utils/queries'

export default function RoomSelect({room}) {
    const queryClient = useQueryClient()
    const [,setCurrentRoom] = useAtom(handleCurrentRoomAtom)

    const lastMessage = useQueryLastMessage(room.id)
    // Dependency on lastMessage to lastMessageUser needs to be added
    const lastMessageUser = useQueryUser(lastMessage.sender)
    return (
        <div className='room-select' onClick={() => setCurrentRoom(room)}>
            <img src={room.thumbnail} alt="No image"></img>
            <div className="room-info">
                    <div className="room-name">{room.name}</div>
                    <div className="room-message">{lastMessageUser.username}: {lastMessage.content_text}</div>
            </div>
        </div>
    )
}
