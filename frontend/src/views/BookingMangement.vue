<template>
    <div>
      <h1>Visit Bookings</h1>
      <table border="1" style="width: 100%; text-align: left;">
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Visit Date</th>
            <th>Booking Time</th>
            <th>Guests</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in bookings" :key="booking.booking_id">
            <td>{{ booking.booking_id }}</td>
            <td>{{ booking.user_id }}</td>
            <td>{{ booking.visit_date }}</td>
            <td>{{ booking.booking_time }}</td>
            <td>{{ booking.number_of_guests }}</td>
            <td>{{ booking.booking_status }}</td>
            <td>
              <button @click="updateStatus(booking.booking_id, 'accepted')">Accept</button>
              <button @click="updateStatus(booking.booking_id, 'decline')">Decline</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        bookings: []
      };
    },
    methods: {
      fetchBookings() {
        axios.get('http://localhost:3000/api/auth/bookings')
          .then((response) => {
            this.bookings = response.data;
          })
          .catch((error) => {
            console.error('Error fetching bookings:', error);
          });
      },
      updateStatus(id, status) {
        axios.put(`http://localhost:3000/api/auth/bookings/${id}`, { booking_status: status })
          .then(() => {
            this.fetchBookings();
          })
          .catch((error) => {
            console.error('Error updating status:', error);
          });
      }
    },
    mounted() {
      this.fetchBookings();
    }
  };
  </script>
  
  <style>
  table {
    border-collapse: collapse;
    margin: 20px 0;
  }
  th, td {
    padding: 10px;
    border: 1px solid #ddd;
  }
  button {
    margin-right: 5px;
    padding: 5px 10px;
    cursor: pointer;
  }
  </style>
  