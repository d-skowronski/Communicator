import { useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { getMessage } from '../api.js/messages'
import { getUsersSharedRooms } from '../api.js/users'
import '../css/RoomSelect.css'
import { useAtom } from 'jotai'
import { currentRoomAtom } from '../pages/LoggedInPage'

export default function RoomSelect(props) {
    const queryClient = useQueryClient()
    const [currentRoom, setCurrentRoom] = useAtom(currentRoomAtom)

    const messageQuery = useQuery({
        queryKey: ['messages', `messages-room-${props.room.id}`, `messages-${props.room.last_message}`],
        queryFn: () => getMessage(props.room.last_message),
        staleTime: 1000000,
    })

    const UsersQuery = useQuery({
        queryFn: getUsersSharedRooms,
        queryKey: ['users', 'users-known'],
        staleTime: 2000
    })

    let message = ""
    if(messageQuery.isLoading){
        message = "loading....."
    }
    if(messageQuery.isSuccess){

        const recivedMessage = messageQuery.data
        const sender = UsersQuery.data.results.filter(d => d.id === recivedMessage.sender)[0]
        message = `${sender.username}: ${recivedMessage.content_text}`
    }

    return (
        <div className='room-select' onClick={() => setCurrentRoom(props.room)}>
            <img src={props.room.thumbnail} alt="No image"></img>
            <div className="room-info">
                    <div className="room-name">{props.room.name}</div>
                    <div className="room-message">{message}</div>
            </div>`
        </div>
    )
}
