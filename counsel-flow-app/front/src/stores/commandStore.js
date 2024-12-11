import { defineStore } from "pinia";
import commandApi from "src/js/api/commandApi";
import { useAuthStore } from "./authStore";
import { computed } from "vue";
import FlowSystemCode from "src/js/common/FlowSystemCode";

const authStore = useAuthStore();

export const useCommandStore = defineStore("commandStore", {
  state: () => ({
    userEntityId: computed(() => authStore.entityId),
    commandMap: new Map(),
    initialLoaded: false,
  }),
  actions: {
    async loadCommand() {
      try {
        const response = await commandApi.getCommands(this.userEntityId);

        if (response.data.length !== 20) {
          // 상담유형과 상담내용 커맨드를 각각 10개씩 생성
          for (let i = 0; i < 10; i++) {
            const commandTypes = [FlowSystemCode.COMMAND_TYPE.COUNSEL_TYPE, FlowSystemCode.COMMAND_TYPE.TEXT];

            // 비동기 함수들이 순서대로 실행되도록 처리
            for (const commandType of commandTypes) {
              const param = {
                "entity.commandType": commandType,
                "entity.user.entityId": this.userEntityId,
              };
              const commandResponse = await commandApi.saveCommand(this.userEntityId, param);

              if (commandResponse.status === 200) {
                const commandEntityId = commandResponse.data.entityId;
                const customKey = i < 9 ? `${i + 1}` : "0";

                const keyList = [
                  {
                    keyType: FlowSystemCode.SHORT_CUT_KEY_TYPE.SPECIFIC,
                    customKey: FlowSystemCode.SHORT_CUT_SPECIFIC.CTRL,
                    orderNumber: 1,
                    personalCommand: { entityId: commandEntityId },
                  },
                  {
                    keyType: FlowSystemCode.SHORT_CUT_KEY_TYPE.DIGIT,
                    customKey: customKey, // 1 ~ 9, 0 순서로 설정
                    orderNumber: 2,
                    personalCommand: { entityId: commandEntityId },
                  },
                ];

                await commandApi.saveShortCutKeys(commandEntityId, keyList);

                const combinationKey = `${FlowSystemCode.SHORT_CUT_KEY_TYPE.SPECIFIC}-${FlowSystemCode.SHORT_CUT_SPECIFIC.CTRL}-${FlowSystemCode.SHORT_CUT_KEY_TYPE.DIGIT}-${customKey}`;

                if (!this.commandMap.has(combinationKey)) {
                  this.commandMap.set(combinationKey, []);
                }

                // commandMap에 항목을 추가 (commandType, command, entityId 포함)
                this.commandMap.get(combinationKey).push({
                  commandType: commandType,
                  command: null, // 초기 생성 시 command가 null인 경우
                  description: null, // 초기 생성시 description가 null인 경우
                  entityId: commandEntityId, // entityId 추가
                });
              }
            }
          }
        } else {
          this.createShortCupMap(response.data);
        }
      } catch (error) {
        throw error;
      }
    },

    async fetchInitialData() {
      if (!this.initialLoaded) {
        this.initialLoaded = true;
        try {
          const response = await commandApi.getCommands(this.userEntityId);

          if (response.data.length !== 20) {
            // 상담유형과 상담내용 커맨드를 각각 10개씩 생성
            for (let i = 0; i < 10; i++) {
              const commandTypes = [FlowSystemCode.COMMAND_TYPE.COUNSEL_TYPE, FlowSystemCode.COMMAND_TYPE.TEXT];

              // 비동기 함수들이 순서대로 실행되도록 처리
              for (const commandType of commandTypes) {
                const param = {
                  "entity.commandType": commandType,
                  "entity.user.entityId": this.userEntityId,
                };
                const commandResponse = await commandApi.saveCommand(this.userEntityId, param);

                if (commandResponse.status === 200) {
                  const commandEntityId = commandResponse.data.entityId;
                  const customKey = i < 9 ? `${i + 1}` : "0";

                  const keyList = [
                    {
                      keyType: FlowSystemCode.SHORT_CUT_KEY_TYPE.SPECIFIC,
                      customKey: FlowSystemCode.SHORT_CUT_SPECIFIC.CTRL,
                      orderNumber: 1,
                      personalCommand: { entityId: commandEntityId },
                    },
                    {
                      keyType: FlowSystemCode.SHORT_CUT_KEY_TYPE.DIGIT,
                      customKey: customKey, // 1 ~ 9, 0 순서로 설정
                      orderNumber: 2,
                      personalCommand: { entityId: commandEntityId },
                    },
                  ];

                  await commandApi.saveShortCutKeys(commandEntityId, keyList);

                  const combinationKey = `${FlowSystemCode.SHORT_CUT_KEY_TYPE.SPECIFIC}-${FlowSystemCode.SHORT_CUT_SPECIFIC.CTRL}-${FlowSystemCode.SHORT_CUT_KEY_TYPE.DIGIT}-${customKey}`;

                  if (!this.commandMap.has(combinationKey)) {
                    this.commandMap.set(combinationKey, []);
                  }

                  // commandMap에 항목을 추가 (commandType, command, entityId 포함)
                  this.commandMap.get(combinationKey).push({
                    commandType: commandType,
                    command: null, // 초기 생성 시 command가 null인 경우
                    description: null, // 초기 생성시 description가 null인 경우
                    entityId: commandEntityId, // entityId 추가
                  });
                }
              }
            }
          } else {
            this.createShortCupMap(response.data);
          }
        } catch (error) {
          this.initialLoaded = false;
          throw error;
        }
      } else {
        return Promise.resolve();
      }
    },

    createShortCupMap(data) {
      data.forEach((command) => {
        let combinationKey = "";
        command.shortCutKeys.forEach((key) => {
          combinationKey += `${key.keyType}-${key.customKey}-`;
        });
        combinationKey = combinationKey.slice(0, -1);

        // commandMap에 해당 key가 없다면 새로 추가
        if (!this.commandMap.has(combinationKey)) {
          this.commandMap.set(combinationKey, []);
        }

        const commandList = this.commandMap.get(combinationKey);

        // commandList 내에서 해당 commandType의 항목을 찾기
        const existingIndex = commandList.findIndex((entry) => entry.commandType === command.commandType);

        if (existingIndex !== -1) {
          // 기존 항목이 있으면 업데이트
          commandList[existingIndex] = {
            commandType: command.commandType,
            command: command.command,
            description: command.description,
            entityId: command.entityId,
          };
        } else {
          // 기존 항목이 없다면 새로 추가
          commandList.push({
            commandType: command.commandType,
            command: command.command,
            description: command.description,
            entityId: command.entityId,
          });
        }

        // commandMap에 업데이트된 배열 다시 설정
        this.commandMap.set(combinationKey, commandList);
      });
    },

    clearInitialData() {
      this.initialLoaded = false;
      this.commandMap = new Map();
    },
  },
  getters: {},
});
