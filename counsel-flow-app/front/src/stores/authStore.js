import { defineStore } from "pinia";
import authApi from "src/js/api/authApi";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    loggedIn: null,
    entityId: null,
    useTypeCode: null,
    id: null,
    name: null,
    email: null,
    roleGroup: null,
    organization: null,
    ctiLoginId: null,
    ctiLoginPassword: null,
    ctiExtension: null,
    ctiAutoLogin: false,
  }),
  actions: {
    login(param) {
      this.loggedIn = true;
      this.entityId = param.entityId;
      this.useTypeCode = param.useTypeCode;
      this.id = param.id;
      this.name = param.name;
      this.email = param.email;
      this.roleGroup = param.roleGroup;
      this.organization = param.organization;
      this.ctiLoginId = param.ctiLoginId;
      this.ctiLoginPassword = param.ctiLoginPassword;
      this.ctiExtension = param.ctiExtension;
      this.ctiAutoLogin = param.ctiAutoLogin;
      return Promise.resolve();
    },
    logout() {
      this.loggedIn = false;
      this.entityId = null;
      this.useTypeCode = null;
      this.id = null;
      this.name = null;
      this.email = null;
      this.roleGroup = null;
      this.organization = null;
      this.ctiLoginId = null;
      this.ctiLoginPassword = null;
      this.ctiExtension = null;
      this.ctiAutoLogin = false;
    },
    getRefreshToken() {
      return localStorage.getItem("refreshToken");
    },
    getRefreshTokenExpiresIn() {
      return localStorage.getItem("refreshTokenExpiresIn");
    },
    isTokenExpired() {
      const expiresIn = this.getRefreshTokenExpiresIn();

      if (!expiresIn) return true;

      // expiresIn이 yyyy-MM-dd HH:mm:ss 형식의 문자열이라고 가정
      const tokenExpiryTime = Date.parse(expiresIn.replace(" ", "T")); // 문자열을 ISO 8601 형식으로 변환

      const currentTime = new Date().getTime();

      return currentTime > tokenExpiryTime;
    },
    getCtiAutoLogin() {
      return localStorage.getItem("saveCTI") === "true";
    },
    clearLoginStorage() {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("accessExpirationTime");
      localStorage.removeItem("accessTokenExpiresIn");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("refreshExpirationTime");
      localStorage.removeItem("refreshTokenExpiresIn");
    },
    async checkLoginStatus() {
      if (this.getRefreshToken()) {
        if (this.isTokenExpired()) {
          this.clearLoginStorage();
          this.loggedIn = false;
          this.entityId = null;
          this.useTypeCode = null;
          this.id = null;
          this.name = null;
          this.email = null;
          this.roleGroup = null;
          this.organization = null;
          this.ctiLoginId = null;
          this.ctiLoginPassword = null;
          this.ctiExtension = null;
          this.ctiAutoLogin = false;
          return {
            loggedIn: this.loggedIn,
            entityId: this.entityId,
            useTypeCode: this.useTypeCode,
            id: this.id,
            name: this.name,
            email: this.email,
            roleGroup: this.roleGroup,
            organization: this.organization,
            ctiLoginId: this.ctiLoginId,
            ctiLoginPassword: this.ctiLoginPassword,
            ctiExtension: this.ctiExtension,
            ctiAutoLogin: this.ctiAutoLogin,
          };
        }

        if (this.loggedIn === null) {
          try {
            const response = await authApi.getUserInfo();
            this.loggedIn = true;
            this.entityId = response.data.entityId;
            this.useTypeCode = response.data.useTypeCode;
            this.id = response.data.id;
            this.name = response.data.name;
            this.email = response.data.email;
            this.roleGroup = response.data.roleGroup;
            this.organization = response.data.organization;
            this.ctiLoginId = response.data.ctiLoginId;
            this.ctiLoginPassword = response.data.ctiLoginPassword;
            this.ctiExtension = localStorage.getItem("ctiExtension") || response.data.ctiExtension;
            this.ctiAutoLogin = this.getCtiAutoLogin();
          } catch (error) {
            this.loggedIn = false;
            this.entityId = null;
            this.useTypeCode = null;
            this.id = null;
            this.name = null;
            this.email = null;
            this.roleGroup = null;
            this.organization = null;
            this.ctiLoginId = null;
            this.ctiLoginPassword = null;
            this.ctiExtension = null;
            this.ctiAutoLogin = false;
            this.clearLoginStorage();
            console.log(error);
          }
        }
      }
      return {
        loggedIn: this.loggedIn,
        entityId: this.entityId,
        useTypeCode: this.useTypeCode,
        id: this.id,
        name: this.name,
        email: this.email,
        roleGroup: this.roleGroup,
        organization: this.organization,
        ctiLoginId: this.ctiLoginId,
        ctiLoginPassword: this.ctiLoginPassword,
        ctiExtension: this.ctiExtension,
        ctiAutoLogin: this.ctiAutoLogin,
      };
    },
  },
  getters: {},
});
