import React, { useContext } from 'react'
import { useQueryMessagesForRoom } from '../utils/hooks/queries'
import '../css/ChatArea.css'
import MessageGroup from './MessageGroup'
import InfiniteScroll from "react-infinite-scroll-component"
import BeatLoader from "react-spinners/BeatLoader"
import { atom } from 'jotai'
import { getDisplayDate } from '../utils/helperFunctions'
import AuthContext from '../context/AuthContext'

function ChatArea({ currentRoom }) {
    const messagesQuery = useQueryMessagesForRoom(currentRoom.id)
    const { user:currentUser } = useContext(AuthContext)

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
        // Manage displaying read_by user only once per chat
        let readByUsersToBeDisplayed = []
        console.log("prev ", readByUsersToBeDisplayed)

        // Time between messages in ms, when new chat group with time header should be created
        const separationTime = 900000
        let addTimeHeader = false

        // Separate messages to groups
        let messageGroupComponents = []
        let prevMessage = messages[0]
        let messageGroup = []

        for(let i = 0; i < messages.length; i++){
            let currentMessage = messages[i]
            currentMessage.readByToDisplay = []

            // Display readBy when user has not been displayed, and user is not currentUser
            for(let j = 0; j < currentMessage.read_by.length; j++){
                let readUser = currentMessage.read_by[j]
                if (readByUsersToBeDisplayed.find(element => element === readUser) === undefined){
                    currentMessage.readByToDisplay.push(readUser)
                    readByUsersToBeDisplayed.push(readUser)
                    console.log("push ", readUser)
                }
            }

            if(Math.abs(new Date(prevMessage.date) - new Date(currentMessage.date)) > separationTime){
                addTimeHeader = true
            }
            else if(prevMessage.sender === currentMessage.sender){

                messageGroup.push(currentMessage)
            }

            if(prevMessage.sender !== currentMessage.sender
                || addTimeHeader){
                messageGroupComponents.push(<MessageGroup
                    key={i}
                    messages={messageGroup}
                    timeSeparated={addTimeHeader}
                />)
                addTimeHeader = false
                messageGroup = [currentMessage]
            }
            prevMessage = currentMessage
        }
        messageGroupComponents.push(<MessageGroup key={-1} messages={messageGroup} timeSeparated={false}/>)
        return (
            <div className='chat-area-wrapper'>
                <div className='scroll-area chat-area' id="chat-area">
                    <InfiniteScroll
                        dataLength={messages.length}
                        next={messagesQuery.fetchNextPage}
                        hasMore={messagesQuery.hasNextPage}
                        inverse={true}
                        style={{ display: 'flex', flexDirection: 'column-reverse' }}
                        scrollableTarget='chat-area'
                        endMessage={<div className='chat-end-message'>Chat created {getDisplayDate(currentRoom.created)}</div>}
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
            <div className='scroll-area'>
            </div>
        )
    }

}

export default ChatArea
export const messageWithVisibleDetails = atom(null)