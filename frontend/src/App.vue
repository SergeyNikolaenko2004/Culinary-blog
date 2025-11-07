<template>
  <q-layout view="hHh Lpr lFf">
    <Navbar />
    
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue';
import Navbar from '/src/components/Navbar.vue';


export default defineComponent({
  name: 'App',
  components: {
    Navbar
  }
});
</script>