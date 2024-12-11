import { defineStore } from "pinia";

import SockJS from "sockjs-client/dist/sockjs.min.js";
import Stomp from "webstomp-client";

import { useAuthStore } from "stores/authStore";

export const useWebSocket = defineStore("websocket", {
  state: () => ({
    webSocket: null,
    webSocketInitUrl: "/ws",
    webStompClient: null,
    subscribeList: [],
    subscribeId: null,
    authStore: useAuthStore(),
  }),

  actions: {
    connect(webSocketPrefixUrl, token, connectSuccessCallback, connectFailCallback) {
      if (this.webStompClient !== null) return console.log("[flow] websocket already connected.");

      if (webSocketPrefixUrl !== null && webSocketPrefixUrl !== undefined && webSocketPrefixUrl.length !== 0)
        this.webSocketInitUrl = "/ws" + webSocketPrefixUrl;

      if (connectSuccessCallback === null || connectSuccessCallback === undefined)
        connectSuccessCallback = function () {
          console.log("[flow] websocket is success connect");
        };

      if (connectFailCallback === null || connectFailCallback === undefined)
        connectFailCallback = function () {
          console.log("[flow] websocket is fail connect");
        };

      this.webSocket = new SockJS(this.webSocketInitUrl);
      this.webStompClient = Stomp.over(this.webSocket);
      let headers = {
        Authorization: `Bearer ${token}`,
      };

      this.webStompClient.connect(
        { Authorization: `Bearer ${token}` },
        () => {
          this.subscribe();
          connectSuccessCallback();
        },
        () => {
          this.webStompClient = null;
          connectFailCallback();
        }
      );
    },

    disconnect() {
      if (this.webStompClient === null) return console.log("[flow] websocket already disconnected.");

      this.webStompClient.disconnect(
        function () {
          this.webStompClient = null;
          return console.log("[flow] websocket disconnected.");
        }.bind(this)
      );
    },

    isConnected() {
      return this.webStompClient !== null;
    },

    isReady() {
      return this.webSocket.readyState === 1;
    },

    subscribe() {
      if (this.webStompClient === null) return console.log("[flow] websocket is not connected.");

      if (this.webSocket.readyState !== 1) return console.log("[flow] websocket is not ready");

      if (!this.authStore) return console.log("[flow] login data is empty");

      if (!this.authStore.id) return console.log("[flow] login id is empty");

      if (this.subscribeList.length > 0) {
        this.subscribeList.forEach(
          function (subscribe) {
            if (subscribe.appendUserId !== false)
              subscribe.subscribeUrl = subscribe.subscribeUrl + "/" + this.authStore.id;

            this.webStompClient.subscribe(
              subscribe.subscribeUrl,
              function (msg) {
                let message = null;

                if (msg.body === null || msg.body === undefined || msg.body.length === 0) message = {};
                else message = JSON.parse(msg.body);

                if (
                  subscribe.onMessageListener === null ||
                  subscribe.onMessageListener === undefined ||
                  subscribe.onMessageListener.length === 0
                )
                  subscribe.onMessageListener = function () {
                    console.log(message, subscribe.subscribeId);
                  };

                subscribe.onMessageListener(message, subscribe.subscribeId);
              }.bind(this),
              { id: subscribe.subscribeId }
            );
          }.bind(this)
        );

        this.subscribeList = [];
      }
    },

    unsubscribe(subscribeId) {
      if (this.webStompClient === null) return console.log("[flow] websocket is not connected.");

      if (subscribeId === null || subscribeId === undefined || subscribeId.length === 0)
        return console.log("[flow] subscribe id is empty");

      return this.webStompClient.unsubscribe(subscribeId);
    },

    addsubscribe(subscribeUrl, onMessageListener, subscribeId, appendUserId) {
      if (subscribeUrl === null || subscribeUrl === undefined || subscribeUrl.length === 0)
        return console.log("[flow] subscribe url is empty");

      if (subscribeId === null || subscribeId === undefined || subscribeId.length === 0)
        subscribeId = "webSocket-subscribeId-" + Math.floor(Math.random() * 1000000);

      if (appendUserId === null || appendUserId === undefined) appendUserId = true;

      this.subscribeList.push({
        subscribeUrl: subscribeUrl,
        onMessageListener: onMessageListener,
        subscribeId: subscribeId,
        appendUserId: appendUserId,
      });

      if (this.webStompClient !== null && this.webSocket.readyState === 1) this.subscribe();
    },

    disableStompConsole() {
      if (this.webStompClient === null) return console.log("[flow] websocket is not connected.");

      this.webStompClient.debug = function () {};
    },

    sendTest() {},
  },
});
