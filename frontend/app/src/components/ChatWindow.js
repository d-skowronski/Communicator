import React from 'react'
import ChatArea from './ChatArea'
import ChatHeader from './ChatHeader'
import ChatFooter from './ChatFooter'
import { useAtom } from 'jotai'
import { currentRoomAtom } from '../pages/LoggedInPage'
import '../css/ChatWindow.css'

function ChatWindow() {
    const [currentRoom] = useAtom(currentRoomAtom)
    return (
        <div className='chat-window'>
            <ChatHeader currentRoom={currentRoom}/>
            <ChatArea currentRoom={currentRoom}/>
            <ChatFooter currentRoom={currentRoom}/>
        </div>
    )
}

export default ChatWindow