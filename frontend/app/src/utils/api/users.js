export function getUsersSharedRooms(token) {
    return fetch('http://127.0.0.1:8000/api/users?shared_rooms=true', {
        headers: {
            'Authorization':` Bearer ${token}`
        }
    })
    .then(
        (res) => res.json(),
    )
}


export function getUser(user_id, token) {
    return fetch(`http://127.0.0.1:8000/api/users/${user_id}`, {
        headers: {
            'Authorization':` Bearer ${token}`
        }
    })
    .then(
        (res) => res.json(),
    )
}


