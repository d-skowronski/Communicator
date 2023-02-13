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
        if(user){
            ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/?token=${authTokens.access}`);
            console.log("ws ", ws)
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data)
                console.log("WEBSOCKET INCOMING: ", data)
                if (data.information_type === "chat_message"){
                    const message = data
                    queryClient.setQueryData(
                        ['messages', `messages-room-${message.room}`],
                        (oldData) => {
                            if(oldData) {
                                return {...oldData, results: [message, ...oldData.results]}
                            }
                            else return {results: [message]}
                        }
                    )
                }
            }
            //ws.send in ChatFooter
            setWebsocket(ws)
        }

        return () => {if(ws) ws.close()}
    }, [queryClient, setWebsocket, user, authTokens, roomsQuery.data])
}

export const websocketAtom = atom()
export const setWebsocketAtom = atom(null, (get, set, update) => {
    set(websocketAtom, update)
})