<script setup>
import { ref } from 'vue';
import { signUpNewUser } from '../services/auth.service';
import { useRouter } from 'vue-router';

const router = useRouter();

const loading = ref(false);
const email = ref('');
const password = ref('');
</script>

<template>
  <q-page
    class="window-height window-width row justify-center items-center"
    style="background: linear-gradient(#8274c5, #5a4a9f)"
  >
    <div class="column q-pa-lg">
      <div class="row">
        <q-card class="shadow-24" style="width: 500px; height: 700px">
          <q-card-section class="bg-deep-purple-4">
            <h4 class="text-h5 text-white q-my-md">Registrierung</h4>
            <div
              class="absolute-bottom-right q-pr-md"
              style="transform: translateY(50%)"
            >
              <q-btn fab icon="close" color="purple-4" />
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-px-sm q-pt-xl q-pb-lg">
              <q-input
                square
                clearable
                v-model="email"
                type="email"
                label="Email"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
              <q-input
                square
                clearable
                v-model="password"
                type="password"
                label="Password"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-lg">
            <q-btn
              unelevated
              size="lg"
              color="purple-4"
              class="full-width text-white"
              label="Bestätigen"
              @click="signUpNewUser(email, password, router)"
            />
          </q-card-actions>
          <q-card-section class="text-center q-pa-sm">
            <div class="cursor-pointer" @click="$router.push('/login')">
              <p class="text-grey-6">Zu Login</p>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style></style>
