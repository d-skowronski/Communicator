import React from 'react'
import Login from '../components/Login'
import Signup from '../components/Signup'
import '../css/StartPage.css'
import previewImg from '../content/preview.png'

function StartPage() {
  return (
    <div className='start-page'>

      <nav>
        <div className='service'>
          <i className='bi bi-chat-left-fill logo'></i>
          <div className='gradient'>Communicator</div>
        </div>
      </nav>

      <div className='start-page-content'>

        <div className='start-page-forms'>
          <h1 className='gradient'>Hang out anytime, anywhere</h1>
          <h2>Communicator makes it easy and fun to stay close to your favorite people.</h2>
          <div className='start-page-form'>
            <Login/>
          </div>
          <div className='start-page-form'>
            <p className='no-account'>No account? Join!</p>
            <Signup/>
          </div>
        </div>

        <div className='start-page-preview'>
          <img src={previewImg} alt='preview'></img>
        </div>

      </div>
      <footer>
        <div className='grayed-text'>Made by Dawid Skowroński</div>
        <a className='link' href='https://github.com/d-skowronski/'>
          <i class="bi bi-github"></i>
        </a>
      </footer>
    </div>
  )
}

export default StartPage