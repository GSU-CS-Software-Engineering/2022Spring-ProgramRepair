/*
Vue router directs the browser to different components when certain URLs are entered.
This is done without reloading the page, so it is still focused entirely on the front end.
*/

import { createWebHistory, createRouter } from "vue-router"
import Home from "@/components/Home.vue";
import Main from "@/components/Main.vue";
import CreateProblems from '@/components/CreateProblems.vue'

/*
This defines a list of routes, and each route has a path, a name, and a component to move to.
The components were imported from other files, in this case.
*/

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

  /*
  This creates a router with the HTML5 history mode, which is the recommended one.
  This router will use the list of routes defined earlier.
  It was recommended to check some potential issues with using this history mode here: https://router.vuejs.org/guide/essentials/history-mode.html#hash-mode
  However, with the current state of the application this does not seem to be a problem, though it should be an easy fix if the issue ever does come up.
  */
  
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  /*
  the router is exported so that it can be imported in other files
  the default means that importing this file will automatically import the router, there is no need to specify the router itself
  */
  
  export default router;
