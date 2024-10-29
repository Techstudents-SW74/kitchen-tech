<template>
  <div class="layout">
    <sidebar-component :restaurant-name="restaurantName" :role="userRole" class="sidebar" />
    <div class="main-content">
      <header-component :restaurant-name="restaurantName" :role="userRole" class="header" />
      <div class="page-container">
        <h1>Edit User Details</h1>
        <!-- <form @submit.prevent="updateUser" class="form">
          <div class="form-group">
            <label for="username">Username:</label>
            <input type="text" id="username" v-model="userData.username" required />
          </div>
          <div class="form-group">
            <label for="first-name">First Name:</label>
            <input type="text" id="first-name" v-model="userData.firstName" required />
          </div>
          <div class="form-group">
            <label for="last-name">Last Name:</label>
            <input type="text" id="last-name" v-model="userData.lastName" required />
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="userData.email" required />
          </div>
          <div class="form-group">
            <label for="phone">Phone:</label>
            <input type="tel" id="phone" v-model="userData.phone" required />
          </div>
          <button type="submit" class="submit-button">Update</button>
        </form> -->
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from "@/admins/components/header-component.vue";
import SidebarComponent from "@/admins/components/sidebar-component.vue";
import userService from "@/public/services/userService";

export default {
  components: {
    HeaderComponent,
    SidebarComponent,
  },
  data() {
    return {
      restaurantName: '',
      userRole: '',
    };
  },
  mounted() {
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const restaurantId = userData?.restaurantId;

        if (restaurantId) {
          const restaurantData = await userService.getRestaurantById(restaurantId);
          this.restaurantName = restaurantData.name;
          this.userRole = userData.role;
        }
      } catch (error) {
        console.error("Error fetching restaurant data: ", error);
      }
    },

    /*async updateUser() {
      try {
        // Crea un objeto para almacenar los detalles actualizados, usando los valores actuales
        const updatedDetails = {
          username: this.userData.username,
          firstName: this.userData.firstName,
          lastName: this.userData.lastName,
          email: this.userData.email,
          phone: this.userData.phone,
          birthDate: this.userData.birthDate, // Este campo debe existir en userDetails
          photo: this.userData.photo, // Este campo también debe existir en userDetails
          role: "USER", // Rol fijo
          restaurant: {
            id: this.userData.restaurant.id, // El ID del restaurante se obtiene del objeto
          },
        };

        // Muestra en la consola los detalles que se enviarán
        console.log("Datos enviados a la API:", updatedDetails);

        // Realiza la llamada a la API
        await userService.updateUserById(this.userData.id, updatedDetails);
        alert("User details updated successfully!");
      } catch (error) {
        console.error("Error updating user details:", error);
      }
    },*/
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
