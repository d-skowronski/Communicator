import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import useWebsocket from './hooks/websocket'

function LoggedInRoute() {
    useWebsocket()
    const {user} = useContext(AuthContext)
    return (
        <>
            {user ? <Outlet/>:<Navigate to='/' replace={true}/>}
        </>
    )
}

export default LoggedInRoute