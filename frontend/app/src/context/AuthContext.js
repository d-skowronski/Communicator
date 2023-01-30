import React, { useState, createContext, useEffect } from 'react'
import jwtDecode from 'jwt-decode'
import {useQueryClient} from '@tanstack/react-query'
const AuthContext = createContext()


export default AuthContext
export const AuthProvider = ({children}) => {
    const queryClient = useQueryClient()
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
            logoutUser()
            alert("An error occured")
        }
    }

    function logoutUser() {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        queryClient.clear()
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
        // 4 minutes 30 seconds
        let timeBetweenUpdates = 1000*60*4 + 1000*30
        // In case user has valid refresh token but invalid access token
        if(loading){
            console.log("HELLO UPDATE")
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
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser,
        updateToken:updateToken,
    }

    return(
        <AuthContext.Provider value={contextData} >
            {loading ? null:children}
        </AuthContext.Provider>
    )
}