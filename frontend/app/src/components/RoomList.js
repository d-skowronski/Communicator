import React, { useContext } from 'react'
import '../css/RoomList.css'
import { useQueryAllRooms } from '../utils/hooks/queries'
import RoomSelect from './RoomSelect'
import BarLoader from 'react-spinners/BarLoader'
import AuthContext from '../context/AuthContext'
import InfiniteScroll from "react-infinite-scroll-component"

export default function RoomList() {
    const roomsQuery = useQueryAllRooms()
    const { user:currentUser } = useContext(AuthContext)

    if (roomsQuery.isSuccess) {
        let rooms = roomsQuery.data.results
        const allRooms = rooms.map(room => (
            <RoomSelect key={room.id} room={room}/>
        ))
        if(allRooms.length > 0){
            return (
                <div className='room-list-wrapper'>
                    <div className='scroll-area room-list' id='room-list'>
                        {/* infinite scroll here has not been implemented, TODO, for now
                            it serves for consistency across all scrollable lists in the app */}
                        <InfiniteScroll
                            dataLength={allRooms.length}
                            next={roomsQuery.fetchNextPage}
                            hasMore={roomsQuery.hasNextPage}
                            style={{ display: 'flex', flexDirection: 'column' }}
                            scrollableTarget='room-list'
                            loader={
                                <BarLoader
                                    color="#f19c2b"
                                    size={20}
                                    cssOverride={{display: 'flex', justifyContent: 'center', marginTop: '1rem'}}
                                    />}
                                    >
                            {allRooms}

                        </InfiniteScroll>
                    </div>
                </div>
            )
        }
        else{
            return (
                <div className='room-list-wrapper'>
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
