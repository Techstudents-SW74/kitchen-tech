<template>
  <div class="card-container">
    <div class="card">
      <div class="card-header">
        <img class="logo" src="../../../public/assets/images/logo.png" alt="brand logo"/>
        <p class="card-title">Sign Up</p>
      </div>

      <form @submit.prevent="onSubmit" class="signup-form">
        <div class="form-row">
          <div class="form-field">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="username" placeholder="Ex. fcastr234123o" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-field">
            <label for="firstName">First Name</label>
            <input type="text" id="firstName" v-model="firstName" placeholder="Ex. Fabrizzio" required />
          </div>
          <div class="form-field">
            <label for="lastName">Last Name</label>
            <input type="text" id="lastName" v-model="lastName" placeholder="Ex. Castro" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-field">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" placeholder="Ex. email@example.com" required />
          </div>
          <div class="form-field">
            <label for="phone">Phone</label>
            <input type="tel" id="phone" v-model="phone" placeholder="Ex. 904688149" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-field">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" placeholder="Create your password" required />
          </div>
          <div class="form-field">
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="Confirm your password" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-field">
            <label for="birthDate">Birth Date</label>
            <input type="date" id="birthDate" v-model="birthDate" required />
          </div>
          <div class="form-field">
            <label for="restaurant">Restaurant</label>
            <select v-model="selectedRestaurantId" required>
              <option value="" disabled>Select a restaurant</option>
              <option v-for="restaurant in restaurants" :key="restaurant.id" :value="restaurant.id">
                {{ restaurant.name }}
              </option>
            </select>
          </div>
        </div>

        <button class="signup-button" type="submit">Sign Up</button>

        <div class="login-redirect">
          <router-link to="/login">Already have an account? Login</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import authService from "@/public/services/authService"

export default {
  data() {
    return {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      birthDate: '',
      selectedRestaurantId: null,
      restaurants: [] // Lista de restaurantes
    };
  },
  async created() {
    this.restaurants = await authService.getRestaurants(); // Cargar los restaurantes al crear el componente
  },
  methods: {
    async onSubmit() {
      const userData = {
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        phone: this.phone,
        birthDate: this.birthDate,
        photo: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png", // Puedes cambiar esto si quieres que el usuario ingrese una foto
        role: "USER",
        restaurant: { id: this.selectedRestaurantId }
      };

      try {
        const response = await authService.signup(userData);
        if (response.success) {
          this.$router.push('/login');
        } else {
          alert(response.message);
        }
      } catch (error) {
        console.error('Error during signup process:', error);
        alert('An error occurred: ' + error.message);
      }
    },
  }
};
</script>


<style scoped>
.card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #F6F5FA;
  font-family: 'Red-hat-display', sans-serif;
}
.card {
  width: 100%;
  max-width: 600px;
  background-color: #D3D2E5;
  color: #F6F5FA;
  padding: 50px 80px;
  border-radius: 10px;
  box-sizing: border-box;
}

.card-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-bottom: 30px;
}
.logo{
  width: 150px;
}
.card-title {
  margin: 0;
  font-size: 2.4rem;
  font-weight: 800;
  color: #31304A;
}

.form-field {
  width: 100%;
  margin-bottom: 20px;
}
.form-field label {
  font-weight: 700;
  color: #31304A;
}
.form-field input {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  color: #31304A;
  margin: 10px 0;
  font-weight: 500;
  box-sizing: border-box;
}
span {
  color: #b14343;
  font-size: 0.8rem;
  margin-left: 5px;
}

.dropdown-form-field select {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  color: #31304A;
  margin: 10px 0;
  font-weight: 500;
  box-sizing: border-box;
}

.form-row {
  display: flex;
  gap: 20px;
}
.form-row .form-field {
  flex: 1;
}

.signup-button {
  width: 100%;
  margin: 0 0 16px 0;
  color: #F6F5FA;
  padding: 24px;
  background: #31304A;
  font-weight: 500;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
}
.login-redirect {
  text-align: right;
  margin-right: 5px;
}
.login-redirect a {
  color: #31304A;
}
</style>

