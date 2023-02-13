import React, { useContext } from 'react'
import '../css/RoomList.css'
import { useQueryAllRooms } from '../utils/hooks/queries'
import RoomSelect from './RoomSelect'
import BarLoader from 'react-spinners/BarLoader'
import AuthContext from '../context/AuthContext'

export default function RoomList() {
    const roomsQuery = useQueryAllRooms()
    const { user:currentUser } = useContext(AuthContext)

    if (roomsQuery.isSuccess) {
        const allRooms = roomsQuery.data.results.map(room => (
            <RoomSelect key={room.id} room={room}/>
        ))
        if(allRooms.length > 0){
            return (
                <div className='room-list'>{allRooms}</div>
            )
        }
        else{
            return (
                <div className='room-list'>
                    <div className='helper-text'>
                        <h1>Hello {currentUser.username}!</h1>
                        <p>
                            I would like to welcome you to Communicator.
                            Here, you can chat live with other people and have fun.
                        </p>
                        <p>
                            I am constantly working on this app. If you find any issues you
                            can hit me up here. Feel free to also add me as your first friend!
                        </p>
                        <b>dawidskowronski</b>
                    </div>
                </div>
            )
        }
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
