export function getRooms(token) {
    return fetch('http://127.0.0.1:8000/api/rooms/', {
        headers: {
            'Authorization':` Bearer ${token}`
        }
    })
    .then(
        (res) => res.json(),
    )
}


