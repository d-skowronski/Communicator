import React, { useState, createContext, useEffect, useCallback } from 'react'
import jwtDecode from 'jwt-decode'
import {useQueryClient} from '@tanstack/react-query'
import axios from 'axios'

const AuthContext = createContext()

export default AuthContext
export const AuthProvider = ({children}) => {
    const APIURL = process.env.REACT_APP_API_URL
    const queryClient = useQueryClient()
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem('authTokens') ?
        JSON.parse(localStorage.getItem('authTokens')): null
    )

    const [user, setUser] = useState(() => authTokens ? jwtDecode(authTokens.access): null)
    const [loading, setLoading] = useState(true)

    async function authenticateUser(formData, signup=false){
        let url = APIURL + 'token/'
        if(signup){
            url = APIURL + 'signup/'
        }



        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' },
        })

        let data = await response.json()

        if(response.status === 200 || response.status === 201) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            return {}
        }
        else{
            logoutUser()
            return data
        }
    }

    const logoutUser = useCallback(() => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        queryClient.clear()
    }, [queryClient])

    const updateToken = useCallback(async function () {
        console.log("Token update")
        let body = JSON.stringify({refresh: authTokens?.refresh})
        if(body !== '{}'){
            const response = await fetch(`${APIURL}token/refresh/`, {
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
    },[authTokens, logoutUser, loading])

    useEffect(()=>{
        // 4 minutes 30 seconds
        let timeBetweenUpdates = 1000*60*4 + 1000*30
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
    }, [authTokens, loading, updateToken])

    const contextData = {
        user:user,
        authTokens:authTokens,
        authenticateUser:authenticateUser,
        logoutUser:logoutUser,
    }

    return(
        <AuthContext.Provider value={contextData} >
            {loading ? null:children}
        </AuthContext.Provider>
    )
}