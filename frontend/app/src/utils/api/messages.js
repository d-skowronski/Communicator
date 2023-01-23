function getToken() {
    return JSON.parse(localStorage.getItem('authTokens')).access
}

export function getMessagesForRoom(room_id) {
    return fetch(`http://127.0.0.1:8000/api/messages?room_id=${room_id}`, {
        headers: {
            'Authorization':` Bearer ${getToken()}`
        }
    })
    .then(
        (res) => res.json(),
    )
}

export function getMessage(message_id) {
    return fetch(`http://127.0.0.1:8000/api/messages/${message_id}`, {
        headers: {
            'Authorization':` Bearer ${getToken()}`
        }
    })
    .then(
        (res) => res.json(),
    )
}

