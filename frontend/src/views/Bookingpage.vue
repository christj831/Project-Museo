<template>
  <div class="wrapper">
    <Sidebar />
    <div class="container my-5">
      <h2 class="text-center mb-4">Visit Booking Form</h2>

      <!-- Display user_id for verification -->
      <p v-if="form.userId">User ID: {{ form.userId }}</p>

      <form @submit.prevent="submitForm" class="border p-4 rounded bg-light shadow">
        <!-- Visit Date -->
        <div class="mb-3">
          <label for="visit_date" class="form-label">Visit Date</label>
          <input
            type="date"
            class="form-control"
            id="visit_date"
            v-model="form.visitDate"
            :min="minDate"
            required
          />
        </div>

        <!-- Booking Time -->
        <div class="mb-3">
          <label for="booking_time" class="form-label">Booking Time (45-minute intervals between 8:00 AM and 4:30 PM)</label>
          <select
            class="form-select"
            id="booking_time"
            v-model="form.bookingTime"
            required
          >
            <option value="" disabled>Select a time</option>
            <option v-for="time in timeOptions" :key="time" :value="time">
              {{ time }}
            </option>
          </select>
        </div>

        <!-- Number of Guests -->
        <div class="mb-3">
          <label for="number_of_guests" class="form-label">Number of Guests</label>
          <input
            type="number"
            class="form-control"
            id="number_of_guests"
            v-model.number="form.numberOfGuests"
            min="1"
            required
          />
        </div>

        <!-- Accessibility Needs -->
        <div class="mb-3 form-check">
          <input
            type="checkbox"
            class="form-check-input"
            id="accessibility_needs"
            v-model="form.accessibilityNeeds"
          />
          <label class="form-check-label" for="accessibility_needs">
            Accessibility Needs: Check if any accommodations are required (e.g., guided tours, wheelchair access).
          </label>
        </div>

        <!-- Agree to Rules -->
        <div class="mb-3 form-check">
          <input
            type="checkbox"
            class="form-check-input"
            id="agree_rules"
            v-model="form.agreeRules"
            required
          />
          <label class="form-check-label" for="agree_rules">
            I agree to the museum's rules and guidelines for visits, including respecting the artifacts and following staff instructions.
          </label>
        </div>

        <!-- Submit Button -->
        <div class="text-center">
          <button type="submit" class="btn btn-primary w-100">Book Visit</button>
        </div>
      </form>

      <!-- Success Modal -->
      <div v-if="modalVisible" class="modal fade show" style="display: block;" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Booking Status</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeModal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>{{ message }}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
  
<script>
import axios from 'axios';
import CryptoJS from 'crypto-js'; // Import crypto-js
import Sidebar from '@/components/Sidebar.vue';

export default {
  components: {
    Sidebar,
  },
  data() {
    return {
      form: {
        userId: '',  // Initialize userId here
        visitDate: "",
        bookingTime: "",
        numberOfGuests: 1,
        accessibilityNeeds: false,
        agreeRules: false,
      },
      minDate: "",
      timeOptions: [
        "08:00 AM", "08:45 AM", "09:30 AM", "10:15 AM", 
        "11:00 AM", "11:45 AM", "12:30 PM", "01:15 PM", 
        "02:00 PM", "02:45 PM", "03:30 PM", "04:15 PM",
      ],
      message: '',
      modalVisible: false, // Control modal visibility
    };
  },
  created() {
    const decryptedUserId = CryptoJS.AES.decrypt(localStorage.getItem('user_id'), 'asdasd').toString(CryptoJS.enc.Utf8);
    this.form.userId = decryptedUserId;
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    this.minDate = `${year}-${month}-${day}`;
  },
  methods: {
    async submitForm() {
      if (!this.form.agreeRules) {
        alert("You must agree to the museum's rules to book a visit.");
        return;
      }

      try {
        // Check if there is already a pending booking for the user
        const response = await axios.get(`http://localhost:3000/api/auth/bookings/${this.form.userId}`);
        const pendingBooking = response.data.find(booking => booking.booking_status === 'pending');

        if (pendingBooking) {
          // If there is a pending booking, inform the user and prevent the new booking
          this.message = "You already have a pending booking. Please wait for it to be processed.";
          this.modalVisible = true; // Show the modal
          return;
        }

        // If no pending booking, proceed with the booking
        const bookingData = {
          user_id: this.form.userId,
          visit_date: this.form.visitDate,
          booking_time: this.form.bookingTime,
          number_of_guests: this.form.numberOfGuests,
          booking_status: "Pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const submitResponse = await axios.post('http://localhost:3000/api/auth/booked', bookingData);

        this.message = submitResponse.data || "Booking successfully submitted!";
        this.modalVisible = true; // Show the modal
        this.resetForm();
      } catch (error) {
        this.message = error.response?.data || "Failed to submit booking.";
        this.modalVisible = true; // Show the modal
      }
    },

    resetForm() {
      this.form = {
        userId: this.form.userId, // Keep userId after reset
        visitDate: "",
        bookingTime: "",
        numberOfGuests: 1,
        accessibilityNeeds: false,
        agreeRules: false,
      };
    },

    closeModal() {
      this.modalVisible = false; // Close the modal
    },
  },
};
</script>
  
<style scoped>
.container {
  max-width: 600px;
}

.modal {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1050;
}

.modal-dialog {
  max-width: 500px;
  margin: 15% auto;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
}

.modal-header {
  border-bottom: 1px solid #e9ecef;
}

.modal-footer {
  border-top: 1px solid #e9ecef;
}
</style>
  