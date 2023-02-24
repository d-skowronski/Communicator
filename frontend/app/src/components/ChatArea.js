import React from 'react'
import { useQueryMessagesForRoom } from '../utils/hooks/queries'
import '../css/ChatArea.css'
import MessageGroup from './MessageGroup'
import InfiniteScroll from "react-infinite-scroll-component"
import BeatLoader from "react-spinners/BeatLoader"
import { atom } from 'jotai'

function ChatArea({ currentRoom }) {
    const messagesQuery = useQueryMessagesForRoom(currentRoom.id)

    let messages = []
    if(messagesQuery.isSuccess) {
        for(let i = 0; i < messagesQuery.data.pages.length; i++) {
            messages.push(...messagesQuery.data.pages[i].results)
        }
    }

    if(messagesQuery.isLoading) {
        return (
        <div className='chat-area-wrapper'>
            <div className='chat-area' id="chat-area">
                <BeatLoader
                    color="#f19c2b"
                    size={20}
                    cssOverride={{display: 'flex', justifyContent: 'center', marginTop: '1rem'}}
                />
            </div>
        </div>
        )
    }
    else if(messages.length > 0){
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
            <div className='chat-area-wrapper'>
                <div className='chat-area' id="chat-area">
                    <InfiniteScroll
                        dataLength={messages.length}
                        next={messagesQuery.fetchNextPage}
                        hasMore={messagesQuery.hasNextPage}
                        inverse={true}
                        style={{ display: 'flex', flexDirection: 'column-reverse' }}
                        scrollableTarget='chat-area'
                        endMessage={<div className='chat-end-message'>Chat created at {new Date(currentRoom.created).toDateString()}</div>}
                        loader={
                            <BeatLoader
                                color="#f19c2b"
                                size={20}
                                cssOverride={{display: 'flex', justifyContent: 'center', marginTop: '1rem'}}
                            />}
                    >
                        {messageGroupComponents}

                    </InfiniteScroll>
                </div>
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
export const messageWithVisibleDetails = atom(null)