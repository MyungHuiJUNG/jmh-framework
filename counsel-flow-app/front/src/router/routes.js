const routes = [
  {
    path: "/login",
    component: () => import("layouts/LoginLayout.vue"),
    name: "login",
    meta: { public: true },
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "view/main", component: () => import("pages/MainPage.vue"), name: "main" }],
  },
  {
    path: "/",
    component: () => import("layouts/PopupLayout.vue"),
    children: [
      {
        path: "view/ticketDetail",
        component: () => import("components/ticket/TicketDetailWindowPopup.vue"),
        name: "ticketDetailPop",
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/ScriptPopupLayout.vue"),
    children: [
      {
        path: "view/counselTypeScript",
        component: () => import("components/script/ScriptWindowPopup.vue"),
        name: "counselTypeScript",
      },
    ],
  },
  {
    path: "/view/winpopup",
    component: () => import("components/common/base/AppWinPopupBase.vue"),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/error/ErrorNotFound.vue"),
  },
];

export default routes;
