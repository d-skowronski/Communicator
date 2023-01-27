import React, { useEffect } from 'react'
import Main from '../components/Main'
import Sidebar from '../components/Sidebar'
import '../css/LoggedInPage.css'
import { useQueryAllRooms } from '../utils/hooks/queries'
import { useNavigate, useParams } from 'react-router-dom'
import useScreenSize from '../utils/hooks/screenSize'

function LoggedInPage() {
    const navigate = useNavigate()
    const screenSize = useScreenSize()
    const {room:roomParam} = useParams()
    const roomsQuery = useQueryAllRooms()

    console.log(screenSize)

    useEffect(() => {
        if(roomsQuery.data && !roomParam && screenSize === "big"){
            navigate(`/communicator/${roomsQuery.data.results[0].id}`)
        }
    }, [roomsQuery.data, screenSize, roomParam, navigate])

    if(roomsQuery.isLoading) return <h1>Loading...</h1>
    if(roomsQuery.isSuccess) {
        return (
            <div className='wrapper'>
                {screenSize === "small" && !roomParam && <Sidebar sidebarOnlyDisplayed={true}/>}
                {screenSize === "small" && roomParam && <Main mainOnlyDisplayed={true}/>}
                {screenSize === "big" && <><Sidebar/> <Main/></>}
            </div>
        )

    }
}


export default LoggedInPage
