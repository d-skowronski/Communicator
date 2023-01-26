import React from 'react'
import '../css/ChatHeader.css'
import "bootstrap-icons/font/bootstrap-icons.css"
import { useNavigate } from 'react-router-dom'


function ChatHeader({ currentRoom, mainOnlyDisplayed}) {
    const navigate = useNavigate()
    return (
        <header className='chat-header'>
            {
                mainOnlyDisplayed &&
                <i className="bi bi-arrow-left" onClick={() => navigate('/communicator/', {replace: true})}></i>
            }
            <img className='room-thumbnail' src={currentRoom.thumbnail} alt=""></img>
            {currentRoom.name}
        </header>
    )
}

export default ChatHeader