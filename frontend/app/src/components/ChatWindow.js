import React from 'react'
import ChatArea from './ChatArea'
import ChatHeader from './ChatHeader'
import ChatFooter from './ChatFooter'
import '../css/ChatWindow.css'
import useCurrentRoom from '../utils/hooks/currentRoom'

function ChatWindow({mainOnlyDisplayed}) {
    const currentRoom = useCurrentRoom()
    if(currentRoom){
        return (
            <div className='chat-window'>
                <ChatHeader currentRoom={currentRoom} mainOnlyDisplayed={mainOnlyDisplayed}/>
                <ChatArea currentRoom={currentRoom}/>
                <ChatFooter currentRoom={currentRoom}/>
            </div>
        )
    }
    else {
        return <h1>No room to display....</h1>
    }

}

export default ChatWindow