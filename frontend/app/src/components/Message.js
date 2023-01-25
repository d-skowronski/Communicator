import React from 'react'
import '../css/Message.css'

function Message({message}) {
  return (
    <div className='message'>
      <div className='text'>{message.content_text}</div>
    </div>
  )
}

export default Message