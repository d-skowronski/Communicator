import React, { useContext, useEffect, useState } from 'react'
import ChatWindow from '../components/ChatWindow'
import Sidebar from '../components/Sidebar'
import AuthContext from '../context/AuthContext'
import '../css/ChatPage.css'

function ChatPage() {
    const {user, logoutUser, authTokens} = useContext(AuthContext)

    return (
        <div className='wrapper'>
            {/* ChatPage {user.username} {user.profile_picture} {user.email}
            <button onClick={logoutUsWer}>Logout</button> */}
            <Sidebar/>
            <ChatWindow/>
        </div>
    )
}

export default ChatPage