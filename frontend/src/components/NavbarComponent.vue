<template>
  <div>
    <v-app-bar 
      :elevation="2" 
      class="modern-navbar"
      height="70"
      color="white"
    >
      <v-app-bar-nav-icon 
        @click="drawer = !drawer"
        class="nav-icon"
        color="grey-darken-1"
      >
        <v-icon size="24">mdi-menu</v-icon>
      </v-app-bar-nav-icon>
    
      <v-spacer></v-spacer>
      
      <div class="logo-container">
        <span class="logo-text-primary">BEAU</span>
        <span class="logo-text-secondary">TIFY</span>
      </div>
      
      <v-spacer></v-spacer>

      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn 
            icon
            v-bind="props"
            class="profile-btn"
            size="large"
            @click="profileDrawer = !profileDrawer"
          >
            <v-avatar size="40" class="profile-avatar">
              <v-icon size="20" color="white">mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        
        <v-card class="profile-menu" min-width="250" elevation="8">
          <v-card-text class="pa-4">
            <div class="profile-section">
              <v-avatar size="60" class="mb-3 profile-avatar-large">
                <v-icon size="30" color="white">mdi-account</v-icon>
              </v-avatar>
              <h3 class="profile-name">Welcome Back!</h3>
              <p class="profile-subtitle">
                {{ store.isLoggedIn ? 'User Account' : 'Guest User' }}
              </p>
            </div>
            
            <v-divider class="my-3"></v-divider>
            
            <v-list density="compact" class="profile-list">
              <v-list-item 
                v-if="store.isLoggedIn"
                prepend-icon="mdi-account-cog"
                title="Profile Settings"
                class="profile-list-item"
              ></v-list-item>
              <v-list-item 
                v-if="store.isLoggedIn"
                prepend-icon="mdi-logout"
                title="Sign Out"
                class="profile-list-item"
              ></v-list-item>
              <v-list-item 
                v-else
                prepend-icon="mdi-login"
                title="Sign In"
                to="/login"
                class="profile-list-item"
              ></v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      class="navigation-drawer"
      :width="320"
      temporary
      color="white"
    >
      <div class="drawer-header">
        <div class="drawer-logo">
          <span class="logo-text-primary">BEAU</span>
          <span class="logo-text-secondary">TIFY</span>
        </div>
      </div>

      <div class="drawer-profile-section">
        <div class="profile-container">
          <v-avatar size="50" class="profile-avatar-drawer">
            <v-img
              v-if="userPhoto"
              :src="userPhoto"
              :alt="userName"
              cover
            ></v-img>
            <v-icon v-else size="25" color="white">mdi-account</v-icon>
          </v-avatar>
          
          <div class="profile-details">
            <h4 class="profile-name-drawer">{{ userName }}</h4>
            <p class="profile-status">{{ userStatus }}</p>
          </div>
        </div>

        <div class="profile-actions">
          <v-btn
            v-if="store.isLoggedIn"
            variant="text"
            size="small"
            prepend-icon="mdi-account-cog"
            class="profile-action-btn"
            to="/profile"
          >
            Profile Settings
          </v-btn>
          
          <v-btn
            v-if="store.isLoggedIn"
            variant="text"
            size="small"
            prepend-icon="mdi-logout"
            class="profile-action-btn"
            @click="handleLogout"
          >
            Sign Out
          </v-btn>
          
          <v-btn
            v-else
            variant="outlined"
            size="small"
            prepend-icon="mdi-login"
            class="profile-action-btn login-btn"
            to="/login"
          >
            Sign In
          </v-btn>
        </div>
      </div>

      <v-divider class="profile-divider"></v-divider>

      <div class="search-container">
        <v-text-field
          v-model="search"
          label="Search navigation..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          hide-details
          single-line
          class="search-field"
        ></v-text-field>
      </div>

      <v-list class="navigation-list" density="comfortable">
        <v-list-item
          v-for="(item, index) in filteredItems"
          :key="index"
          :to="item.route"
          :prepend-icon="item.icon"
          :title="item.name"
          class="nav-list-item"
          rounded="xl"
        >
          <template v-slot:append v-if="item.badge">
            <v-chip
              size="small"
              :color="item.badgeColor || 'primary'"
              variant="elevated"
            >
              {{ item.badge }}
            </v-chip>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useUserStore } from '@/stores/user'
import '@/assets/styles/navbar.css'

const drawer = ref(false)
const profileDrawer = ref(false)
const search = ref('')
const items = ref([])

const store = useUserStore()

const userPhoto = ref(null) 
const userName = computed(() => {
  return store.isLoggedIn ? (store.user?.name || 'John Doe') : 'Guest'
})
const userStatus = computed(() => {
  return store.isLoggedIn ? 'Online' : 'Not signed in'
})

const filteredItems = computed(() => {
  if (!search.value) return items.value
  return items.value.filter(item => 
    item.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

const handleLogout = () => {
  if (store.logout) {
    store.logout()
  }
  drawer.value = false
}

watchEffect(() => {
  if (store.isLoggedIn) {
    items.value = [
      { 
        name: 'Dashboard', 
        route: '/', 
        icon: 'mdi-view-dashboard',
        badge: 'New',
        badgeColor: 'success'
      },
      { 
        name: 'Products', 
        route: '/products', 
        icon: 'mdi-package-variant'
      },
      { 
        name: 'Cart', 
        route: '/cart', 
        icon: 'mdi-cog'
      },
      { 
        name: 'Checkout', 
        route: '/checkout', 
        icon: 'mdi-credit-card'
      }
    ]
  } else {
    items.value = [
      { 
        name: 'Home', 
        route: '/', 
        icon: 'mdi-home'
      },
      { 
        name: 'Products', 
        route: '/products', 
        icon: 'mdi-package-variant'
      },
      { 
        name: 'Log In', 
        route: '/login', 
        icon: 'mdi-login'
      },
      { 
        name: 'Register', 
        route: '/register', 
        icon: 'mdi-login'
      }
    ]
  }
})
</script>
