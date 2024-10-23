<template>
  <div class="card-container">
    <div class="card">
      <div class="card-header">
        <img class="logo" src="../../../public/assets/images/logo.png" alt="brand-logo"/>
        <p class="card-title">Sign In</p>
      </div>

      <!-- Formulario para el username -->
      <form @submit.prevent="onSubmit">
        <!-- Input para el username -->
        <div class="form-field">
          <label for="username">Username</label>
          <input
              type="text"
              id="username"
              v-model="username"
              placeholder="Ex. fcastro"
          />
          <span v-if="!username && usernameTouched">Please enter your username</span>
        </div>

        <!-- Input para la contraseña -->
        <div class="form-field">
          <label for="password">Password</label>
          <input
              type="password"
              id="password"
              v-model="password"
              placeholder="Enter your password"
          />
          <span v-if="!password && passwordTouched">Please enter a password</span>
          <span v-if="password.length > 0 && password.length < 6">Your password must have at least 6 characters</span>
        </div>

        <button class="login-button" type="submit">Sign In</button>
        <div class="signup-redirect">
          <router-link to="/signup">Don't have an account? Sign up</router-link>
        </div>
        <p v-if="loginError" class="error-message">{{ loginError }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import authService from "@/public/services/authService";

export default {
  data() {
    return {
      username: '',  // Cambiamos de 'email' a 'username'
      usernameTouched: false,
      password: '',
      passwordTouched: false,
      loginError: null
    };
  },
  methods: {
    async onSubmit() {
      this.usernameTouched = true;
      this.passwordTouched = true;

      // Verificamos que el username y la password sean válidos
      if (this.username && this.password.length >= 6) {
        try {
          // Llamamos al servicio de autenticación pasando 'username' y 'password'
          const response = await authService.login(this.username, this.password);

          if (response.success) {
            // Guardamos el token en localStorage
            localStorage.setItem('token', response.token);

            // Guardamos el id en localStorage
            localStorage.setItem('userData', JSON.stringify({ id: response.id }));

            // Redirigir a la vista deseada después del login
            const basePath = `/${this.username}/${response.role}`;
            localStorage.setItem('userData', JSON.stringify({ username: this.username, id: response.id, role: response.role }));
            this.$router.push(`${basePath}/casing`);
          } else {
            this.loginError = response.message;
          }
        } catch (error) {
          this.loginError = 'An error occurred. Please try again';
        }
      }
    }
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
.form-field span {
  color: #b14343;
  font-size: 0.8rem;
  margin-left: 5px;
}

.login-button {
  width: 100%;
  margin: 0 0 16px 0;
  color: #F6F5FA;
  padding: 16px;
  background: #31304A;
  font-weight: 500;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  box-sizing: border-box;
}
.signup-redirect {
  text-align: right;
  margin-right: 5px;
}
.signup-redirect a {
  color: #31304A;
}
.error-message{
  color: #b14343;
  font-size: 0.8rem;
  margin-left: 5px;
}
</style>
