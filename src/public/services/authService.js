import axios from "axios";

const API_URL = 'http://localhost:8081/api/kitchentech/v1/auth'; // Asegúrate de que esta URL sea la correcta para registro y login
const RESTAURANT_URL = 'http://localhost:8081/api/kitchentech/v1/restaurant';

export default {
    async login(username, password) {
        try {
            const response = await axios.post(`${API_URL}/login`, {
                username,
                password
            });
            return { success: true, token: response.data.token, id: response.data.id };
        } catch (error) {
            return { success: false, message: 'Invalid username or password' };
        }
    },

    async signup(userData) {
        try {
            console.log('Sign up data received:', userData);
            const response = await axios.post(`${API_URL}/register`, userData);
            return { success: true, message: response.data.message || 'User registered successfully' };
        } catch (error) {
            console.error('Error during signup:', error);
            return { success: false, message: error.response?.data?.message || 'An error occurred' };
        }
    },
    async getRestaurants() {
        try {
            const response = await axios.get(RESTAURANT_URL);
            return response.data; // Retorna la lista de restaurantes
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            return [];
        }
    }
};
