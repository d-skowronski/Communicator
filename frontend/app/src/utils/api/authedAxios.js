import axios from "axios";

const baseURL = 'http://127.0.0.1:8000/api/'

const authedAxios = axios.create({
    baseURL,
    headers: {
        "Content-type": "application/json"
    },
})

authedAxios.interceptors.request.use(async req => {
    const tokenData = localStorage.getItem('authTokens')
    if(tokenData){
        req.headers['Authorization'] = 'Bearer ' + JSON.parse(tokenData).access
    }

    return req
})


export default authedAxios