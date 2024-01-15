import { RouteRecordRaw } from 'vue-router';
import FullScreenLayout from '../layouts/FullScreenLayout.vue';
import AppLayout from '../layouts/AppLayout.vue';
import HomePage from '../pages/HomePage.vue';
import ErrorNotFound from '../pages/ErrorNotFound.vue';
import LoginPage from '../pages/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';
import AccountPage from '../pages/AccountPage.vue';
import ShopsPage from '../pages/ShopsPage.vue';
import ShopPage from '../pages/ShopPage.vue';
import EmployeesPage from '../pages/EmployeesPage.vue';
import EventsPage from '../pages/EventsPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: HomePage,
    meta: { layout: AppLayout },
  },
  {
    path: '/account',
    component: AccountPage,
    meta: { layout: AppLayout, authorize: ['Administrator', 'Haupthelfer'] },
  },
  {
    path: '/employees',
    component: EmployeesPage,
    meta: { layout: AppLayout, authorize: ['Administrator', 'Haupthelfer'] },
  },
  {
    path: '/events',
    component: EventsPage,
    meta: { layout: AppLayout, authorize: ['Administrator', 'Haupthelfer'] },
  },
  {
    path: '/shops',
    component: ShopsPage,
    meta: { layout: AppLayout, authorize: ['Administrator', 'Haupthelfer'] },
  },
  {
    path: '/shops/:id',
    component: ShopPage,
    meta: {
      layout: AppLayout,
      authorize: ['Administrator', 'Haupthelfer'],
    },
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
