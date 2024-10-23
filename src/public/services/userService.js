import axiosInstance from './axiosConfig'; // Asegúrate de que la ruta sea correcta

const API_URL = '/user';

const getAuthToken = () => {
    return localStorage.getItem('token'); // Obtiene el token del localStorage
};

const getUserById = async (userId) => {
    try {
        const token = getAuthToken();
        const response = await axiosInstance.get(`${API_URL}/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}` // Incluye el token como Bearer en el encabezado
            }
        });
        return response.data; // Devuelve los datos del usuario
    } catch (error) {
        console.error("Error fetching user:", error.response ? error.response.data : error.message);
        throw error; // Propaga el error para que se maneje en el componente
    }
};

const updateUserById = async (userId, updatedDetails) => {
    try {
        const token = getAuthToken();
        const response = await axiosInstance.put(`${API_URL}/${userId}`, updatedDetails, {
            headers: {
                Authorization: `Bearer ${token}` // Incluye el token como Bearer en el encabezado
            }
        });
        return response.data; // Devuelve los datos del usuario actualizado
    } catch (error) {
        console.error("Error updating user:", error.response ? error.response.data : error.message);
        throw error; // Propaga el error para que se maneje en el componente
    }
};

export default {
    getUserById,
    updateUserById,
};
