import axios from "axios";

const API_URL = 'http://localhost:3000/restaurants';

export default {
    async login(email, password) {
        try {
            const response = await axios.get(API_URL);
            const restaurants = response.data; // Ajustar para usar directamente response.data


            for (const restaurant of restaurants) { // Iterar sobre el array directamente
                if (restaurant.email === email && restaurant.password === password) {
                    return { success: true, user: restaurant, role: 'admin' };
                }

                for (const waiter of restaurant.waiters) { // Acceder a los waiters del restaurante actual
                    if (waiter.email === email && waiter.password === password) {
                        return { success: true, user: restaurant, role: 'waiter', restaurantId: restaurant['business-name'] };
                    }
                }
            }
            return { success: false, message: 'Invalid email or password' };
        } catch (error) {
            return { success: false, message: 'An error occurred while trying to login' };
        }
    },

    async signup(adminData){
        try{
            console.log('sign up data received', adminData);

            //Obtiene los datos del API
            const response = await axios.get(API_URL);
            const restaurants = response.data;
            console.log('Current restaurants:', restaurants);

            //Verifica si el restaurante ya esxiste
            const existingRestaurant = restaurants.find(r => r.email === adminData.email);
            if(existingRestaurant) {
                throw new Error('Restaurant with this email already exists');
            }

            //Crear nuevo restaurante
            const newRestaurant = {
                id: restaurants.length + 1,
                "business-name": adminData.businessName,
                email: adminData.email,
                phone: adminData.phone,
                password: adminData.password,
                waiters:[],
                products:[]
            };

            //Guardar los datos actualizados de nuevo en el API
            await axios.post(API_URL, newRestaurant);

            return {success: true, message: 'Restaurant registered successfully'};
        } catch (error) {
            console.error('Error during signup:', error);
            return { success: false, message: error.message };
        }
    }
};