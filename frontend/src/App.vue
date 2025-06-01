<template>
  <v-app>
    <v-main>
      <NavbarComponent/>
      <router-view>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import NavbarComponent from './components/NavbarComponent.vue';

</script>
