import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'
import '../css/RoomSelect.css'
import '../css/GlobalStyles.css'
import { useQueryUser } from '../utils/hooks/queries'
import { useNavigate } from 'react-router-dom'
import useCurrentRoom from '../utils/hooks/currentRoom'
import { getDisplayDate } from '../utils/helperFunctions'

export default function RoomSelect({room}) {
    const navigate = useNavigate()
    const currentRoom = useCurrentRoom()
    const {user: currentUser} = useContext(AuthContext)
    const lastMessageUser = useQueryUser(room.last_message.sender)

    function handleRoomChange(){
        if(room !== currentRoom){
            navigate(`/communicator/${room.id}`)
        }
    }
    let messageDiv = <div></div>
    if(room.last_message && Object.keys(room.last_message).length > 0){
        const lastMessageRead = room.last_message.read_by.includes(currentUser.user_id)
        const displayName = lastMessageUser.id === currentUser.user_id ? 'You': lastMessageUser.username
        messageDiv =
            <div className={lastMessageRead ? "room-message": "room-message unread"}>
                <div className='text'>{displayName}: {room.last_message.content_text}</div>
                <div className='date-time'>&#x2022; {getDisplayDate(room.last_message.date, false)}</div>
            </div>
    }
    else{
        messageDiv = <div className="room-message">Say hello!</div>
    }

    return (
        <div className='room-select pointer hover' onClick={handleRoomChange}>
            <img className='profile-pic' src={room.thumbnail} alt=""></img>
            <div className="room-info">
                    <div className="room-name">{room.name}</div>
                    {messageDiv}

            </div>
        </div>
    )
}
