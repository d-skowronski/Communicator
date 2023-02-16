import React from 'react'
import '../css/RoomSelect.css'
import '../css/GlobalStyles.css'
import { useQueryUser } from '../utils/hooks/queries'
import { useNavigate } from 'react-router-dom'
import useCurrentRoom from '../utils/hooks/currentRoom'

export default function RoomSelect({room}) {
    const navigate = useNavigate()
    const currentRoom = useCurrentRoom()

    const lastMessageUser = useQueryUser(room.last_message.sender)

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
                    {room.last_message && Object.keys(room.last_message).length > 0 ?<div className="room-message">{lastMessageUser.username}: {room.last_message.content_text}</div>:<div className="room-message">Say hello!</div>}

            </div>
        </div>
    )
}
