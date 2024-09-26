import axios from 'axios'
const instance = axios.create({
    baseURL: import.meta.env.VITE_BE_URL,
    timeout:3000,
    headers:{
        'Accept':"application/json",
        'Content-Type':"application/json"
    }
}) 

export default instance