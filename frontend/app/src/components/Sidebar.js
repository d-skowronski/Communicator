import React from 'react'
import '../css/Sidebar.css'
import UserBar from './UserBar'
import "bootstrap-icons/font/bootstrap-icons.css"
import RoomList from './RoomList'

function Sidebar({sidebarOnlyDisplayed}) {
  return (
    <div className={sidebarOnlyDisplayed ? 'sidebar full':'sidebar'}>
      <header className='service-name'>
        <i className='bi bi-chat-left-fill logo'></i>
        <div className='service-name'>Communicator</div>
      </header>
      <RoomList/>
      <UserBar/>
    </div>
  )
}

export default Sidebar