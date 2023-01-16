import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'

function ChatPage() {
    const {user, logoutUser} = useContext(AuthContext)
    return (
        <div>
            ChatPage {user.username} {user.profile_picture} {user.email}

            <button onClick={logoutUser}>Logout</button>
        </div>
    )
}

export default ChatPage