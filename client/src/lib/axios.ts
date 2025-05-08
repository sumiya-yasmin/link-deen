import axios from 'axios';

export const API = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        'Content-type': 'application/json',
      },
})

export default API;