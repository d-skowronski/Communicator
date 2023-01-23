import React from 'react'

function Message({message}) {
  return (
    <div>{message.id} {message.content_text}</div>
  )
}

export default Message