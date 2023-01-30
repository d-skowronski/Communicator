import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

function AnonymousRoute() {
    const {user} = useContext(AuthContext)
    return (
        <>
            {user ? <Navigate to="/communicator" replace={true}/> : <Outlet/>}
        </>
    )
}

export default AnonymousRoute