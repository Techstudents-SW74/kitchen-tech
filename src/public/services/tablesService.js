import axiosInstance from "@/public/services/axiosConfig";
import * as error from "express";

const API_URL = '/table';

const getAuthToken = () => {
    return localStorage.getItem('token');
}

export const tablesService = {
    async getTablesByRestaurant(restaurantId) {
        try {
            const token = getAuthToken();
            const response = await axiosInstance.get(`${API_URL}/restaurant/${restaurantId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching accounts:', error.response ? error.response.data : error.message);
            throw error;
        }
    },
    async deleteTable(tableId) {
        try {
            const token = getAuthToken();
            const response = await axiosInstance.delete(`${API_URL}/${tableId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting table:', error.response ? error.response.data : error.message);
            throw error;
        }
    },
    async addTable(table) {
        try {
            const token = getAuthToken();
            const response = await axiosInstance.post(`${API_URL}`, {
                tableNumber: table.tableNumber,
                tableCapacity: table.tableCapacity,
                tableGuests: table.tableGuests,
                tableStatus: table.tableStatus,
                restaurantId: table.restaurantId,
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 201) {
                return response.data;
            } else {
                throw new Error('Error creating table');
            }
        } catch (errror) {
            console.error('Error adding table:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
}