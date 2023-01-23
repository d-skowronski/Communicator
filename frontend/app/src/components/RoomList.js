import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import '../css/RoomList.css'
import { useQueryAllRooms } from '../utils/queries'
import RoomSelect from './RoomSelect'

export default function RoomList() {
    const roomsQuery = useQueryAllRooms()

    if (roomsQuery.isLoading) return <div className='room-list'>RoomList loading</div>
    if (roomsQuery.isSuccess) {
        const allRooms = roomsQuery.data.results.map(room => (
            <RoomSelect key={room.id} room={room}/>
        ))
        return (
            <div className='room-list'>{allRooms}</div>
        )
    }


}
