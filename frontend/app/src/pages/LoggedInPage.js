import React, { useEffect } from 'react'
import Main from '../components/Main'
import Sidebar from '../components/Sidebar'
import '../css/LoggedInPage.css'
import { useQueryAllRooms } from '../utils/hooks/queries'
import { useNavigate } from 'react-router-dom'
import useScreenSize from '../utils/hooks/screenSize'
import useCurrentRoom from '../utils/hooks/currentRoom'

function LoggedInPage() {
    const roomsQuery = useQueryAllRooms()
    const navigate = useNavigate()
    const screenSize = useScreenSize()
    const currentRoom = useCurrentRoom()

    //Redicrecting in case of invalid currentRoom
    useEffect(() => {
        if(!currentRoom && screenSize === "big" && roomsQuery.data?.count > 0){
            navigate(`/communicator/${roomsQuery.data.results[0].id}`, {replace: true})
        } else if(currentRoom === null){
            navigate('/communicator/', {replace: true})
        }
    }, [roomsQuery.data, screenSize, currentRoom, navigate])

    if(roomsQuery.isSuccess) {
        return (
            <div className='wrapper'>
                {screenSize === "small" && !currentRoom && <Sidebar sidebarOnlyDisplayed={true}/>}
                {screenSize === "small" && currentRoom && <Main mainOnlyDisplayed={true}/>}
                {screenSize === "big" && <><Sidebar/> <Main/></>}
            </div>
        )

    }
}


export default LoggedInPage
