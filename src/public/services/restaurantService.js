// services/restaurantService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/restaurants'; // Ajusta según tu configuración

const getRestaurantByName = async (businessName) => {
    const response = await axios.get(`${API_URL}?business-name=${businessName}`);

    // Asegúrate de que haya al menos un restaurante en la respuesta
    if (response.data.length > 0) {
        const { id, 'business-name': businessName, email, phone } = response.data[0];

        // Muestra la respuesta del restaurante en la consola
        console.log("Response from API (filtered):", { id, businessName, email, phone });

        // Devuelve solo los campos relevantes
        return { id, 'business-name': businessName, email, phone };
    } else {
        console.log("No restaurant found with the given name.");
        return null; // O maneja el error según necesites
    }
};


const getRestaurantByBusinessName = async (businessName) => {
    const response = await axios.get(`${API_URL}?business-name=${businessName}`);

    // Verifica si hay restaurantes en la respuesta
    if (response.data.length > 0) {
        return response.data[0]; // Devuelve el primer restaurante que coincide
    } else {
        console.warn("No restaurant found with the given name.");
        return null; // Devuelve null si no se encuentra ningún restaurante
    }
};


const updateRestaurantByBusinessName = async (businessName, updatedDetails) => {
    // Obtiene el restaurante existente
    const restaurant = await getRestaurantByBusinessName(businessName);

    if (!restaurant) {
        throw new Error('Restaurante no encontrado');
    }

    // Crea un nuevo objeto con los campos actualizados
    const updatedRestaurant = {
        ...restaurant, // Conserva todos los campos originales
        "business-name": updatedDetails["business-name"],
        email: updatedDetails.email,
        phone: updatedDetails.phone,
        password: updatedDetails.password // Se actualiza la contraseña
    };

    // Envía la solicitud de actualización con los nuevos detalles
    await axios.put(`${API_URL}/${restaurant.id}`, updatedRestaurant);
    return updatedRestaurant; // Devuelve el restaurante actualizado
};



export default {
    getRestaurantByName,
    updateRestaurantByBusinessName,
};
