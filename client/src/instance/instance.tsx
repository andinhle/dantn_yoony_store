import axios from 'axios'

const instance = axios.create({
    baseURL: import.meta.env.VITE_BE_URL,
    headers:{
        'Accept':"Application/json",
        'Content-Type':"Application/json"
    }
}) 

export default instance