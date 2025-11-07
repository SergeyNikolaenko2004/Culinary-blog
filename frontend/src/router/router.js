import { createWebHistory, createRouter } from "vue-router";

const routes = [
    {
        path: "/culture_plast/:culture_plast_id/food_names",
        name: "food_names-by-culture",
        component: () => import('../views/culture_plast/food_name.vue'),
        props: true,
        meta: {
            title: "Результаты поиска"
        }
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
        path: '/search-results',
        name: 'SearchFood',
        component: () => import('../views/culture_plast/SearchFood.vue'),
        props: (route) => ({ searchTerm: route.query.q }),
        meta: {
          title: "Результаты поиска"
        }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('../views/ProfilePage.vue'),
        meta: { 
          requiresAuth: true,
          title: "Результаты поиска" }
      },
      {
        path: '/food/:id',
        name: 'FoodDetailsPage',
        component: () => import('../views/culture_plast/FoodDetailsPage.vue')
      }
];


const router = createRouter({
    history: createWebHistory(), 
    routes,
    scrollBehavior(to, from, savedPosition) {
      return { top: 0 }
    } 
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('currentUser');
    
    if (to.meta.requiresAuth && !isAuthenticated) {
      next('/');
    } else {
      next();
    }
  });

export default router;