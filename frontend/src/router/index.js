import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/user';

import Home from '../views/HomeView.vue';
import Products from '../views/ProductView.vue';
import ProductDetail from '../views/ProductDetailView.vue';
import Cart from '../views/CartView.vue';
import Checkout from '../views/CheckoutView.vue';
import Login from '../views/LoginView.vue';
import Register from '../views/RegisterView.vue';

// Admin views
import AdminLayout from '../views/admin/AdminLayout.vue'; 
import AdminProducts from '../views/admin/ProductsView.vue';
import AdminCategories from '../views/admin/CategoriesView.vue';
import AdminOrders from '../views/admin/OrdersView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/products',
    name: 'Products',
    component: Products
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { requiresAuth: true, adminForbidden: true }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
    meta: { requiresAuth: true, adminForbidden: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guestOnly: true }
  },

  // Nested Admin Routes
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'products',
        name: 'AdminProducts',
        component: AdminProducts
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: AdminCategories
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: AdminOrders
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  const isLoggedIn = userStore.isLoggedIn;
  const isAdmin = userStore.isAdmin;

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'Login' });
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    return next({ name: 'Home' });
  }

  if (to.meta.adminForbidden && isAdmin) {
    return next({ name: 'AdminProducts' });
  }

  if (to.meta.guestOnly && isLoggedIn) {
    return next({ name: isAdmin ? 'AdminProducts' : 'Home' });
  }

  next();
});

export default router;
