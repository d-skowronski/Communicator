import React from 'react'
import ChatArea from '../components/ChatArea'
import ChatHeader from '../components/ChatHeader'
import ChatFooter from '../components/ChatFooter'
import '../css/Chat.css'
import useCurrentRoom from '../utils/hooks/currentRoom'

function Chat() {
    const currentRoom = useCurrentRoom()
    if(currentRoom){
        return (
            <div className='chat'>
                <ChatHeader currentRoom={currentRoom}/>
                <ChatArea currentRoom={currentRoom}/>
                <ChatFooter currentRoom={currentRoom}/>
            </div>
        )
    }
    else if(currentRoom === null) {
        return (
            <div className='chat'>
                <div className='helper-text'>
                    <div className='slogan'>Don't wait, add your first friend</div>
                </div>

            </div>
        )
    }

}

export default Chat