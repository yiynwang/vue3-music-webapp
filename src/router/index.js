import { createRouter, createWebHashHistory } from 'vue-router'
const Recommend = () => import(/* @vite-ignore */ '@/views/recommend.vue')
const Singer = () => import(/* @vite-ignore */ '@/views/singer.vue')
const TopList = () => import(/* @vite-ignore */ '@/views/top-list.vue')
const Search = () => import(/* @vite-ignore */ '@/views/search.vue')
const singerDetail = () =>
  import(/* @vite-ignore */ '@/views/singer-detail.vue')
const Album = () => import(/* @vite-ignore */ '@/views/album.vue')
const topDetail = () => import(/* @vite-ignore */ '@/views/top-detail.vue')
const userCenter = () => import(/* @vite-ignore */ '@/views/user-center.vue')
const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Album
      }
    ]
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: singerDetail
      }
    ]
  },
  {
    path: '/top-list',
    component: TopList,
    children: [
      {
        path: ':id',
        component: topDetail
      }
    ]
  },
  {
    path: '/search',
    component: Search,
    children: [
      {
        path: ':id',
        component: singerDetail
      }
    ]
  },
  {
    path: '/user-center',
    component: userCenter
  }
]
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router
