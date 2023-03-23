import React, { useContext } from 'react'
import { useQueryUser } from '../utils/hooks/queries'
import Message from './Message'
import '../css/MessageGroup.css'
import '../css/GlobalStyles.css'
// temporary solution
import AuthContext from '../context/AuthContext'
import { getDisplayDate } from '../utils/helperFunctions'

function MessageGroup({messages, timeSeparated}) {
    const { user:currentUser } = useContext(AuthContext)
    const messagesToDisplay = messages.map(message => (
        <Message key={message.id} message={message}/>
    ))
    const user = useQueryUser(messages[0].sender)
    const isCurrentUser = currentUser.user_id === user.id

    return (
        <>
            <div
                className={isCurrentUser ? 'group-wrapper current-user': 'group-wrapper'}
            >
                {!isCurrentUser && <img className='profile-pic' src={user.profile_picture}></img>}
                <div className='message-group'>
                    {messagesToDisplay.reverse()}
                </div>
            </div>
            {timeSeparated && <div className='grayed-text time-separator'>{getDisplayDate(messages[messages.length - 1].date)}</div>}
        </>
    )
}

export default MessageGroup