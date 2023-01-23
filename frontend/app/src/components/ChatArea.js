import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { getMessagesForRoom } from '../utils/api/messages'
import { useQueryMessagesForRoom } from '../utils/queries'
import Message from './Message'

function ChatArea({ currentRoom }) {
    const messagesQuery = useQueryMessagesForRoom(currentRoom.id)

    if(messagesQuery.isLoading) {
        return <div>Loading...</div>
    }
    if(messagesQuery.isSuccess){
        const messages = messagesQuery.data.results.map(message => (
            <Message key={message.id} message={message} />
        ))

        return (
            <div>{messages}</div>
        )
    }

}

export default ChatArea