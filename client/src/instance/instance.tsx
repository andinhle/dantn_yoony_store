import axios from 'axios'

const instance = axios.create({
    baseURL: import.meta.env.VITE_BE_URL,
    timeout:3000,
    headers:{
        'Content-Type':"Application/json"
    }
}) 

export default instance