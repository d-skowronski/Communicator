import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import useScreenSize from './hooks/screenSize'
import { useQueryAllRooms } from './hooks/queries'

function SmallScreenOnlyRoute() {
    const roomsQuery = useQueryAllRooms()
    const screenSize = useScreenSize()

    return (
        <>
            {screenSize === 'small' ?
            <Outlet/> :
            <Navigate to={`/communicator/${roomsQuery.data.results[0].id}`} replace={true}/>}
        </>
    )
}

export default SmallScreenOnlyRoute