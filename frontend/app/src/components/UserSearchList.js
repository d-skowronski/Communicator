import React, {useEffect, useState} from 'react'
import '../css/RoomList.css'

function UserSearchList({query}) {
    const [users, setUsers] = useState([])

    // useEffect(() => {
    //   fetch

    // }, [query])

    return (
        <div className='room-list'>
            Search results
            {query}
        </div>
    )
}

export default UserSearchList