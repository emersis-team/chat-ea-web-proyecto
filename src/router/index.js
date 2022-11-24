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
    component: () => import("../views/Login.vue"),
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
    props: true,
  },
  {
    path: "/admin-users",
    name: "admin-users",
    component: () => import("../views/AdminUsers.vue"),
  },
  {
    path: "/admin-groups",
    name: "admin-groups",
    component: () => import("../views/AdminGroups.vue"),
  },
  {
    path: "/admin-organizations",
    name: "admin-organizations",
    component: () => import("../views/AdminOrg.vue"),
  },
  {
    path: "/admin/addOrganization",
    name: "addOrganization",
    component: () => import("../views/AddOrganization.vue"),
  },
  {
    path: "/admin/addGroup",
    name: "addGroup",
    component: () => import("../views/AddGroup.vue"),
  },
  {
    path: "/admin/newAdmin",
    name: "newAdmin",
    component: () => import("../views/NewAdmin.vue"),
  },
  {
    path: "/admin/:user/:id",
    name: "updateUser",
    component: () => import("../views/UpdateUser.vue"),
  },
  {
    path: "/profile",
    name: "UserProfile",
    component: () => import("../views/UserProfile.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
