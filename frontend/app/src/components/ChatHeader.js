import React from 'react'
import '../css/ChatHeader.css'
import '../css/GlobalStyles.css'
import "bootstrap-icons/font/bootstrap-icons.css"
import BackButton from './BackButton'


function ChatHeader({ currentRoom }) {
    return (
        <header className='chat-header'>
            <BackButton/>
            <img className='profile-pic' src={currentRoom.thumbnail} alt=""></img>
            <div className='chat-name'>{currentRoom.name}</div>
        </header>
    )
}

export default ChatHeader