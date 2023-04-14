import React, {useContext, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/RoomList.css'
import '../css/RoomSelect.css'
import { useMutationCreateRoom, useQueryFindUsers } from '../utils/hooks/queries'
import AuthContext from '../context/AuthContext'
import BarLoader from 'react-spinners/BarLoader'
import InfiniteScroll from 'react-infinite-scroll-component'

function UserSearchList({userSearch, setUserSearch}) {
    const {user:currentUser} = useContext(AuthContext)
    const navigate = useNavigate()
    const userQuery = useQueryFindUsers(userSearch.queryText, userSearch.sendQuery)
    const roomsMutation = useMutationCreateRoom()
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

    if(userQuery.isSuccess && !userQuery.isStale){
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
                        className='profile-pic'
                        onClick={() => {
                            if(roomsMutation.isIdle){
                                roomsMutation.mutate([user.id])
                                setUserSearch({queryText: '', sendQuery: false})
                            }
                        }}
                    ><i className="bi bi-person-plus"></i></button>
                }
            </div>
            )
        })
        return (
            <div className='room-list-wrapper'>
                <div className='scroll-area room-list' id='search-list'>
                    {/* infinite scroll here has not been implemented, TODO, for now
                        it serves for consistency across all scrollable lists in the app */}
                    <InfiniteScroll
                        dataLength={renderUsers.length}
                        next={userQuery.fetchNextPage}
                        hasMore={userQuery.hasNextPage}
                        style={{ display: 'flex', flexDirection: 'column' }}
                        scrollableTarget='search-list'
                        >
                        {renderUsers.length > 0 ? renderUsers: <p className='grayed-text'> No one has been found</p>}
                    </InfiniteScroll>
                </div>
            </div>
        )
    }
    else{
        return (
            <div className='scroll-area room-list'>
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