import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import '../css/Sidebar.css'
import UserBar from './UserBar'
import "bootstrap-icons/font/bootstrap-icons.css"

function Sidebar() {
  const {user, logoutUser} = useContext(AuthContext)
  return (
    <div className='sidebar'>
      <header>
        <i className='bi bi-chat-left-fill logo'></i>
        <div className='service-name'>Communicator</div>
      </header>
      <div className='contact-list'>
        test
      </div>
      <UserBar/>
    </div>
  )
}

export default Sidebar