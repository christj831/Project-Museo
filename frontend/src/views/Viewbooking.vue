<template>
    <div class="booking-container">
      <h2>Your Bookings</h2>
      
      <!-- Bookings Table -->
      <table v-if="bookings.length > 0" class="booking-table">
        <thead>
          <tr>
            <th>Booking id</th>
            <th>Visit Date</th>
            <th>Booking Time</th>
            <th>Number of Guests</th>
            <th>Booking Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(booking, index) in bookings" :key="index">
            <td>{{ booking.booking_id }}</td>
            <td>{{ booking.visit_date }}</td>
            <td>{{ booking.booking_time }}</td>
            <td>{{ booking.number_of_guests }}</td>
            <td>{{ booking.booking_status }}</td>
            <td>
            <!-- Cancel Button -->
            <button @click="cancelBooking(booking.booking_id, index)" class="cancel-button">
              Cancel
            </button>
          </td>
          </tr>
        </tbody>
      </table>
  
      <!-- If no bookings are found -->
      <p v-else>No bookings found.</p>
  
      <!-- Error Messages -->
      <div v-if="errorMessage" class="error-message">
        <p>{{ errorMessage }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        bookings: [],        // Holds the list of bookings
        errorMessage: ''     // To store any error messages
      };
    },
    methods: {
      // Fetch bookings for the user
      async fetchBookings() {
        const token = localStorage.getItem('auth_token'); // Assuming JWT token is stored in localStorage
  
        try {
          const response = await axios.get('http://localhost:3000/api/auth/view', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.bookings = response.data.bookings;
        } catch (error) {
          this.errorMessage = 'Failed to fetch bookings.';
          console.error('Error fetching bookings:', error);
        }
      },
      async cancelBooking(bookingId, index) {
  const token = localStorage.getItem('auth_token'); // Get the JWT token

  try {
    // DELETE request to cancel the booking
    const response = await axios.delete(`http://localhost:3000/api/auth/cancel/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}` // Attach token to the header
      }
    });

    // If cancellation is successful, remove the booking from the list
    this.bookings.splice(index, 1);
    console.log(response.data.message); // Log the success message
  } catch (error) {
    // Handle the error
    this.errorMessage = 'Failed to cancel booking.';
    console.error('Error cancelling booking:', error.response ? error.response.data : error);
  }
}
    },
    
    mounted() {
      this.fetchBookings(); // Fetch bookings when the component is mounted
    }
  };
  </script>
  
  <style scoped>
  .booking-container {
    padding: 20px;
  }
  
  h2 {
    margin-bottom: 20px;
  }
  
  .booking-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  .booking-table th,
  .booking-table td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
  }
  
  .booking-table th {
    background-color: #f4f4f4;
  }
  
  .error-message {
    margin-top: 20px;
    padding: 10px;
    color: white;
    background-color: #f44336;
  }
  </style>
  