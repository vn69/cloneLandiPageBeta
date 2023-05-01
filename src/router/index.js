import { createRouter, createWebHistory } from 'vue-router'
import LayoutMenu from '../components/LayoutMenu.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LayoutMenu,
      children: [
        {
          path: '',
          name: 'drag',
          component: () => import('../views/DragView.vue')
        },
        {
          path: '/home',
          name: 'home',
          component: () => import('../views/HomeView.vue')
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('../views/AboutView.vue')
        }
      ]
    },
    {
      path: '/demo',
      name: 'demo',
      component: () => import('../views/DemoPage.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'test',
      component: () => import('../views/DragView.vue')
    }
  ]
})

export default router
