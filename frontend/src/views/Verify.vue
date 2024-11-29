<template>
    <div>
      <h2>Email Verification</h2>
      <p>{{ message }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        message: 'Verifying your email...',
      };
    },
    async created() {
      const token = this.$route.query.token;
      try {
        const response = await axios.get(`http://localhost:3000/api/auth/verify-email?token=${token}`);
        this.message = response.data;
      } catch (error) {
        this.message = 'Invalid or expired verification link';
      }
    }
  };
  </script>
  