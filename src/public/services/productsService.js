import axiosInstance from "./axiosConfig";

const API_URL = '/product';

export const productsService = {
    async getProductsByRestaurant(restaurantId) {
        try {
            const response = await axiosInstance.get(`${API_URL}/restaurant/${restaurantId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },
    async deleteProduct(productId) {
        try {
            const response = await axiosInstance.delete(`${API_URL}/${productId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },
    async updateProduct(product) {
        const response = await axiosInstance.put(`${API_URL}/${product.id}`, {
            id: product.id,
            productName: product.productName,
            productPrice: product.productPrice,
            productImageUrl: product.productImageUrl,
            category: product.category,
            restaurantId: product.restaurantId,
        });
        return response.data;
    },
    async addProduct(product) {
        try {
            const response = await axiosInstance.post(`${API_URL}`, {
                productName: product.productName,
                productPrice: product.productPrice,
                productImageUrl: product.productImageUrl,
                category: product.category,
                restaurantId: product.restaurantId,
            });
            if (response.status === 201) {
                return response.data;
            } else {
                throw new Error('Error creating product');
            }
        } catch (error) {
            console.error('Error in addProduct:', error.response ? error.response.data : error.message);
            throw error; // Lanza el error para que lo manejes donde llames a esta función
        }
    },
    async getProductById(productId) {
        const response = await axiosInstance.get(`${API_URL}/${productId}`);
        return response.data;
    }
};
