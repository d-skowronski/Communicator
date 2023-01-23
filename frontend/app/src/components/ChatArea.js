import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { getMessagesForRoom } from '../utils/api.js/messages'
import Message from './Message'

function ChatArea({ currentRoom }) {
    const messagesQuery = useQuery({
        queryFn: () => getMessagesForRoom(currentRoom.id),
        queryKey: ['messages', `messages-room-${currentRoom.id}`],
        staleTime: 10000,
    })

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