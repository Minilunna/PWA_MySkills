import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";

// lazy-loaded
const Profile = () => import("@/views/Profile.vue")
const SkillsBoard = () => import("@/views/SkillsBoard.vue")
const SkillSearch = () => import("@/views/SkillSearch.vue")
const SkillManage = () => import("@/views/SkillManage.vue")

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/home",
    component: Home,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
  },
  {
    path: "/skills",
    name: "skills",
    component: SkillsBoard,
  },
  {
    path: "/skills-search",
    name: "skills-search",
    component: SkillSearch,
  },
  {
    path: "/skills-manage",
    name: "skills-manage",
    component: SkillManage,
  },
  

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

//Route Guards
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/home', '/'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = !!JSON.parse(localStorage.getItem('token'));

  // trying to access a restricted page + not logged in redirect to login page
  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;
