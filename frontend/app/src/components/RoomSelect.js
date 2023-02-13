import React from 'react'
import '../css/RoomSelect.css'
import '../css/GlobalStyles.css'
import { useQueryLastMessage, useQueryUser } from '../utils/hooks/queries'
import { useNavigate } from 'react-router-dom'
import useCurrentRoom from '../utils/hooks/currentRoom'

export default function RoomSelect({room}) {
    const navigate = useNavigate()
    const currentRoom = useCurrentRoom()

    const lastMessage = useQueryLastMessage(room.id)
    // Dependency on lastMessage to lastMessageUser needs to be added
    const lastMessageUser = useQueryUser(lastMessage?.sender)

    function handleRoomChange(){
        if(room !== currentRoom){
            navigate(`/communicator/${room.id}`)
        }
    }
    return (
        <div className='room-select pointer hover' onClick={handleRoomChange}>
            <img className='profile-pic' src={room.thumbnail} alt=""></img>
            <div className="room-info">
                    <div className="room-name">{room.name}</div>
                    {lastMessage && Object.keys(lastMessage).length > 0 ?<div className="room-message">{lastMessageUser.username}: {lastMessage.content_text}</div>:<div className="room-message">Say hello!</div>}

            </div>
        </div>
    )
}
