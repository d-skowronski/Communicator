import React from 'react'
import '../css/ChatHeader.css'

function ChatHeader({ currentRoom }) {
    return (
        <header className='chat-header'>{currentRoom?.name}</header>
    )
}

export default ChatHeader