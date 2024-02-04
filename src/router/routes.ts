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
import UsersPage from '../pages/UsersPage.vue';
import AdminSettingsPage from 'src/pages/AdminSettingsPage.vue';
import AreaPage from 'src/pages/AreaPage.vue';
import ReportPage from 'src/pages/ReportPage.vue';
import ShopCreatePage from 'src/pages/ShopCreatePage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: HomePage,
    meta: { layout: AppLayout, authorize: ['Admin', 'Haupthelfer'] },
  },
  {
    path: '/account',
    component: AccountPage,
    meta: { layout: AppLayout, authorize: ['Admin', 'Haupthelfer'] },
  },
  {
    path: '/admin',
    component: AdminSettingsPage,
    meta: { layout: AppLayout, authorize: ['Admin'] },
  },
  {
    path: '/users',
    component: UsersPage,
    meta: { layout: AppLayout, authorize: ['Admin'] },
  },
  {
    path: '/employees',
    component: EmployeesPage,
    meta: { layout: AppLayout, authorize: ['Admin', 'Haupthelfer'] },
  },
  {
    path: '/events',
    component: EventsPage,
    meta: { layout: AppLayout, authorize: ['Admin'] },
  },
  {
    path: '/shops',
    component: ShopsPage,
    meta: { layout: AppLayout, authorize: ['Admin'] },
  },
  {
    path: '/reports',
    component: ReportPage,
    meta: { layout: AppLayout, authorize: ['Admin'] },
  },
  {
    path: '/shops/:id',
    component: ShopPage,
    meta: {
      layout: AppLayout,
      authorize: ['Admin', 'Haupthelfer'],
    },
  },
  {
    path: '/shops/create',
    component: ShopCreatePage,
    meta: {
      layout: AppLayout,
      authorize: ['Admin', 'Haupthelfer'],
    },
  },
  {
    path: '/shops/:parent_id/areas/:id',
    component: AreaPage,
    meta: {
      layout: AppLayout,
      authorize: ['Admin', 'Haupthelfer'],
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
