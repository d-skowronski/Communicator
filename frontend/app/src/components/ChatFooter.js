import React from 'react'
import '../css/ChatFooter.css'

function ChatFooter({ currentRoom }) {
  return (
    <form className='chat-footer'>
        <input type="text" placeholder="Aa" name="message" maxLength="512" autoComplete="off"></input>
        <button type="submit"><i className="bi bi-send"></i></button>
    </form>
  )
}

export default ChatFooter