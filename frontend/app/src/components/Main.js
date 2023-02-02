import React from 'react'
import '../css/Main.css'
import ChatWindow from './ChatWindow'

function Main({mainOnlyDisplayed}) {
  return (
    <div className={mainOnlyDisplayed ? 'main full':'main'}>
      <ChatWindow mainOnlyDisplayed={mainOnlyDisplayed}/>
    </div>
  )
}

export default Main