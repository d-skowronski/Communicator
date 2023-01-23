import React from 'react'
import '../css/Sidebar.css'
import UserBar from './UserBar'
import "bootstrap-icons/font/bootstrap-icons.css"
import RoomList from './RoomList'
import {useQueryClient} from '@tanstack/react-query'


function Sidebar() {
  const queryClient = useQueryClient()
  function inval() {
    queryClient.invalidateQueries(['rooms'])
  }
  function updateQuery() {
    const new_room = {
      "id": 40,
      "information_type": "chat_room",
      "name": "newUser",
      "thumbnail": "http://127.0.0.1:8000/media/noimage.png",
      "last_message": {
        "id": 373,
        "information_type": "chat_message",
        "room": 3,
        "content_text": "g",
        "sender": 2,
        "read_by": [
          1,
          2
        ]
      },
      "users": [
        {
          "id": 1,
          "username": "dskwr",
          "profile_picture": "http://127.0.0.1:8000/media/profile_pictures/pexels-photo-3371359.jpeg"
        },
        {
          "id": 2,
          "username": "newUser",
          "profile_picture": "http://127.0.0.1:8000/media/noimage.png"
        }
      ]
    }

    queryClient.setQueryData(['rooms'], (old) => {
      console.log(old)
      return {...old, results: [...old.results, new_room]}
    })
  }
  return (
    <div className='sidebar'>
      <button onClick={updateQuery}>Click</button>
      <button onClick={inval}>Inv</button>
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