import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [
  {
    // 一级：登陆
    path: '/login',
    component: () => import("@/components/login.vue"),
    name: 'login'
  },
  {
    // 一级：注册
    path: '/register',
    component: () => import("@/components/register.vue"),
    name: 'register'
  },
  {
    // 一级：首页
    path: '/',
    component: () => import("@/components/home.vue"),
    name: 'home',
    children: [
      { // --子路由---
        path: '',
        name: 'index',
        component: () => import("@/components/index.vue")
      },
      {
        path: 'setting',
        name: 'setting',
        component: () => import("@/components/setting.vue")
      },
      {
        path: 'upload',
        name: 'upload',
        component: () => import("@/components/upload.vue")
      }
    ]
  },
  {
    // 一级：user 详情页面
    path: '/user/:uid',
    component: () => import("@/components/userDetail.vue"),
    name: 'user_detail'
  },
  {
    // 一级：user 个人中心页面
    path: '/user',
    component: () => import("@/components/user.vue"),
    name: 'user'
  },
  {
    // 一级：搜索页面
    path:'/search',
    component: () => import("@/components/searchUser.vue"),
    name:'search'
  }
]


const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router