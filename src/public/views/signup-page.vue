<template>
  <div class="card-container">
    <div class="card">
      <div class="card-header">
        <img class="logo" src="../../../public/assets/images/logo.png" alt="brand logo"/>
        <p class="card-title">Sign Up</p>
      </div>

      <form @submit.prevent="onSubmit" class="signup-form">
        <!-- Row para businessName-->
        <div class="form-row">
          <div class="form-field">
            <label for="businessName">Business Name</label>
            <input type="text" id="businessName" v-model="businessName" placeholder="Ex. La Bisteca" />
            <span v-if="!businessName && businessNameTouched">Business Name is required</span>
          </div>
        </div>

        <!-- Row para email y phone -->
        <div class="form-row">
          <div class="form-field">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" placeholder="Ex. admin@labisteca.com" />
            <span v-if="!email && emailTouched">Email is required</span>
            <span v-if="email && !isValidEmail">Please enter a valid Email</span>
          </div>

          <div class="form-field">
            <label for="phone">Phone</label>
            <input type="tel" id="phone" v-model="phone" placeholder="Ex. 987654321" />
            <span v-if="!phone && phoneTouched">Phone number is required</span>
            <span v-if="phone && !isValidPhone">Please enter a valid phone number</span>
          </div>
        </div>

        <!-- Row para password y confirm password -->
        <div class="form-row">
          <div class="form-field">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" placeholder="Create your password" />
            <span v-if="!password && passwordTouched">Password is required</span>
            <span v-if="password.length > 0 && password.length < 6">Password must have at least 6 characters</span>
          </div>

          <div class="form-field">
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="Confirm your password" />
            <span v-if="!confirmPassword && confirmPasswordTouched">Please enter your password again</span>
            <span v-if="confirmPassword && !passwordsMatch">Passwords don't match</span>
          </div>
        </div>

        <!-- Botón de registro -->
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
      businessName: '',
      businessNameTouched: false,
      email: '',
      emailTouched: false,
      phone: '',
      phoneTouched: false,
      password: '',
      passwordTouched: false,
      confirmPassword: '',
      confirmPasswordTouched: false,
    };
  },
  computed: {
    isValidEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(this.email);
    },
    isValidPhone() {
      const phonePattern = /^\d{9}$/;
      return phonePattern.test(this.phone);
    },
    passwordsMatch() {
      return this.password === this.confirmPassword;
    },
    isValidForm() {
      const valid = this.businessName && this.email && this.isValidEmail && this.isValidPhone && this.passwordsMatch && this.password.length >= 6;
      return valid;
    }
  },
  methods: {
    async onSubmit() {
      this.businessNameTouched = true;
      this.emailTouched = true;
      this.phoneTouched = true;
      this.passwordTouched = true;
      this.confirmPasswordTouched = true;

      if (this.isValidForm) {
        const adminData = {
          businessName: this.businessName,
          email: this.email,
          phone: this.phone,
          password: this.password,
        };

        try {
          const response = await authService.signup(adminData);

          if (response.success) {
            this.$router.push('/login');
          } else {
            alert(response.message);
          }
        } catch (error) {
          console.error('Error during signup process:', error); // Log de error
          alert('An error occurred: ' + error.message);
        }
      } else {
        console.warn('Form is invalid, submission blocked.'); // Log de advertencia
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

.dropdown-form-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width: 100%;
  font-weight: 700;
  color: #31304A;
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

