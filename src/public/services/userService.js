// services/userService.js
import axios from 'axios';

const API_URL = 'http://localhost:8081/api/kitchentech/v1/user'; // Ajusta según tu configuración

const getAuthToken = () => {
    return localStorage.getItem('token'); // Obtiene el token del localStorage
};

const getUserById = async (userId) => {
    try {
        const token = getAuthToken(); // Obtiene el token
        const response = await axios.get(`${API_URL}/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}` // Incluye el token como Bearer en el encabezado
            }
        });
        return response.data; // Devuelve los datos del usuario
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error; // Propaga el error para que se maneje en el componente
    }
};

const updateUserById = async (userId, updatedDetails) => {
    try {
        const token = getAuthToken(); // Obtiene el token
        const response = await axios.put(`${API_URL}/${userId}`, updatedDetails, {
            headers: {
                Authorization: `Bearer ${token}` // Incluye el token como Bearer en el encabezado
            }
        });
        return response.data; // Devuelve los datos del usuario actualizado
    } catch (error) {
        console.error("Error updating user:", error);
        throw error; // Propaga el error para que se maneje en el componente
    }
};

export default {
    getUserById,
    updateUserById,
};
