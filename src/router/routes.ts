import { RouteRecordRaw } from 'vue-router';
import FullScreenLayout from '../layouts/FullScreenLayout.vue';
import AppLayout from '../layouts/AppLayout.vue';
import TestPage from '../pages/TestPage.vue';
import ErrorNotFound from '../pages/ErrorNotFound.vue';
import LoginPage from '../pages/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';
import AccountPage from '../pages/AccountPage.vue';
import ShopsPage from '../pages/ShopsPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: TestPage,
    meta: { layout: AppLayout, authorize: true },
  },
  {
    path: '/account',
    component: AccountPage,
    meta: { layout: AppLayout, authorize: true },
  },
  {
    path: '/shops',
    component: ShopsPage,
    meta: { layout: AppLayout, authorize: true },
  },
  {
    path: '/login',
    component: LoginPage,
    meta: { layout: FullScreenLayout },
  },
  {
    path: '/register',
    component: RegisterPage,
    meta: { layout: FullScreenLayout },
  },
  {
    path: '/:catchAll(.*)*',
    component: ErrorNotFound,
    meta: { layout: FullScreenLayout },
  },
];

export default routes;
