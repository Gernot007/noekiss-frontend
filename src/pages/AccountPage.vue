<script setup>
// import Avatar from '../components/Avatar.vue';
import { supabase } from '../supabase';
import { onBeforeMount, onMounted, ref } from 'vue';

let user;
const loading = ref(true);
const username = ref('');
const website = ref('');
const avatar_url = ref('');

async function getUser() {
  const { data, error } = await supabase.auth.getSession();
  user = data.session.user;
}

async function getProfile() {
  try {
    loading.value = true;

    const { data, error, status } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && status !== 406) throw error;

    if (data) {
      username.value = data.username;
      website.value = data.website;
      avatar_url.value = data.avatar_url;
    }
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

async function updateProfile() {
  try {
    loading.value = true;

    const updates = {
      id: user?.id,
      username: username.value,
      website: website.value,
      avatar_url: avatar_url.value,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

async function signOut() {
  try {
    loading.value = true;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

onBeforeMount(() => {
  getUser();
});

onMounted(() => {
  getProfile();
});
</script>

<script onMounted></script>

<template>
  <q-page>
    <form class="form-widget" @submit.prevent="updateProfile">
      <div>
        <label for="email">Email</label>
      </div>
      <div>
        <label for="username">Name</label>
        <input id="username" type="text" v-model="username" />
      </div>
      <div>
        <label for="website">Website</label>
        <input id="website" type="url" v-model="website" />
      </div>
      <form class="form-widget" @submit.prevent="updateProfile">
        <!-- Add to body -->
        <!-- <Avatar v-model:path="avatar_url" @upload="updateProfile" size="10" /> -->

        <!-- Other form elements -->
      </form>
      <div>
        <input
          type="submit"
          class="button primary block"
          :value="loading ? 'Loading ...' : 'Update'"
          :disabled="loading"
        />
      </div>

      <div>
        <button class="button block" @click="signOut" :disabled="loading">
          Sign Out
        </button>
      </div>
    </form>
  </q-page>
</template>
