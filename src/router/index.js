import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
  {
		path: "/video",
		name: "video",
		component: () => import("../views/VideoCall.vue"),
	},
	{
		path: "/complete",
		name: "complete",
		component: () => import("../views/CompleteLogin.vue"),
		props: true
	},
  {
    path: "/admin",
    name: "admin",
    component: () => import("../views/Admin.vue"),
  },
  {
    path: "/admin/:user",
    name: "updateUser",
    component: () => import("../views/UpdateUser.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
