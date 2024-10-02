import axios from "axios";

const API_URL = 'http://localhost:3000/restaurants';

export const productsService = {
    async getProductsByRestaurant(restaurantName) {
        try {
            const response = await axios.get(API_URL);
            const restaurant = response.data.find(restaurant => restaurant['business-name'] === restaurantName);
            if (restaurant) {
                return restaurant.products;
            } else {
                throw new Error('Restaurant not found');
            }
        } catch (error) {
            console.error("Error fetching products: ", error);
            throw error;
        }
    }
};