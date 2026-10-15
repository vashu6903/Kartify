import axios from 'axios';


// One shared axios client keeps the API URL and cookie settings in one place.
export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8001',
    headers:{
        "Content-Type":"application/json"
    },
    withCredentials: true,
})
