<template>
  <div class="layout">
    <sidebar-component :restaurant-name="restaurantName" :role="userRole" class="sidebar" />
    <div class="main-content">
      <header-component :restaurant-name="restaurantDetails['business-name']" :role="userRole" class="header" />
      <div class="page-container">
        <h1>Edit Restaurant Details</h1>
        <form @submit.prevent="updateRestaurant" class="form">
          <div class="form-group">
            <label for="business-name">Business Name:</label>
            <input
                type="text"
                id="business-name"
                v-model="restaurantDetails['business-name']"
                disabled
                required
            />
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="restaurantDetails.email" required />
          </div>
          <div class="form-group">
            <label for="phone">Phone:</label>
            <input type="tel" id="phone" v-model="restaurantDetails.phone" required />
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="newPassword" required />
          </div>
          <div class="form-group">
            <label for="repeat-password">Repeat Password:</label>
            <input type="password" id="repeat-password" v-model="repeatPassword" required />
          </div>
          <button type="submit" class="submit-button">Update</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from "@/admins/components/header-component.vue";
import SidebarComponent from "@/admins/components/sidebar-component.vue";
import restaurantService from "@/public/services/restaurantService";

export default {
  components: {
    HeaderComponent,
    SidebarComponent,
  },
  data() {
    return {
      restaurantDetails: {
        email: '',
        phone: '',
        'business-name': '',
      },
      userRole: '',
      newPassword: '',
      repeatPassword: '',
    };
  },
  mounted() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      this.userRole = userData.role;
      this.loadRestaurantByName(userData['business-name']); // Cargar detalles usando el business-name del usuario
    }
  },
  methods: {
    async loadRestaurantByName(businessName) {
      try {
        const restaurant = await restaurantService.getRestaurantByName(businessName);
        if (restaurant) {
          console.log("Loaded restaurant:", restaurant);
          this.restaurantDetails = restaurant; // Asigna los datos del restaurante
        } else {
          console.warn("Restaurant not found.");
        }
      } catch (error) {
        console.error("Error loading restaurant by name:", error);
      }
    },
    async updateRestaurant() {
      if (this.newPassword !== this.repeatPassword) {
        alert("Passwords do not match!");
        return;
      }
      try {
        // Prepara los detalles actualizados
        const updatedDetails = {
          "business-name": this.restaurantDetails["business-name"],
          email: this.restaurantDetails.email,
          phone: this.restaurantDetails.phone,
          password: this.newPassword
        };

        // Actualiza el restaurante usando el business-name
        await restaurantService.updateRestaurantByBusinessName(this.restaurantDetails["business-name"], updatedDetails);
        alert("Restaurant details updated successfully!");
      } catch (error) {
        console.error("Error updating restaurant details:", error);
      }
    },
  },
}
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 280px;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: #31304A;
}

.main-content {
  margin-left: 280px;
  width: calc(100% - 280px);
  display: flex;
  flex-direction: column;
}

.header {
  position: fixed;
  top: 0;
  background-color: #5E5E99;
  z-index: 1;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.page-container {
  font-family: 'Red-hat-display', sans-serif;
  font-weight: 100;
  margin-top: 100px;
  padding: 20px;
  background-color: #F6F5FA;
  height: calc(100vh - 100px);
  overflow-y: auto;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.form-group input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.submit-button {
  background-color: #5E5E99;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #4b4a85;
}
</style>
