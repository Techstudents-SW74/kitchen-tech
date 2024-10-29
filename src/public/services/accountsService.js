import axiosInstance from "./axiosConfig";

const API_URL = '/account';

const getAuthToken = () => {
    return localStorage.getItem('token'); // Obtiene el token del localStorage
};

export const accountService = {
    async getAccountsByRestaurant(restaurantId) {
        try {
            const token = getAuthToken();
            const response = await axiosInstance.get(`${API_URL}/restaurant/${restaurantId}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Incluye el token como Bearer en el encabezado
                }
            });
            return response.data;
        }catch (error) {
            console.error('Error fetching accounts:', error.response ? error.response.data : error.message);
        }
    }
}