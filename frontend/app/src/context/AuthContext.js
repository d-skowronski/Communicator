import React, { useState, createContext, useEffect } from 'react'
import jwtDecode from 'jwt-decode'
const AuthContext = createContext()


export default AuthContext
export const AuthProvider = ({children}) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem('authTokens') ?
        JSON.parse(localStorage.getItem('authTokens')): null
    )
    const [user, setUser] = useState(() => authTokens ? jwtDecode(authTokens.access): null)
    const [loading, setLoading] = useState(true)

    async function loginUser(formData){
        const response = await fetch('http://127.0.0.1:8000/api/token/', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' },
        })

        let data = await response.json()

        if(response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            console.log(data)
        }
        else{
            alert("An error occured")
        }
    }

    function logoutUser() {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
    }

    async function updateToken() {
        console.log("Token update")
        let body = JSON.stringify({refresh: authTokens?.refresh})
        if(body !== '{}'){
            const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
                method: 'POST',
                body: body,
                headers: { 'Content-Type': 'application/json' },
            })

            let data = await response.json()
            if(response.status === 200) {
                setAuthTokens(data)
                setUser(jwtDecode(data.access))
                localStorage.setItem('authTokens', JSON.stringify(data))
            }
            else{
                logoutUser()
            }
        }

        if(loading){
            setLoading(false)
        }
    }

    useEffect(()=>{
        let timeBetweenUpdates = 4*1000*60
        // In case user has valid refresh token but invalid access token
        if(loading){
            updateToken()
        }
        let interval = setInterval(()=> {
            if(authTokens){
                updateToken()
            }
        }, timeBetweenUpdates)
        return () => clearInterval(interval)
    }, [authTokens, loading])

    const contextData = {
        user:user,
        loginUser:loginUser,
        logoutUser:logoutUser,
    }

    return(
        <AuthContext.Provider value={contextData} >
            {loading ? null:children}
        </AuthContext.Provider>
    )
}