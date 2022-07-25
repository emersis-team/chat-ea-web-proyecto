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
    path: "/chat/:id/:user_dest_id",
    name: "chat",
    component: () => import(/* webpackChunkName: "chat" */ "../views/Chat.vue"),
  },
	{
		path: "/video",
		name: "video",
		component: () => import("../views/VideoCall.vue"),
	}
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
