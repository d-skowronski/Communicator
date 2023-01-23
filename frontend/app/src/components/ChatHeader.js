import React from 'react'

function ChatHeader({ currentRoom }) {
    return (
        <div>{currentRoom?.name}</div>
    )
}

export default ChatHeader