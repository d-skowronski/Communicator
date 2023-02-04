import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import '../css/UserBar.css'
import '../css/GlobalStyles.css'


function UserBar() {
  const {logoutUser, user} = useContext(AuthContext)
  // Temporary. TODO: Solution would be to serialize full url in backend
  const src = "http://" + window.location.hostname + ":8000" + user.profile_picture
  return (
    <div className='user-bar'>
        <img className='profile-pic' src={src}alt=""></img>
        <div className='user-bar-name'>{user.username}</div>
        <button onClick={logoutUser}><i class="bi bi-box-arrow-right"></i></button>
    </div>
  )
}

export default UserBar