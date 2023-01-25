import React, { useContext } from 'react'
import { useQueryUser } from '../utils/queries'
import Message from './Message'
// temporary solution
import AuthContext from '../context/AuthContext'

function MessageGroup({messages}) {
    const { user:currentUser } = useContext(AuthContext)
    const messagesToDisplay = messages.map(message => (
        <Message key={message.id} message={message}/>
    ))
    const user = useQueryUser(messages[0].sender)

    if(currentUser.user_id === user.id)
        return (
            <div className='message-wrapper current-user'>
                <div className='message-group'>
                    {messagesToDisplay.reverse()}
                </div>
            </div>
        )
    else
        return (
            <div className='message-wrapper'>
                <img className='chat-profile-pic' src={user.profile_picture}></img>
                <div className='message-group'>
                    {messagesToDisplay.reverse()}
                </div>
            </div>
        )
}

export default MessageGroup