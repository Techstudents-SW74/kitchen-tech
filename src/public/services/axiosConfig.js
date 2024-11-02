// src/public/services/axiosConfig.js
import axios from "axios";

const API_URL = 'https://kitchen-tech-fqghavb0fychfkhm.brazilsouth-01.azurewebsites.net/api/kitchentech/v1'; // URL base

const axiosInstance = axios.create({
    baseURL: API_URL,
});

// Aquí puedes configurar interceptores si es necesario

export default axiosInstance;
