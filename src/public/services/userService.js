import axiosInstance from './axiosConfig'; // Asegúrate de que la ruta sea correcta

const API_URL_RESTAURANT = '/restaurant';
const API_URL_STAFF = '/staff-user'

const getAuthToken = () => {
    return localStorage.getItem('token'); // Obtiene el token del localStorage
};

const getRestaurantById = async (restaurantId) => {
    try {
        const token = getAuthToken();
        console.log("Token:", token);
        const response = await axiosInstance.get(`${API_URL_RESTAURANT}/${restaurantId}`, {
            headers: {
                Authorization: `Bearer ${token}` // Incluye el token como Bearer en el encabezado
            }
        });
        console.log(response.data);
        return response.data; // Devuelve los datos del usuario
    } catch (error) {
        console.error("Error fetching user:", error.response ? error.response.data : error.message);
        throw error; // Propaga el error para que se maneje en el componente
    }
};

const getStaffUserById = async (staffId) => {
    try {
        const token = getAuthToken();
        const response = await axiosInstance.get(`${API_URL_STAFF}/${staffId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching staff user:", error.response ? error.response.data : error.message);
        throw error;
    }
}

/*const updateUserById = async (userId, updatedDetails) => {
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
};*/

export default {
    getRestaurantById,
    getStaffUserById,
};
