<template>
  <div class="layout">
    <sidebar-component :restaurant-name="restaurantName" :role="userRole" class="sidebar" />
    <div class="main-content">
      <header-component :restaurant-name="restaurantName" :role="userRole" class="header" />
      <div class="page-container">
        <h1>Add New Waiter</h1>
        <div class="content-split">
          <!-- Sección izquierda: Formulario -->
          <div class="form-container">
            <form @submit.prevent="addWaiter" class="form">
              <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" id="name" v-model="waiter.name" required />
              </div>
              <div class="form-group">
                <label for="lastname">Last Name:</label>
                <input type="text" id="lastname" v-model="waiter.lastname" required />
              </div>
              <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="waiter.email" required />
              </div>
              <div class="form-group">
                <label for="phone">Phone:</label>
                <input type="tel" id="phone" v-model="waiter.phone" required />
              </div>
              <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="waiter.password" required />
              </div>
              <button type="submit" class="submit-button">Add Waiter</button>
            </form>
          </div>
          <!-- Sección derecha: Imagen -->
          <div class="image-container">
            <img src="../../../../public/assets/images/create-waiter.svg" alt="Waiter Illustration" class="waiter-image" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from "@/admins/components/header-component.vue";
import SidebarComponent from "@/admins/components/sidebar-component.vue";
import restaurantService from "@/public/services/userService";

export default {
  components: {
    HeaderComponent,
    SidebarComponent,
  },
  data() {
    return {
      restaurantName: '',
      userRole: '',
      waiter: {
        name: '',
        lastname: '',
        email: '',
        phone: '',
        password: ''
      },
    };
  },
  mounted() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      this.restaurantName = userData['business-name'];
      this.userRole = userData.role;
    }
  },
  methods: {
    async addWaiter() {
      try {
        await restaurantService.addWaiterToRestaurant(this.restaurantName, this.waiter);
        alert("Waiter added successfully!");
        this.waiter = { name: '', lastname: '', email: '', phone: '', password: '' };
      } catch (error) {
        console.error("Error adding waiter:", error);
        alert("There was an error adding the waiter.");
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
  left: 280px;
  width: calc(100% - 280px);
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

.content-split {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-top: 20px;
}

.form-container {
  flex: 1;
}

.image-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.waiter-image {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
