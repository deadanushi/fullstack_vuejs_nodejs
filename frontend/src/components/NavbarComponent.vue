<template>
  <div>
    <!-- ── GUEST / PUBLIC navbar: all centered ── -->
    <v-app-bar
      v-if="!store.isAdmin"
      :elevation="1"
      class="modern-navbar"
      height="80"
      color="white"
    >
      <div class="nav-center">
        <router-link to="/" class="logo-link">
          <div class="logo-container">
            <span class="logo-text-primary">MY</span>
            <span class="logo-text-secondary">STORE</span>
          </div>
        </router-link>

        <nav class="guest-nav">
          <v-btn
            v-for="item in guestNavItems"
            :key="item.route"
            :to="item.route"
            variant="text"
            class="guest-nav-btn"
            :prepend-icon="item.icon"
          >
            {{ item.name }}
          </v-btn>
        </nav>
      </div>
    </v-app-bar>

    <!-- ── ADMIN navbar: hamburger + logo + sign-out ── -->
    <v-app-bar
      v-else
      :elevation="1"
      class="modern-navbar"
      height="80"
      color="white"
    >
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        class="nav-icon"
        color="grey-darken-1"
      >
        <v-icon size="24">mdi-menu</v-icon>
      </v-app-bar-nav-icon>

      <div class="logo-container mx-3">
        <span class="logo-text-primary">MY</span>
        <span class="logo-text-secondary">STORE</span>
        <v-chip size="x-small" color="primary" variant="flat" class="ml-2">Admin</v-chip>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        variant="text"
        color="error"
        class="signout-btn"
        prepend-icon="mdi-logout"
        @click="handleLogout"
      >
        Sign Out
      </v-btn>
    </v-app-bar>

    <!-- ── ADMIN sidebar drawer ── -->
    <v-navigation-drawer
      v-if="store.isAdmin"
      v-model="drawer"
      class="navigation-drawer"
      :width="280"
      temporary
      color="white"
    >
      <div class="drawer-header">
        <div class="drawer-logo">
          <span class="logo-text-primary">MY</span>
          <span class="logo-text-secondary">STORE</span>
        </div>
        <p class="drawer-subtitle">Admin Panel</p>
      </div>

      <v-list class="navigation-list" density="comfortable">
        <v-list-item
          v-for="(item, index) in adminNavItems"
          :key="index"
          :to="item.route"
          :prepend-icon="item.icon"
          :title="item.name"
          class="nav-list-item"
          rounded="xl"
          @click="drawer = false"
        ></v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="drawer-footer">
          <v-divider></v-divider>
          <div class="pa-4">
            <v-btn
              variant="outlined"
              color="error"
              block
              prepend-icon="mdi-logout"
              @click="handleLogout"
            >
              Sign Out
            </v-btn>
          </div>
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import '@/assets/styles/navbar.css'

const drawer = ref(false)
const store = useUserStore()
const router = useRouter()

const guestNavItems = [
  { name: 'Home', route: '/', icon: 'mdi-home-outline' },
  { name: 'Products', route: '/products', icon: 'mdi-package-variant' },
  { name: 'Skincare', route: '/skincare', icon: 'mdi-flower-tulip-outline' },
  { name: 'Cart', route: '/cart', icon: 'mdi-cart-outline' },
]

const adminNavItems = [
  { name: 'Home', route: '/', icon: 'mdi-home-outline' },
  { name: 'Products', route: '/products', icon: 'mdi-package-variant' },
  { name: 'Manage Products', route: '/admin/products', icon: 'mdi-package-variant-closed' },
  { name: 'Manage Categories', route: '/admin/categories', icon: 'mdi-folder-multiple' },
  { name: 'Manage Orders', route: '/admin/orders', icon: 'mdi-clipboard-list' },
]

const handleLogout = () => {
  store.logout()
  drawer.value = false
  router.push('/')
}
</script>
