import React, { useEffect } from 'react'
import Main from '../components/Main'
import Sidebar from '../components/Sidebar'
import '../css/LoggedInPage.css'
import { atom } from 'jotai'
import { useQueryAllRooms } from '../utils/queries'
import { useNavigate, useParams } from 'react-router-dom'

function LoggedInPage() {
    const navigate = useNavigate()
    const {room:roomParam} = useParams()
    const roomsQuery = useQueryAllRooms()

    useEffect(() => {
        if(roomsQuery.data && !roomParam){
            navigate(`/communicator/${roomsQuery.data.results[0].id}`)
        }
    }, [roomsQuery.data])

    if(roomsQuery.isLoading) return <h1>Loading...</h1>
    if(roomsQuery.isSuccess) {
        return (
            <div className='wrapper'>

                <Sidebar/>
                <Main/>
            </div>
        )

    }
}


export default LoggedInPage
