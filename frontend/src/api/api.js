import axios from 'axios';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

// add token to auth header if token exists
api.interceptors.request.use((config) => {
    const token = cookies.get("token");

    if (token) {
        config.headers.Authorization = `Bearer: ${token}`;
    }

    return config;
});

export default api;