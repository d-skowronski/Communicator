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
    const user = useQueryUser(messages[0].sender)
    const isCurrentUser = currentUser.user_id === user.id
    const messagesToDisplay = messages.map((message, index) => {
        let displayProfilePic = false
        if(index == 0 && !isCurrentUser){
            displayProfilePic = true
        }
        return <Message key={message.id} message={message} senderData={user} displayProfilePic={displayProfilePic}/>
    })


    return (
        <>
            <div
                className={isCurrentUser ? 'message-group current-user': 'message-group'}
            >
                {messagesToDisplay.reverse()}
            </div>
            {timeSeparated && <div className='grayed-text time-separator'>{getDisplayDate(messages[messages.length - 1].date)}</div>}
        </>
    )
}

export default MessageGroup