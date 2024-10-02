<template>
  <div class="card-container">
    <div class="card">
      <div class="card-header">
        <img class="logo" src="../../../public/assets/images/logo.png" alt="brand-logo"/>
        <p class="card-title">Sign In</p>
      </div>

      <!-- Formulario para el email -->
      <form @submit.prevent="onSubmit">
        <!-- Input para el email -->
        <div class="form-field">
          <label for="email">Email</label>
          <input
              type="email"
              id="email"
              v-model="email"
              placeholder="Ex. fcastro@gmail.com"
          />
          <span v-if="!email && emailTouched">Please enter your email</span>
          <span v-if="email && !isValidEmail">Please enter a valid email address</span>
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
      email: '',
      emailTouched: false,
      password: '',
      passwordTouched: false,
      loginError: null
    };
  },
  computed: {
    isValidEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(this.email);
    }
  },
  methods: {
    async onSubmit() {
      this.emailTouched = true;
      this.passwordTouched = true;

      if (this.email && this.isValidEmail && this.password.length >= 6) {
        try {
          const response = await authService.login(this.email, this.password);

          if(response.success) {
            const restaurantName = response.role === 'admin'
                ? response.user['business-name']
                : response.restaurantId;

            const basePath = `/${restaurantName}/${response.role}`;
            localStorage.setItem('userData', JSON.stringify({ 'business-name': restaurantName, role: response.role }));
            this.$router.push(`${basePath}/casing`);
          } else {
            this.loginError = response.message;
          }
        }catch (error) {
          this.loginError = 'An error ocurred. Please try again';
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
