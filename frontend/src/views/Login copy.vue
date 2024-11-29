<!-- src/views/Login.vue
<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" id="email" v-model="email" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" id="password" v-model="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
    <p v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async handleLogin() {
      try {
        // Make API call to check if the user exists and validate password
        const response = await axios.post('http://localhost:3000/api/auth/login', {
          email: this.email,
          password: this.password,
        });

        if (response.status === 200) {
          localStorage.setItem('auth_token', response.data.token);
          localStorage.setItem('user_name', response.data.user.name);
          localStorage.setItem('user_email', response.data.user.email);
      
          console.log('Token saved:', response.data.token);
      
          this.$router.push('/homepage').catch((err) => {
  console.error('Router Error:', err);
});  // Redirect to dashboard after successful login
        }
      } catch (error) {
        console.error('Login Error:', error);
        this.errorMessage = 'Invalid email or password.';
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
 -->


 <template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" id="email" v-model="email" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" id="password" v-model="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
    <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
  </div>
</template>

<script>
import axios from 'axios';
import CryptoJS from 'crypto-js'; // Import crypto-js

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', {
          email: this.email,
          password: this.password,
        });

        if (response.status === 200) {
          const { token, user } = response.data;
          const encryptedRole = CryptoJS.AES.encrypt(user.role, 'asdasd').toString();
          const encryptedEmail = CryptoJS.AES.encrypt(user.email, 'asdasd').toString();
          const encryptedName = CryptoJS.AES.encrypt(user.name, 'asdasd').toString();
          const encryptedUserId = CryptoJS.AES.encrypt(user.userid.toString(), 'asdasd').toString();

          // Store encrypted data in localStorage
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_role', encryptedRole);
          localStorage.setItem('user_email', encryptedEmail);
          localStorage.setItem('user_name', encryptedName);
          localStorage.setItem('user_id', encryptedUserId);

          if (user.profile_picture) {
            localStorage.setItem('profile_picture', user.profile_picture);
          }

          // Redirect based on role
          if (user.role === 'user') {
            this.$router.push({ path: '/homepage', query: { token } });
          } else if (user.role === 'admin') {
            this.$router.push({ path: '/admin-dashboard', query: { token } });
          }
        }
      } catch (error) {
        this.errorMessage = 'Invalid email or password.';
        console.error('Login error:', error);
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
