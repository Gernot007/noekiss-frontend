import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import { getCurrentUser } from '../services/auth.service';
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const { authorize } = to.meta as any;
    const currentUser = getCurrentUser();

    if (authorize) {
      if (!currentUser) {
        // not logged in so redirect to login page with the return url
        return next({ path: '/login', query: { returnUrl: to.path } });
      }

      // check if route is restricted by role
      if (
        authorize?.length &&
        !authorize.includes(currentUser?.user_metadata?.role)
      ) {
        // role not authorised so redirect to home page
        return next({ path: '/' });
      }
    }

    next();
  });

  return Router;
});
