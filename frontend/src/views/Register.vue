    <template>
        <div class="register">
        <h2>Register</h2>
        <form @submit.prevent="registerUser">
            <input type="text" v-model="first_name" placeholder="First Name" required />
            <input type="text" v-model="middle_name" placeholder="Middle Name" />
            <input type="text" v-model="last_name" placeholder="Last Name" required />
            <input type="date" v-model="birthdate" placeholder="Birthdate" required />
            <select v-model="gender" required>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            </select>
            <input type="text" v-model="phone_number" placeholder="Phone Number" />
            <input type="email" v-model="email" placeholder="Email" required />
            <input type="password" v-model="password" placeholder="Password" required />
            <h3>Address</h3>
            <input type="text" v-model="country" placeholder="Country" required />
            <input type="text" v-model="region" placeholder="Region" required />
            <input type="text" v-model="province" placeholder="Province" required />
            <input type="text" v-model="city" placeholder="City" required />
            <input type="text" v-model="barangay" placeholder="Barangay" required />
            <input type="text" v-model="street_address" placeholder="Street Address" required />
            <input type="text" v-model="zip_code" placeholder="Zip Code" required />
            <button type="submit">Register</button>
        </form>
        <p v-if="message">{{ message }}</p>
        </div>
    </template>
    
    <script>
    import axios from 'axios';
    
    export default {
        data() {
        return {
            first_name: '',
            middle_name: '',
            last_name: '',
            birthdate: '',
            gender: '',
            phone_number: '',
            email: '',
            password: '',
            country: 'Philippines',
            region: '',
            province: '',
            city: '',
            barangay: '',
            street_address: '',
            zip_code: '',
            message: ''
        };
        },
        methods: {
        async registerUser() {
            try {
            const response = await axios.post('http://localhost:3000/api/auth/register', {
                first_name: this.first_name,
                middle_name: this.middle_name,
                last_name: this.last_name,
                birthdate: this.birthdate,
                gender: this.gender,
                phone_number: this.phone_number,
                email: this.email,
                password: this.password,
                country: this.country,
                region: this.region,
                province: this.province,
                city: this.city,
                barangay: this.barangay,
                street_address: this.street_address,
                zip_code: this.zip_code
            });
            this.message = response.data;
            } catch (error) {
            this.message = error.response.data || 'Registration failed';
            }
        }
        }
    };
    </script>
    
    <style scoped>
    .register {
        max-width: 400px;
        margin: 0 auto;
    }
    form {
        display: flex;
        flex-direction: column;
    }
    input, select, button {
        margin: 5px 0;
        padding: 8px;
    }
    </style>
    