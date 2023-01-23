import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { getRooms } from '../api.js/rooms'
import { getUsersSharedRooms } from '../api.js/users'
import '../css/RoomList.css'
import RoomSelect from './RoomSelect'

export default function RoomList() {
    const roomsQuery = useQuery({
        queryFn: getRooms,
        queryKey: ['rooms'],
        staleTime: 10000,
    })

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
