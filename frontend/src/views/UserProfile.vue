<template>
  <div class="profile">
    <h2>User Profile</h2>
    
    <!-- Show error message if image fails to load -->
    <div v-if="imageError">
      <p class="error-message">{{ imageError }}</p>
    </div>

    <!-- Profile Picture Container -->
    <div v-if="profilePictureContainer" class="profile-picture-container">
      <img v-if="profilePictureContainer && profilePictureContainer.imageUrl" 
           :src="profilePictureContainer.imageUrl" 
           alt="Profile Picture" class="profile-image" />
    </div>

    <div v-if="user">
      <form @submit.prevent="updateUserProfile">
        <!-- Other profile fields -->
        <div>
          <label>First Name:</label>
          <input type="text" v-model="user.first_name" />
        </div>
        <div>
          <label>Middle Name:</label>
          <input type="text" v-model="user.middle_name" />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" v-model="user.last_name" />
        </div>
        <div>
          <label>Birthday:</label>
          <input type="date" v-model="user.birthdate" />
        </div>
        <div>
          <label>Gender:</label>
          <select v-model="user.gender">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label>Phone Number:</label>
          <input type="text" v-model="user.phone_number" />
        </div>

        <!-- Profile Picture Section -->
        <div>
          <label>Profile Picture:</label>
          <input type="file" @change="onImageChange" name="profile_picture" />
        </div>

        <button type="submit">Save Changes</button>
      </form>
      <button @click="saveToLocalStorageAndRedirect">Save to Local Storage & Go to Homepage</button>
    </div>

    <div v-else>
      <p>Loading user profile...</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: null,
      profilePictureContainer: null, // To store profile picture data (URL and error messages)
      profileImage: null, // The actual file to be uploaded
      imageError: null, // To store error message if profile image fails to load
    };
  },
  created() {
    this.fetchUserProfile();
  },
  methods: {
    // Fetch user profile from backend
    async fetchUserProfile() {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('http://localhost:3000/api/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        this.user = data;

        // Check if profile_picture exists and set the image URL
        if (this.user.profile_picture) {
          // Fetch the image URL using Axios
          const imageResponse = await axios.get(`http://localhost:3000/uploads/user/${this.user.profile_picture}`, { responseType: 'blob' });
          // Convert the blob to a URL and set it as imageUrl in the container
          this.profilePictureContainer = {
            imageUrl: URL.createObjectURL(imageResponse.data),
            error: null,
          };
        } else {
          // Set an error message in the container if the profile picture is not found
          this.profilePictureContainer = {
            imageUrl: null,
            error: 'Profile picture not found.',
          };
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        this.profilePictureContainer = {
          imageUrl: null,
          error: 'Failed to load profile picture.',
        };
      }
    },

    // Update the user profile (including image if provided)
    async updateUserProfile() {
  // Ask for confirmation before proceeding with the update
  const confirmUpdate = confirm("Do you want to update your profile?");
  if (!confirmUpdate) {
    // If the user cancels, exit the function without making changes
    return;
  }

  try {
    const token = localStorage.getItem('auth_token');
    const formData = new FormData();
    formData.append('first_name', this.user.first_name);
    formData.append('middle_name', this.user.middle_name);
    formData.append('last_name', this.user.last_name);
    formData.append('birthdate', this.user.birthdate);
    formData.append('gender', this.user.gender);
    formData.append('phone_number', this.user.phone_number);

    // Check if a new profile image is selected
    if (this.profileImage) {
      formData.append('profile_picture', this.profileImage);
    } else if (this.user.profile_picture) {
      formData.append('profile_picture', this.user.profile_picture);
    }

    const response = await fetch('http://localhost:3000/api/auth/profileupdate', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to update profile');
        }

        const updatedData = await response.json();
        alert(updatedData.message); // Notify user of success

        // Save updated profile picture filename in localStorage
        


    // Clear session data and redirect to the login page
    
    this.$router.push('/Profile');
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
},



    // Handle the image file selection and preview
    onImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.profileImage = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          // Preview the new image in the profile picture container
          this.profilePictureContainer = {
            imageUrl: e.target.result,
            error: null,
          };
        };
        reader.readAsDataURL(file);
      }
    },
    saveToLocalStorageAndRedirect() {
      localStorage.setItem('user_name', `${this.user.first_name} ${this.user.middle_name} ${this.user.last_name}`);  // Save full name
        localStorage.setItem('user_email', this.user.email);  // Save email
        if (this.profileImage) {
          localStorage.setItem('profile_picture', this.profileImage);
    } else if (this.user.profile_picture) {
      localStorage.setItem('profile_picture', this.user.profile_picture);
    }


      this.$router.push('/homepage');
    },
  },
};
</script>

<style scoped>
.profile {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}
form div {
  margin-bottom: 10px;
}
button {
  margin-top: 10px;
}
.profile-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-top: 10px;
}
.profile-picture-container {
  margin-bottom: 20px;
}
.error-message {
  color: red;
  font-weight: bold;
}
</style>
