import axios from 'axios'
const instance = axios.create({
    baseURL: import.meta.env.VITE_BE_URL,
    headers:{
        'Accept':"application/json",
        'Content-Type':"application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_TOKEN_LOGIN}`
    }
}) 

export default instance