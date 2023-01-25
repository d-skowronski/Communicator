import React, { useEffect } from 'react'

export default function useWebsocket() {
    useEffect(() => {
        const ws = new WebSocket("ws://127.0.0.1:8000/ws/chat");
        console.log("ws ", ws)
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            console.log(data)
        }
        return ws.close()
    }, [])
}