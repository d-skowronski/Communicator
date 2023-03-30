import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import '../css/UserBar.css'

function UserBar() {
  const {logoutUser, user} = useContext(AuthContext)
  const navigate = useNavigate()
  return (
    <div className='user-bar'>
        <div className='profile-pic action-overlay' onClick={() => navigate('/communicator/profile')}>
          <i className="bi bi-info-lg"></i>
        </div>
        <img className='profile-pic' src={user.profile_picture} alt=""></img>
        <div className='user-bar-name'>{user.username}</div>
        <button onClick={logoutUser}>
          <i className="bi bi-box-arrow-right"></i>
        </button>
    </div>
  )
}

export default UserBar