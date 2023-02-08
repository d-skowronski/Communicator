import React, {useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/RoomList.css'
import '../css/RoomSelect.css'
import '../css/GlobalStyles.css'
import { useQueryFindUsers } from '../utils/hooks/queries'
import AuthContext from '../context/AuthContext'

function UserSearchList({query, setQuery}) {
    const {user:currentUser} = useContext(AuthContext)
    const navigate = useNavigate()
    const userQuery = useQueryFindUsers(query)
    if(userQuery.isSuccess){
        let users = userQuery.data.results.filter((user) => {return user.id !== currentUser.user_id})
        let renderUsers = users.map(user => {
            return (
            <div key={user.id} className='room-select'>
                <img className='profile-pic' src={user.profile_picture} alt=""></img>
                <div className="room-info">
                    <div className="room-name">{user.username}</div>
                </div>
                {user.shared_rooms[0] ?
                    <button
                        className='profile-pic'
                        onClick={() => {
                            navigate(`/communicator/${user.shared_rooms[0]}`)
                            setQuery('')
                        }}
                    ><i className="bi bi-chat-left"></i></button>:
                    <button
                        className='profile-pic add-user'
                    ><i className="bi bi-person-plus"></i></button>
                }
            </div>
            )
        })
        return (
            <div className='room-list'>
                <div>Search results:</div>
                {renderUsers.length > 0 ? renderUsers: <p className='grayed-text'>no users found</p>}
            </div>
        )
    }
    else{
        return (
            <div className='room-list'>
                <div>Search results:</div>
            </div>
        )
    }


}

export default UserSearchList