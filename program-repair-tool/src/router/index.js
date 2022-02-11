import { createWebHistory, createRouter } from "vue-router"
import Home from "@/components/Home.vue";
import Main from "@/components/Main.vue";
import CreateProblems from '@/components/CreateProblems.vue'

const routes = [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/main",
      name: "Main",
      component: Main,
    },
    {
      path: "/create-problems",
      name: "CreateCroblems",
      component: CreateProblems
    }
  ];
  
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  
  export default router;
