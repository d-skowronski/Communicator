import { useQueryClient } from '@tanstack/react-query';
import { atom, useAtom } from 'jotai';
import { useContext, useEffect } from 'react'
import AuthContext from '../../context/AuthContext';
import useCurrentRoom from './currentRoom';
import { useQueryAllRooms } from './queries';

export default function useWebsocket() {
    const queryClient = useQueryClient()
    const [websocket, setWebsocket] = useAtom(websocketAtom)
    const {user: currentUser, authTokens} = useContext(AuthContext)
    const roomsQuery = useQueryAllRooms()
    const currentRoom = useCurrentRoom()
    useEffect(() => {
        let ws
        if(roomsQuery.isSuccess){
            console.log("CREATING WS")
            ws = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}chat/?token=${authTokens.access}`)
            setWebsocket(ws)
        }
        return () => {
            if(ws) {
                console.log("CLOSING WS")
                ws.close()
            }
        }
    },[authTokens, roomsQuery.data?.results?.length, roomsQuery.isSuccess, setWebsocket])

    useEffect(() => {
        if(websocket){
            setWebsocket(prevWs => {
                let newWs = prevWs
                newWs.onmessage = (event) => {
                    const data = JSON.parse(event.data)
                    console.log("WEBSOCKET INCOMING: ", data)
                    const informationType = data.information_type
                    let receivedMessage = data
                    // last_message and messages-room-id need to be reworked to have single source of truth
                    if (informationType === 'chat_message'){
                        if(currentRoom && currentRoom.id === receivedMessage.room){
                            if(!receivedMessage.read_by.includes(currentUser.user_id)){
                                // optimistic update
                                receivedMessage = {...receivedMessage, read_by: [...receivedMessage.read_by, currentUser.user_id]}
                                newWs.send(JSON.stringify({
                                    'information_type':'message_read',
                                    'id': receivedMessage.id,
                                }))
                            }
                            queryClient.setQueryData(
                                ['messages', `messages-room-${receivedMessage.room}`],
                                (oldData) => {
                                    if(oldData) {
                                        let firstPage = oldData.pages[0]
                                        firstPage.results.unshift(receivedMessage)

                                        // totalOffset is a count of messages received from websocket
                                        // is does NOT serve currently any role in calculating next page
                                        // is is workaround beacuse React Query does not rerender components
                                        // when changes occur deeply, as with adding messages
                                        let totalOffset = oldData.totalOffset ? oldData.totalOffset + 1: 1

                                        return {...oldData, totalOffset: totalOffset, pages: [firstPage, ...oldData.pages.slice(1)]}
                                    }
                                }
                            )
                        }
                        else{
                            queryClient.invalidateQueries(['messages', `messages-room-${receivedMessage.room}`])
                        }
                        queryClient.setQueryData(
                            ['rooms'],
                            (oldData) => {
                                console.log("ROOM UPD ", receivedMessage)
                                let updatedDataResults = oldData.results.map(room => {
                                    if(room.id === receivedMessage.room) {
                                        return {...room, last_message: receivedMessage}
                                    }
                                    return room
                                })
                                return {...oldData, results: updatedDataResults}
                            }
                        )
                    }
                    else if (informationType === 'room_created'){
                        queryClient.invalidateQueries(['rooms'])
                    }
                    else if (informationType === 'message_read'){
                        queryClient.setQueryData(['rooms'], (oldRooms) => {
                            let updatedRoomsResults = oldRooms.results.map(room => {
                                if(room.id === receivedMessage.room) {
                                    // needed because of optimistic update in chat_message
                                    let newReadBy = room.last_message.read_by.includes(receivedMessage.read_user) ?
                                        [...room.last_message.read_by]: [...room.last_message.read_by, receivedMessage.read_user]
                                    return {
                                        ...room,
                                        last_message: {
                                            ...room.last_message,
                                            read_by: newReadBy
                                            }
                                        }
                                }
                                return room
                            })
                            return {...oldRooms, results: updatedRoomsResults}
                        })
                        queryClient.setQueryData(
                            ['messages', `messages-room-${receivedMessage.room}`],
                            (oldData) => {
                                if(oldData){
                                    let pages = oldData.pages.map(page => {
                                        page.results.map(mess => {
                                            // includes() needed because of optimistic update in chat_message
                                            if(mess.id === receivedMessage.message && !mess.read_by.includes(currentUser.user_id)){
                                                mess.read_by.push(receivedMessage.read_user)
                                            }
                                            return mess
                                        })
                                        return page
                                    })
                                    return {...oldData, pages: pages}
                                }

                            }
                        )
                    }
                }
                return newWs
            })
        }
    }, [currentRoom, queryClient, websocket, currentUser, setWebsocket])
}

export const websocketAtom = atom()
export const setWebsocketAtom = atom(null, (get, set, update) => {
    set(websocketAtom, update)
})