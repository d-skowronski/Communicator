import React from 'react'
import '../css/ChatHeader.css'
import "bootstrap-icons/font/bootstrap-icons.css"
import BackButton from './BackButton'


function ChatHeader({ currentRoom }) {
    return (
        <header className='app-header chat-header'>
            <BackButton/>
            <img className='profile-pic' src={currentRoom.thumbnail} alt=""></img>
            <div className='chat-name'>{currentRoom.name}</div>
        </header>
    )
}

export default ChatHeader