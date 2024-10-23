import axios from "axios";

const API_URL = 'http://localhost:3000/restaurants';

export const productsService = {
    async getProductsByRestaurant(restaurantName) {
        try {
            const response = await axios.get(API_URL);
            const restaurant = response.data.find(restaurant => restaurant['business-name'] === restaurantName);
            if (restaurant) {
                console.log(restaurant.products);
                return restaurant.products || [];  // Inicializa como arreglo si no existe
            } else {
                throw new Error('Restaurant not found');
            }
        } catch (error) {
            console.error("Error fetching products: ", error);
            throw error;
        }
    },

    async addProduct(restaurantName, product) {
        try {
            const response = await axios.get(API_URL);
            const restaurant = response.data.find(r => r['business-name'] === restaurantName);

            if (restaurant) {
                const lastProduct = restaurant.products[restaurant.products.length - 1];
                const newId = lastProduct ? lastProduct.id + 1 : 1;
                product.id = newId;

                restaurant.products.push(product);
                await axios.put(`${API_URL}/${restaurant.id}`, restaurant);

                // Devolver respuesta con éxito
                return { success: true, message: "Product created successfully" };
            }
        } catch (error) {
            console.error("Error adding product: ", error);
            return { success: false, message: error.message };
        }
    },

    async updateProduct(restaurantName, product) {
        try {
            const response = await axios.get(API_URL);
            const restaurant = response.data.find(r => r['business-name'] === restaurantName);

            if (restaurant) {
                const index = restaurant.products.findIndex(p => p.id === product.id);

                if (index !== -1) {
                    restaurant.products.splice(index, 1, product);
                    await axios.put(`${API_URL}/${restaurant.id}`, restaurant);

                    // Devolver respuesta con éxito
                    return { success: true, message: "Product updated successfully" };
                } else {
                    return { success: false, message: "Product not found" };
                }
            }
        } catch (error) {
            console.error("Error updating product: ", error);
            return { success: false, message: error.message };
        }
    },

    async deleteProduct(restaurantName, productId) {
        try {
            const response = await axios.get(API_URL);
            const restaurant = response.data.find(r => r['business-name'] === restaurantName);

            if (restaurant) {
                const index = restaurant.products.findIndex(p => p.id === productId);

                if (index !== -1) {
                    restaurant.products.splice(index, 1);
                    await axios.put(`${API_URL}/${restaurant.id}`, restaurant);

                    // Devolver respuesta con éxito
                    return { success: true, message: "Product deleted successfully" };
                } else {
                    return { success: false, message: "Product not found" };
                }
            } else {
                return { success: false, message: "Restaurant not found" };
            }
        } catch (error) {
            console.error("Error deleting product: ", error);
            return { success: false, message: error.message };
        }
    }
};
