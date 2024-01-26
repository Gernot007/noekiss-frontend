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
                v-model="data.registrationCode"
                type="text"
                label="Registrierungscode"
              >
                <template v-slot:prepend> </template>
              </q-input>
              <q-input
                square
                clearable
                v-model="data.first_name"
                type="text"
                label="Vorname"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-input
                square
                clearable
                v-model="data.last_name"
                type="text"
                label="Nachname"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-input
                square
                clearable
                v-model="data.birthday"
                type="date"
                label="Geburtsdatum"
              >
                <template v-slot:prepend>
                  <q-icon name="date" />
                </template>
              </q-input>
              <q-input
                square
                clearable
                v-model="data.phone"
                type="telephone"
                label="Mobilnummer"
              >
                <template v-slot:prepend>
                  <q-icon name="tel" />
                </template>
              </q-input>
              <q-input
                square
                clearable
                v-model="data.email"
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
                v-model="data.password"
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
              @click="signUpNewUser(data, router)"
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

<script setup>
import { reactive, ref } from 'vue';
import { signUpNewUser } from '../services/auth.service';
import { useRouter } from 'vue-router';

const router = useRouter();

const data = reactive({
  registrationCode: '',
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  birthday: '',
  phone: '',
});
</script>

<style></style>
