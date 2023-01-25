import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react'

export default function useWebsocket() {
    const queryClient = useQueryClient()

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

    }, [queryClient])
}