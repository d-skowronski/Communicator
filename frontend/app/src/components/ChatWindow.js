import React, { useContext } from 'react'
import ChatArea from './ChatArea'
import ChatHeader from './ChatHeader'
import ChatFooter from './ChatFooter'
import '../css/ChatWindow.css'
import useCurrentRoom from '../utils/hooks/currentRoom'
import AuthContext from '../context/AuthContext'

function ChatWindow({mainOnlyDisplayed}) {
    const { user:currentUser } = useContext(AuthContext)
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
    else if(currentRoom === undefined) {
        return (
            <div className='chat-window'>
                <div className='helper-text'>
                    <div className='slogan'>Start chatting!</div>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className='chat-window'>
                <div className='helper-text'>
                    <div className='slogan'>Don't wait, add your first friend</div>
                </div>

            </div>
        )
    }

}

export default ChatWindow