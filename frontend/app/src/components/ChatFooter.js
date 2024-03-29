import React, { useState } from 'react'
import '../css/ChatFooter.css'
import { useAtom } from 'jotai'
import { websocketAtom } from '../utils/hooks/websocket'

function ChatFooter({ currentRoom }) {
  const [websocket,] = useAtom(websocketAtom)

  const [formData, setFormData] = useState('')
  function handleSubmit(event){
    event.preventDefault()
    const escapedFormData = formData.trim()
    if(escapedFormData.length > 0){
      websocket.send(JSON.stringify({
          'information_type':'chat_message',
          'content_text':escapedFormData,
          'room':currentRoom.id,
        })
      )
    }
    setFormData('')
  }

  return (
    <form onSubmit={handleSubmit} className='app-footer chat-footer'>
        <input
          type="text"
          placeholder="Aa"
          name="message"
          maxLength="512"
          autoComplete="off"
          value={formData}
          onChange={(e) => setFormData(e.target.value)}
          />
        <button type="submit"><i className="bi bi-send"></i></button>
    </form>
  )
}

export default ChatFooter