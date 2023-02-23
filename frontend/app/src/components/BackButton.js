import React from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import '../css/BackButton.css'

function BackButton() {
    const {sidebarVisible} = useOutletContext()
    const navigate = useNavigate()

    if(sidebarVisible){
        return (
            <></>
        )
    } else{
        return (
            <i
                className="bi bi-arrow-left"
                onClick={() => navigate('/communicator/', {replace: true})}
            ></i>
        )
    }
}

export default BackButton