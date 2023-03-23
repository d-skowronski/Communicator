import { useAtom } from 'jotai'
import React, { useState, useEffect } from 'react'
import '../css/Message.css'
import '../css/GlobalStyles.css'
import { messageWithVisibleDetails } from './ChatArea'
import { getDisplayDate } from '../utils/helperFunctions'

function Message({message, senderData, displayProfilePic}) {
  // detailsClasses determines whether to display details as well as CSS classes for them.
  // When details have been displayed but no longer are needed, helper CSS class 'hidden'
  // provides hiding animation, after animation has finished, setDetailsClasses(null) results
  // in details div removal from DOM
  const [details, setDetails] = useAtom(messageWithVisibleDetails)
  const [detailsClasses, setDetailsClasses] = useState(null)
  useEffect(() => {
    let animationOffset
    if(details === message.id){
      setDetailsClasses('message-details grayed-text')
    }
    else if(details !== message.id && detailsClasses){
      setDetailsClasses('message-details hidden')
      animationOffset = setTimeout(() => {
          setDetailsClasses(null)
        }, 1000
      )
      // 1000 miliseconds gives enough time to finish animation defined in 'hidden' CSS class
    }

    return () => {
      if(animationOffset){
        clearTimeout(animationOffset)
      }
    }
  }, [details, detailsClasses, message.id])

  return (
    <div className='message-wrapper'>
      {displayProfilePic && <img className='profile-pic' src={senderData.profile_picture}></img>}
      <div
        className='message'
        onClick={() => setDetails((prev) => {
            if(prev === message.id){
              return null
            }
            return message.id
            }
          )
        }
      >
        <div className='text'>{message.content_text}</div>
      </div>
      <div className='seen-by'>{message.read_by[0]}</div>
      {detailsClasses && <div className={detailsClasses}>{getDisplayDate(message.date)}</div>}
    </div>

  )
}

export default Message