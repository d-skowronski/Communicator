function getToken() {
    return JSON.parse(localStorage.getItem('authTokens')).access
}

export function getRooms() {
    return fetch('http://127.0.0.1:8000/api/rooms/', {
        headers: {
            'Authorization':` Bearer ${getToken()}`
        }
    })
    .then(
        (res) => res.json(),
    )
}


