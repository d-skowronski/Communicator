import axios from "axios";

const APIURL = process.env.REACT_APP_API_URL

const authedAxios = axios.create({
    baseURL: APIURL,
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