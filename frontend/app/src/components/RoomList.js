import React from 'react'
import '../css/RoomList.css'
import { useQueryAllRooms } from '../utils/hooks/queries'
import RoomSelect from './RoomSelect'
import BarLoader from 'react-spinners/BarLoader'

export default function RoomList() {
    const roomsQuery = useQueryAllRooms()

    if (roomsQuery.isSuccess) {
        const allRooms = roomsQuery.data.results.map(room => (
            <RoomSelect key={room.id} room={room}/>
        ))
        return (
            <div className='room-list'>{allRooms}</div>
        )
    }
    else {
        return (
            <div className='room-list'>
                <BarLoader
                    color="#f19c2b"
                    height={5}
                    cssOverride={{width: '100%', marginTop: '0.5rem'}}
                ></BarLoader>
            </div>
        )
    }


}
