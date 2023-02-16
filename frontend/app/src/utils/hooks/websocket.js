import { useQueryClient } from '@tanstack/react-query';
import { atom, useAtom } from 'jotai';
import { useContext, useEffect } from 'react'
import AuthContext from '../../context/AuthContext';
import { useQueryAllRooms } from './queries';

export default function useWebsocket() {
    const queryClient = useQueryClient()
    const [,setWebsocket] = useAtom(setWebsocketAtom)
    const {user, authTokens} = useContext(AuthContext)
    const roomsQuery = useQueryAllRooms()

    useEffect(() => {
        let ws
        if(user && roomsQuery.data?.results?.length !== undefined){
            ws = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}chat/?token=${authTokens.access}`);
            console.log("ws ", ws)
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data)
                console.log("WEBSOCKET INCOMING: ", data)
                let informationType = data.information_type
                if (informationType === 'chat_message'){
                    const message = data
                    queryClient.setQueryData(
                        ['messages', `messages-room-${message.room}`],
                        (oldData) => {
                            if(oldData) {
                                let firstPage = oldData.pages[0]
                                firstPage.results.unshift(message)

                                // totalOffset is a count of messages received from websocket
                                // is does NOT serve currently any role in calculating next page
                                // is is workaround beacuse React Query does not rerender components
                                // when changes occur deeply, as with adding messages
                                let totalOffset = oldData.totalOffset ? oldData.totalOffset + 1: 1

                                return {...oldData, totalOffset: totalOffset, pages: [firstPage, ...oldData.pages.slice(1)]}
                            }
                        }
                    )
                    queryClient.setQueryData(
                        ['rooms'],
                        (oldData) => {
                            let updatedDataResults = oldData.results.map(room => {
                                if(room.id === message.room) {
                                    return {...room, last_message: message}
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
            }
            //ws.send in ChatFooter
            setWebsocket(ws)
        }

        return () => {if(ws) ws.close()}
    }, [queryClient, setWebsocket, user, authTokens, roomsQuery.data?.results?.length])
}

export const websocketAtom = atom()
export const setWebsocketAtom = atom(null, (get, set, update) => {
    set(websocketAtom, update)
})