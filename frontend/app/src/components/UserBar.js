import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import '../css/UserBar.css'


function UserBar() {
  const {logoutUser} = useContext(AuthContext)
  return (
    <div className='user-bar'>
        UserBar
        <button onClick={logoutUser}>logout</button>
    </div>
  )
}

export default UserBar