import React, { useState } from 'react'
import '../css/Sidebar.css'
import UserBar from './UserBar'
import "bootstrap-icons/font/bootstrap-icons.css"
import RoomList from './RoomList'
import UserSearchList from './UserSearchList'

function Sidebar({sidebarOnlyDisplayed}) {
  const [userSearch, setUserSearch] = useState({queryText: '', sendQuery: false})

  function handleChange(event) {
    setUserSearch({
      queryText: event.target.value,
      sendQuery: false
    })
  }

  return (
    <div className={sidebarOnlyDisplayed ? 'sidebar full':'sidebar'}>
      <header className='app-header'>
        <div className='service medium'>
          <i className='bi bi-chat-left-fill logo'></i>
          <div>Communicator</div>
        </div>


        <input
          name='userSearch'
          type='text'
          placeholder='Search for people'
          value={userSearch.queryText}
          onChange={(event) => handleChange(event)}
        ></input>
      </header>
      {userSearch.queryText ? <UserSearchList userSearch={userSearch} setUserSearch={setUserSearch}/>:<RoomList/>}
      <UserBar/>
    </div>
  )
}

export default Sidebar