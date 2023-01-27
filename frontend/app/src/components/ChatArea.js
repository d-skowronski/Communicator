import React, { useEffect, useRef } from 'react'
import { useQueryMessagesForRoom } from '../utils/hooks/queries'
import '../css/ChatArea.css'
import MessageGroup from './MessageGroup'

function ChatArea({ currentRoom }) {
    const messagesQuery = useQueryMessagesForRoom(currentRoom.id)
    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView();
    }, [messagesQuery.data]);

    if(messagesQuery.isLoading) {
        return <div>Loading...</div>
    }
    else if(messagesQuery.isSuccess && messagesQuery.data.count > 0){
        const messages = messagesQuery.data.results
        let messageGroupComponents = []
        let prevMessage = messages[0]
        let messageGroup = []

        for(let i = 0; i < messages.length; i++){
            let currentMessage = messages[i]
            if(prevMessage.sender === currentMessage.sender){
                messageGroup.push(currentMessage)
            }
            else{
                messageGroupComponents.push(<MessageGroup key={i} messages={messageGroup}/>)
                messageGroup = [currentMessage]
            }
            prevMessage = currentMessage
        }
        messageGroupComponents.push(<MessageGroup key={-1} messages={messageGroup}/>)

        return (
            <div className='chat-area'>
                {messageGroupComponents.reverse()}
                <div ref={messagesEndRef} />
            </div>
        )
    }
    else{
        return (
            <div className='chat-area'>
            </div>
        )
    }

}

export default ChatArea