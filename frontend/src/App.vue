<template>
  <v-app>
    <CartSidebar />
    <v-main>
      <NavbarComponent />
      <router-view />
      <FooterComponent />
    </v-main>
  </v-app>
</template>

<script setup>
import NavbarComponent from './components/NavbarComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
import CartSidebar from './components/CartSidebar.vue';
</script>
