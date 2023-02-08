import React, {useContext, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/RoomList.css'
import '../css/RoomSelect.css'
import '../css/GlobalStyles.css'
import { useQueryFindUsers } from '../utils/hooks/queries'
import AuthContext from '../context/AuthContext'
import BarLoader from 'react-spinners/BarLoader'

function UserSearchList({userSearch, setUserSearch}) {
    const {user:currentUser} = useContext(AuthContext)
    const navigate = useNavigate()
    const userQuery = useQueryFindUsers(userSearch.queryText, userSearch.sendQuery)

    // Prevent queries during typing
    useEffect(() => {
        let queryDelay
        if(userSearch.queryText !== ''){
            queryDelay = setTimeout(() => {
                setUserSearch(prev => ({
                    ...prev,
                    sendQuery: true
                }))
              }, 700)
        }
        return () => {queryDelay && clearTimeout(queryDelay)}
    }, [userSearch.queryText])

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
                            setUserSearch({queryText: '', sendQuery: false})
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
                {renderUsers.length > 0 ? renderUsers: <p className='grayed-text'> No one has been found</p>}
            </div>
        )
    }
    else{
        return (
            <div className='room-list'>
                <div>Search results:</div>
                <div>
                <BarLoader
                    color="#f19c2b"
                    height={5}
                    cssOverride={{width: '100%', marginTop: '0.5rem'}}
                ></BarLoader>
                </div>

            </div>
        )
    }


}

export default UserSearchList