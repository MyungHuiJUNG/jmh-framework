import { boot } from "quasar/wrappers";
import { useAuthStore } from "src/stores/authStore";

export default boot(({ router }) => {
  const authStore = useAuthStore();

  router.beforeEach((to, from, next) => {
    const isPublic = to.meta.public;

    authStore.checkLoginStatus().then((state) => {
      const isLoggedIn = state.loggedIn;

      // 공개 페이지일 경우
      if (isPublic) {
        // 로그인 한 상태에서 로그인 페이지 요청 시
        if (isLoggedIn && to.name === "login") {
          return next({ name: "main" });
        }
        // 나머지 공개 페이지
        return next();
      }

      // 로그인 되었으면 진행, 아닐 경우 로그인 페이지로
      if (isLoggedIn) {
        return next();
      } else {
        return next({ name: "login" });
      }
    });
  });
});
