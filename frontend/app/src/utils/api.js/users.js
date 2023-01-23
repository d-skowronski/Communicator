function getToken() {
    return JSON.parse(localStorage.getItem('authTokens')).access
}

export function getUsersSharedRooms() {
    return fetch('http://127.0.0.1:8000/api/users?shared_rooms=true', {
        headers: {
            'Authorization':` Bearer ${getToken()}`
        }
    })
    .then(
        (res) => res.json(),
    )
}


export function getUser(user_id) {
    return fetch(`http://127.0.0.1:8000/api/users/${user_id}`, {
        headers: {
            'Authorization':` Bearer ${getToken()}`
        }
    })
    .then(
        (res) => res.json(),
    )
}


