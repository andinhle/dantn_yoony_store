import axios from "axios";

const instance = axios.create({
    baseURL:"http://127.0.0.1:8000",
    timeout:3000,
    headers:{
        "Content-Type":"Application/json",
        "Accept":"Application/json"
    }
})
export default instance