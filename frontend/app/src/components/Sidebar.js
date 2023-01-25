import React from 'react'
import '../css/Sidebar.css'
import UserBar from './UserBar'
import "bootstrap-icons/font/bootstrap-icons.css"
import RoomList from './RoomList'
import {useQueryClient} from '@tanstack/react-query'


function Sidebar() {
  const queryClient = useQueryClient()

  return (
    <div className='sidebar'>
      <header>
        <i className='bi bi-chat-left-fill logo'></i>
        <div className='service-name'>Communicator</div>
      </header>
      <RoomList/>
      <UserBar/>
    </div>
  )
}

export default Sidebar