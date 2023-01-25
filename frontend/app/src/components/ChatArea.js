import React from 'react'
import { useQueryMessagesForRoom } from '../utils/queries'
import Message from './Message'
import MessageGroup from './MessageGroup'

function ChatArea({ currentRoom }) {
    const messagesQuery = useQueryMessagesForRoom(currentRoom.id)

    if(messagesQuery.isLoading) {
        return <div>Loading...</div>
    }
    if(messagesQuery.isSuccess){
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

        // const messages = messagesQuery.data.results.map(message => (
        //     <Message key={message.id} message={message} />
        // ))
        return (
            <div className='chat-area'>{messageGroupComponents.reverse()}</div>
        )
    }

}

export default ChatArea