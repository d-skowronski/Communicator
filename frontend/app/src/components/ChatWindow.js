import React from 'react'
import ChatArea from './ChatArea'
import ChatHeader from './ChatHeader'
import ChatFooter from './ChatFooter'
import { useAtom } from 'jotai'
import { currentRoomAtom } from '../pages/LoggedInPage'

function ChatWindow() {
    const [currentRoom] = useAtom(currentRoomAtom)
    return (
        <div>
            <ChatHeader currentRoom={currentRoom}/>
            <ChatArea currentRoom={currentRoom}/>
            <ChatFooter currentRoom={currentRoom}/>
        </div>
    )
}

export default ChatWindow