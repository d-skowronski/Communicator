import React from 'react'
import { useQueryUser } from '../utils/hooks/queries'
import '../css/ReadIcon.css'

function ReadIcon({userId}) {
    const user = useQueryUser(userId)
  return (
    <img className='read-icon profile-pic' src={user.profile_picture}></img>
  )
}

export default ReadIcon