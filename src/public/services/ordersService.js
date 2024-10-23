import axios from "axios";

const API_URL = 'http://localhost:3000/restaurants';

export const ordersService = {
    async getOrdersByRestaurant(restaurantName) {
        try {
            const response = await axios.get(API_URL);
            const restaurant = response.data.find(restaurant => restaurant['business-name'] === restaurantName);
            if (restaurant) {
                console.log(restaurant.orders);
                return restaurant.orders || [];
            } else {
                throw new Error('Restaurant not found');
            }

        } catch (error) {
            console.error("Error fetching orders: ", error);
            throw error;
        }
    },

    async addOrder(restaurantName, order) {
        try {
            const response = await axios.get(API_URL);
            const restaurant = response.data.find(r => r['business-name'] === restaurantName);

            if (restaurant) {
                const lastOrder = restaurant.orders[restaurant.orders.length - 1];
                const newId = lastOrder ? lastOrder.id + 1 : 1;
                order.id = newId;

                restaurant.orders.push(order);
                await axios.put(`${API_URL}/${restaurant.id}`, restaurant);

                return {success: true, message: "Order created successfully"};
            }
        } catch (error) {
            console.error("Error adding order: ", error);
            return {success: false, message: error.message};
        }
    },

    async updateOrder(restaurantName, order) {
        try {
            const response = await axios.get(API_URL);
            const restaurant = response.data.find(r => r['business-name'] === restaurantName);

            if (restaurant) {
                const index = restaurant.orders.findIndex(p => p.id === order.id);

                if (index !== -1) {
                    restaurant.orders.splice(index, 1, order);
                    await axios.put(`${API_URL}/${restaurant.id}`, restaurant);

                    return {success: true, message: "Order updated successfully"}
                } else {
                    return {success: false, message: "Order not found"};
                }
            }
        } catch (error) {
            console.error("Error updating order: ", error);
            return {success: false, message: error.message}
        }
    },

    async deleteOrder(restaurantName, orderId) {
        try {
            const response = await axios.get(API_URL);
            const restaurant = response.data.find(r => r['business-name'] === restaurantName);

            if (restaurant) {
                const index = restaurant.orders.findIndex(p => p.id === orderId);

                if (index !== -1) {
                    restaurant.orders.splice(index, 1);
                    await axios.put(`${API_URL}/${restaurant.id}`, restaurant);

                    // Devolver respuesta con éxito
                    return {success: true, message: "Order deleted successfully"};
                } else {
                    return {success: false, message: "Order not found"};
                }
            } else {
                return {success: false, message: "Restaurant not found"};
            }
        } catch (error) {
            console.error("Error deleting order: ", error);
            return {success: false, message: error.message};
        }
    }
}