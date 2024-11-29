<!-- src/components/Sidebar.vue -->
<template>
    <aside id="sidebar">
      <div class="d-flex align-items-center justify-content-between">
        <button class="toggle-btn" type="button" @click="toggleSidebar">
          <i class="lni lni-grid-alt"></i>
        </button>
        <div class="sidebar-logo">
          <a href="#">Sneaker Hero</a>
        </div>
      </div>
  
      <ul class="sidebar-nav">
        <li class="sidebar-item">
          <router-link to="/dashboard" class="sidebar-link">
            <i class="lni lni-user"></i>
            <span>Dashboard</span>
          </router-link>
        </li>
        <li class="sidebar-item">
          <a href="#" class="sidebar-link" @click="loadPage('/AdminMngOrder')">
            <i class="lni lni-agenda"></i>
            <span>Orders</span>
          </a>
        </li>
        <li class="sidebar-item">
          <a href="#" class="sidebar-link" @click="toggleManagementDropdown">
            <i class="lni lni-protection"></i>
            <span>Management</span>
          </a>
          <ul v-if="isManagementOpen" class="sidebar-dropdown list-unstyled">
            <li class="sidebar-item">
              <a href="#" class="sidebar-link" @click="loadPage('/AdminMngProduct')">Products</a>
            </li>
            <li class="sidebar-item">
              <a href="#" class="sidebar-link" @click="loadPage('/AdminMngAcc')">Accounts</a>
            </li>
          </ul>
        </li>
        <li class="sidebar-item">
          <a href="#" class="sidebar-link" @click="loadPage('/Notification')">
            <i class="lni lni-popup"></i>
            <span>Notification</span>
          </a>
        </li>
        <li class="sidebar-item">
          <a href="#" class="sidebar-link" @click="loadPage('/AdminAcc')">
            <i class="lni lni-cog"></i>
            <span>Account Settings</span>
          </a>
        </li>
      </ul>
  
      <div class="sidebar-footer">
        <form method="post" action="" @click="logout">
          <button type="submit" class="sidebar-link">
            <i class="lni lni-exit"></i> Logout
          </button>
        </form>
      </div>
    </aside>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isManagementOpen: false,
      };
    },
    methods: {
      toggleSidebar() {
        this.$emit('toggle-sidebar'); // Emit event to parent to toggle sidebar
      },
      toggleManagementDropdown() {
        this.isManagementOpen = !this.isManagementOpen;
      },
      loadPage(page) {
        this.$emit('load-page', page); // Emit event to parent to load page
      },
      logout() {
        this.$emit('logout'); // Emit event to parent for logout
      },
    },
  };
  </script>
  
  <style scoped>
  /* Your Sidebar Styles here */
  </style>
  