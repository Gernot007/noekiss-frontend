<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { supabase } from './supabase';
import AccountPage from './pages/AccountPage.vue';

const session = ref();

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session;
  });

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session;
  });
});
</script>

<template>
  <AccountPage v-if="session" :session="session" />
  <component :is="$route.meta.layout || 'div'"> </component>
</template>
