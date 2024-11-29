<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-custom navbar-dark">
      <div class="container d-flex justify-content-between align-items-center">
        <!-- Social Media Icons and Brand Name -->
        <div class="d-flex align-items-center">
          <a href="#" class="text-white me-3"><i class="bi bi-facebook"></i></a>
          <a href="#" class="text-white me-3"><i class="bi bi-instagram"></i></a>
          <span class="navbar-brand ms-2">ORIENTAL MINDORO HERITAGE MUSEUM</span>
        </div>

        <!-- Toggle Button for Navbar Links -->
        <button class="navbar-toggler" type="button" @click="toggleNavbarLinks">
          <i class="bi bi-list text-white fs-3"></i>
        </button>
      </div>

      <!-- Collapsible Navbar Links Below Header -->
      <div v-if="showNavbarLinks" id="navbarLinks" class="text-center">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link text-white" href="#">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" href="#">Exhibits</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" href="#">About</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" href="#">Contact</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" href="http://localhost:8080/register">Register</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" href="http://localhost:8080/login">Login</a>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section d-flex align-items-center justify-content-center">
      <div class="hero-content">
        <h1>Welcome to Mindoro Heritage Museum</h1>
        <div class="play-button">
          <i class="bi bi-play-circle-fill fs-1"></i>
        </div>
      </div>
    </section>

    <!-- Introduction Section -->
    <section class="intro-section">
      <img src="YOUR_IMAGE_ICON_PATH" alt="Museum Icon" style="width: 60px;" />
      <h2>Experience history and culture at your fingertips</h2>
      <div class="divider"></div>
      <p>
        The Oriental Mindoro Heritage Museum (OMHM), Calapan, exhibits the province's
        rich culture and history. Its construction was spearheaded by Governor Bonz
        Dolor and funded through the General Appropriations Act of 2020 by the National
        Government. The museum opened its doors to the public during the 71st Founding
        Anniversary Celebration of the province on November 15, 2021.
      </p>
    </section>

    <!-- Explore Section -->
    <section class="explore-section">
      <div class="container">
        <div class="row align-items-center">
          <!-- Text Content -->
          <div class="col-md-6">
            <h3>Explore what's inside.</h3>
            <p class="explore-text">
              Since the Oriental Mindoro Heritage Museum, Calapan, functions as the
              repository and custodian of varying representations of legacy, it houses
              cultural artifacts, historical records, evidence of abundant biodiversity,
              and remarkably collected memorabilia throughout the province. Inside the
              museum, visitors will see displays of old things used by native Mangyan for
              their livelihood and household.
            </p>
            <a href="#" class="book-button">Book a Visit</a>
          </div>
          <!-- Image Content -->
          <div class="col-md-6">
            <img src="YOUR_IMAGE_PATH_HERE" alt="Museum Interior" class="img-fluid explore-image" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "LandingPage",
  data() {
    return {
      showNavbarLinks: false,
    };
  },
  methods: {
    toggleNavbarLinks() {
      this.showNavbarLinks = !this.showNavbarLinks;
    },
  },
};


</script>

<style scoped>
/* Header */
.navbar-custom {
  background-color: #0a0a0a;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 10px 0;
}

.navbar-brand {
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
}

/* Navbar Links */
#navbarLinks {
  background-color: #0a0a0a;
  width: 100%;
  padding: 10px 0;
}

#navbarLinks ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

#navbarLinks .nav-item {
  margin: 10px 0;
}

/* Hero Section */
.hero-section {
  background-image: url('~@/assets/images/bg_museum.jpg');
  background-size: cover;
  background-position: center;
  height: 80vh;
  color: white;
  text-align: center;
  position: relative;
  margin-top: 60px;
}

.hero-content h1 {
  font-size: 2.5rem;
  font-weight: bold;
}

.play-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 128, 0, 0.7);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-top: 20px;
  color: white;
  cursor: pointer;
}

.play-button:hover {
  background-color: rgba(0, 128, 0, 0.9);
}

/* Introduction Section */
.intro-section {
  text-align: center;
  padding: 50px 20px;
}

.intro-section h2 {
  font-size: 2rem;
  font-weight: bold;
}

.intro-section p {
  font-size: 1rem;
  max-width: 600px;
  margin: 20px auto;
  line-height: 1.6;
}

.intro-section .divider {
  width: 50px;
  height: 3px;
  background-color: #000;
  margin: 10px auto;
}

/* Explore Section */
.explore-section {
  padding: 50px 20px;
  background-color: #f7f7f7;
}

.explore-text {
  font-size: 1rem;
  line-height: 1.6;
}

.explore-image {
  border: 2px solid #000;
  padding: 10px;
}

.book-button {
  background-color: #000;
  color: #fff;
  padding: 10px 20px;
  text-decoration: none;
  display: inline-block;
  margin-top: 20px;
}
</style>
