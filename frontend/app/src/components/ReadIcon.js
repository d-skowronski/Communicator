import React from 'react'
import { useQueryUser } from '../utils/hooks/queries'
import '../css/ReadIcon.css'
import { Tooltip } from 'react-tooltip'

function ReadIcon({userId}) {
    const user = useQueryUser(userId)
  return (
    <div className='read-icon'>
      <img
        className='profile-pic'
        src={user.profile_picture}
        alt={user.username}
        data-tooltip-id={user.id}
        data-tooltip-content={user.username}
        data-tooltip-place="left"
      ></img>
      <Tooltip id={user.id} className='tooltip'/>
    </div>

  )
}

export default ReadIcon