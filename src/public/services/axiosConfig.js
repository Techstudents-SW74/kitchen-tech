import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '/api', // Esto asegura que las solicitudes pasen por el proxy
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;