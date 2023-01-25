import { useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useEffect } from 'react'
import { setWebsocketAtom } from '../pages/LoggedInPage';

export default function useWebsocket() {
    const queryClient = useQueryClient()
    const [,setWebsocket] = useAtom(setWebsocketAtom)

    useEffect(() => {
        const ws = new WebSocket("ws://127.0.0.1:8000/ws/chat");
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

    }, [queryClient, setWebsocket])
}