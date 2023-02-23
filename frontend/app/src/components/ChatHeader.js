import React from 'react'
import '../css/ChatHeader.css'
import '../css/GlobalStyles.css'
import "bootstrap-icons/font/bootstrap-icons.css"
import { useNavigate, useOutletContext } from 'react-router-dom'


function ChatHeader({ currentRoom }) {
    const navigate = useNavigate()
    const {sidebarVisible} = useOutletContext()

    return (
        <header className='chat-header'>
            {
                !sidebarVisible &&
                <i className="bi bi-arrow-left" onClick={() => navigate('/communicator/', {replace: true})}></i>
            }
            <img className='profile-pic' src={currentRoom.thumbnail} alt=""></img>
            <div className='chat-name'>{currentRoom.name}</div>
        </header>
    )
}

export default ChatHeader