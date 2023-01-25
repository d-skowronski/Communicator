import React from 'react'
import '../css/ChatHeader.css'

function ChatHeader({ currentRoom }) {
    return (
        <header className='chat-header'>
            <img className='room-thumbnail' src={currentRoom.thumbnail} alt=""></img>
            {currentRoom.name}
        </header>
    )
}

export default ChatHeader