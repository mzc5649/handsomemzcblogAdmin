import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '仪表面板', icon: 'dashboard' }
    }]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/userTable',
    name: 'User',
    meta: { title: '用户管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'userTable',
        name: 'UserTable',
        component: () => import('@/views/table/user/index'),
        meta: { title: '用户列表', icon: 'table' }
      }
    ]
  },
  {
    path: '/article',
    component: Layout,
    redirect: '/article/articleTable',
    name: 'Article',
    meta: { title: '文章管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'articleTable',
        name: 'ArticleTable',
        component: () => import('@/views/table/article/index'),
        meta: { title: '文章列表', icon: 'table' }
      },
      {
        path: 'form',
        name: 'Form',
        component: () => import('@/views/form/article/add/index'),
        meta: { title: '添加文章', icon: 'table' }
      },
      {
        path: 'edit/:id',
        name: 'EditArticle',
        hidden: true,
        component: () => import('@/views/form/article/edit/index'),
        meta: { title: '编辑文章', icon: 'table' }
      }
    ]
  },
  {
    path: '/classify',
    component: Layout,
    redirect: '/classify/classifyTree',
    name: 'Classify',
    meta: { title: '分类管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'classifyTree',
        name: 'ClassifyTree',
        component: () => import('@/views/tree/classify/index'),
        meta: { title: '分类列表', icon: 'tree' }
      },
      {
        path: 'addClassify',
        name: 'AddClassify',
        component: () => import('@/views/form/classify/add/index'),
        meta: { title: '添加分类', icon: 'tree' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
