<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <div class="brand-logo">
          <span class="logo-text-primary">BEAU</span>
          <span class="logo-text-secondary">TIFY</span>
        </div>
        <p class="brand-subtitle">Admin Panel</p>
      </div>

      <nav class="sidebar-nav">

        <div class="nav-section">
          <h3 class="nav-section-title">Catalog</h3>
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/admin/products" class="nav-link">
                <v-icon class="nav-icon">mdi-package-variant</v-icon>
                <span class="nav-text">Products</span>
                <div class="nav-indicator"></div>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/admin/categories" class="nav-link">
                <v-icon class="nav-icon">mdi-folder-multiple</v-icon>
                <span class="nav-text">Categories</span>
                <div class="nav-indicator"></div>
              </router-link>
            </li>
          </ul>
        </div>

        <div class="nav-section">
          <h3 class="nav-section-title">Sales</h3>
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/admin/orders" class="nav-link">
                <v-icon class="nav-icon">mdi-cart</v-icon>
                <span class="nav-text">Orders</span>
                <v-chip size="x-small" color="warning" variant="elevated" class="nav-badge">
                  12
                </v-chip>
                <div class="nav-indicator"></div>
              </router-link>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <div class="admin-user">
          <v-avatar size="40" class="user-avatar">
            <v-icon color="white">mdi-account</v-icon>
          </v-avatar>
          <div class="user-info">
            <p class="user-name">Admin User</p>
            <p class="user-role">Administrator</p>
          </div>
        </div>
        
        <v-btn
          variant="text"
          size="small"
          class="logout-btn"
          @click="handleLogout"
        >
          <v-icon left size="16">mdi-logout</v-icon>
          Logout
        </v-btn>
      </div>
    </aside>

    <main class="admin-main-content">
      <!-- Top Header -->
      <header class="admin-header">
        <div class="header-content">
          <div class="header-left">
            <v-btn
              icon
              variant="text"
              class="mobile-menu-btn"
              @click="toggleSidebar"
            >
              <v-icon>mdi-menu</v-icon>
            </v-btn>
            <h1 class="page-title">{{ getPageTitle() }}</h1>
          </div>
          
          <div class="header-right">
            <v-btn
              color="primary"
              variant="elevated"
              class="quick-action-btn"
              @click="$router.push('/admin/products')"
            >
              <v-icon left>mdi-plus</v-icon>
              Add Product
            </v-btn>
            
            <v-btn
              icon
              variant="text"
              class="notification-btn"
            >
              <v-badge
                color="error"
                content="3"
                offset-x="10"
                offset-y="10"
              >
                <v-icon>mdi-bell</v-icon>
              </v-badge>
            </v-btn>
          </div>
        </div>
      </header>

      <div class="content-container">
        <router-view />
      </div>
    </main>

    <div 
      v-if="sidebarOpen" 
      class="mobile-overlay"
      @click="closeSidebar"
    ></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import '@/assets/styles/adminLayout.css'

const route = useRoute();
const router = useRouter();
const sidebarOpen = ref(false);

const getPageTitle = () => {
  const routeName = route.name;
  switch (routeName) {
    case 'AdminProducts':
      return 'Product Management';
    case 'AdminCategories':
      return 'Category Management';
    case 'AdminOrders':
      return 'Order Management';
    case 'AdminDashboard':
      return 'Dashboard Overview';
    default:
      return 'Admin Dashboard';
  }
};

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const closeSidebar = () => {
  sidebarOpen.value = false;
};

const handleLogout = () => {
  // Handle logout logic here
  router.push('/login');
};
</script>

