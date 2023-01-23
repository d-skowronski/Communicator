import { useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import '../css/RoomSelect.css'
import { useAtom } from 'jotai'
import { currentRoomAtom } from '../pages/LoggedInPage'
import { useQueryUser } from '../utils/queries'

export default function RoomSelect({room}) {
    const queryClient = useQueryClient()
    const [currentRoom, setCurrentRoom] = useAtom(currentRoomAtom)

    const lastMessageUser = useQueryUser(room.last_message.sender)
    return (
        <div className='room-select' onClick={() => setCurrentRoom(room)}>
            <img src={room.thumbnail} alt="No image"></img>
            <div className="room-info">
                    <div className="room-name">{room.name}</div>
                    <div className="room-message">{lastMessageUser.username}: {room.last_message.content_text}</div>
            </div>
        </div>
    )
}
