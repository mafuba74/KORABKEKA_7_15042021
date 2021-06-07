import Vue from 'vue'
import VueRouter from 'vue-router'
import Forum from '../views/Forum.vue'
import Store from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/forum',
    name: 'Forum',
    component: Forum,
  },
  {
    path: '/auth',
        name: 'Auth',
        component: () => import(/* webpackChunkName: "auth"*/ '../views/Auth.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "profile"*/ '../views/Profile.vue')
  },
  {
    path: '*',
    redirect: { name: 'Forum'}
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if(localStorage.getItem('groupomaniasessionuser') !== null){
    Store.dispatch('checkUser')
  }
  if (to.name !== 'Auth'  && !Store.state.isLoggedIn) next({ name: 'Auth' })
  else next()
})

export default router
