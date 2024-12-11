import CounselFlowHubVoiceChannel from "../../CounselFlowHubVoiceChannel";
import CounselFlowHubVoiceChannelIpronConsole from "./CounselFlowHubVoiceChannelIpronConsole";
import CounselFlowHubVoiceChannelIpronEventHandler from "./CounselFlowHubVoiceChannelIpronEventHandler";
import CounselFlowHubChannelEvent from "../../../../domain/CounselFlowHubChannelEvent";
import CounselFlowHubVoiceCallInfo from "../../domain/CounselFlowHubVoiceCallInfo";
import CounselFlowHubVoiceChannelIpronFetcher from "./fetcher/CounselFlowHubVoiceChannelIpronFetcher";

export default class CounselFlowHubVoiceChannelIpron extends CounselFlowHubVoiceChannel {

    constructor(channelType) {
        super(channelType);

        this.isLogoutByUser = false;
        this.absenceReasonCodes = [];
        this.eventHandler = new CounselFlowHubVoiceChannelIpronEventHandler(this);
        this.fetcher = new CounselFlowHubVoiceChannelIpronFetcher(this);

        this.commandQueue = [];
        this.checkQueueAndCommand();
    }

    connect() {
        CounselFlowHubVoiceChannelIpronConsole.log("[counsel-flow-hub/voice/ipron] connect");

        if (this.options === null)
            throw new Error("[counsel-flow-hub/voice/ipron] you must set options");

        ipron.SetProtocol(this.options.protocol);
        ipron.SetServerInfo(this.options.activeServer, this.options.activePort, this.options.standbyServer, this.options.standbyPort);
        ipron.OpenServer(this.options.appName, this.eventHandler.onEvent.bind(this.eventHandler), this.eventHandler.onResponse.bind(this.eventHandler));

        return this.eventHandler.newPromise("server");
    }

    disconnect() {
        CounselFlowHubVoiceChannelIpronConsole.log("[counsel-flow-hub/voice/ipron] disconnect");

        ipron.CloseServer();

        return this.eventHandler.newPromise("server");
    }

    requestChannelState(agentId) {
        return this.pushCommand((promiseObject) => {
            CounselFlowHubVoiceChannelIpronConsole.log("[counsel-flow-hub/voice/ipron] requestAgentState");

            if (agentId === null || agentId === undefined)
                ipron.GetAgentState(this.options.tenant, this.channelInfo.id, "", 0, 0);
            else
                ipron.GetAgentState(this.options.tenant, agentId, "", 0, 0);

            this.applyEventHandlerPromise(promiseObject);
        })
        .then((data) => {
            const channelInfo = {
                state: CounselFlowHubVoiceChannelIpronEventHandler.parseChannelState(data.voipagentstate),
                subState: null
            };
            if (data.voipagentstate === "20" || data.voipagentstate === 20) {
                channelInfo.state = CounselFlowHubVoiceCode.ChannelState.ABSENCE;
                channelInfo.subState = -999;
            }

            if (agentId === null || agentId === undefined) {
                this.channelInfo.state = channelInfo.state;
                this.channelInfo.subState = channelInfo.subState;
            }

            return channelInfo;
        });
    }

    login(channelInfo) {
        return this.pushCommand((promiseObject) => {
            CounselFlowHubVoiceChannelIpronConsole.log("[counsel-flow-hub/voice/ipron] login : channelInfo=>", channelInfo);

            if (channelInfo === null || channelInfo === undefined)
                throw new Error("[counsel-flow-hub/voice/ipron] invalid channelInfo");

            this.channelInfo.id = channelInfo.id;
            this.channelInfo.password = channelInfo.password;
            this.channelInfo.extension = channelInfo.extension;

            ipron.Register(this.channelInfo.extension, this.options.tenant);

            this.applyEventHandlerPromise(promiseObject);
        })
        .then(() => {
            return this.pushCommand((promiseObject) => {
                ipron.GetStateSubcode(this.options.tenant, 30);

                this.applyEventHandlerPromise(promiseObject);
            });
        })
        .then((data) => {
            return this.pushCommand((promiseObject) => {
                if (data.extensiondata !== undefined) {
                    const keys = Object.keys(data.extensiondata);
                    keys.forEach(function(key) {
                        let name = data.extensiondata[key];
                        if (name instanceof Array && name.length > 0)
                            name = name[0];
                        this.absenceReasonCodes.push({ name: name, value: key });
                    }.bind(this));
                }

                let agentState = 20;
                if (this.options.stateAfterLogin !== null) {
                    agentState = 30;
                    if (this.options.stateAfterCall === CounselFlowHubVoiceCode.ChannelState.ABSENCE)
                        agentState = 30;
                    else if (this.options.stateAfterCall === CounselFlowHubVoiceCode.ChannelState.READY)
                        agentState = 40;
                    else if (this.options.stateAfterCall === CounselFlowHubVoiceCode.ChannelState.READY)
                        agentState = 60;
                }

                let agentStateSub = "";
                if (this.options.stateSubAfterLogin !== null)
                    agentStateSub = this.options.stateSubAfterLogin;

                ipron.AgentLogin(this.channelInfo.extension, this.channelInfo.id, this.channelInfo.password, this.options.tenant, agentState, agentStateSub, 0, 4, 0);

                this.applyEventHandlerPromise(promiseObject);
            });
        })
        .then((data) => {
            const state = CounselFlowHubVoiceChannelIpronEventHandler.parseChannelState(data.agentstate);
            if (state === CounselFlowHubVoiceCode.ChannelState.NOTLOGIN) {
                this.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.ABSENCE;
                this.channelInfo.subState = -999;
            }
            else if (state === CounselFlowHubVoiceCode.ChannelState.ACTIVE) {
                this.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.ACTIVE;
                this.channelInfo.callInfo = new CounselFlowHubVoiceCallInfo();
            }

            let aftCallState = -1;
            if (this.options.stateAfterCall === CounselFlowHubVoiceCode.ChannelState.ABSENCE)
                aftCallState = 30;
            else if (this.options.stateAfterCall === CounselFlowHubVoiceCode.ChannelState.READY)
                aftCallState = 40;
            else if (this.options.stateAfterCall === CounselFlowHubVoiceCode.ChannelState.PROCESS)
                aftCallState = 60;

            if (aftCallState !== -1) {
                return this.pushCommand((promiseObject) => {
                    ipron.SetAFTCallState(this.channelInfo.id, this.options.tenant, aftCallState, 0);

                    this.applyEventHandlerPromise(promiseObject);
                });
            }
        })
        .then(() => {
            if (this.channelInfo.state === CounselFlowHubVoiceCode.ChannelState.ABSENCE && this.channelInfo.subState === -999) {
                this.occurEvent(new CounselFlowHubChannelEvent(this.channelType, this.channelInfo, new Date()));
            }
            else if (this.channelInfo.state === CounselFlowHubVoiceCode.ChannelState.ACTIVE) {
                return this.pushCommand((promiseObject) => {
                    ipron.GetConnectionEx(this.channelInfo.extension);

                    this.applyEventHandlerPromise(promiseObject);
                });
            }
        })
        .then((data) => {
            if (data !== undefined && data.extensiondata !== undefined) {
                const connectionInfos = CounselFlowHubVoiceChannelIpronEventHandler.extractConnectionInfos(data.extensiondata);
                if (connectionInfos.length > 0) {
                    const connectionInfo = connectionInfos[connectionInfos.length - 1];
                    this.channelInfo.callInfo.callType = CounselFlowHubVoiceCode.CallType.NORMAL;
                    this.channelInfo.callInfo.callId = Number(connectionInfo.callId);
                    this.channelInfo.callInfo.connectionId = connectionInfo.connectionId;
                }
            }

            if (this.channelInfo.state === CounselFlowHubVoiceCode.ChannelState.ACTIVE ||
                this.channelInfo.state === CounselFlowHubVoiceCode.ChannelState.HELD ||
                this.channelInfo.state === CounselFlowHubVoiceCode.ChannelState.RINGBACK ||
                this.channelInfo.state === CounselFlowHubVoiceCode.ChannelState.OFFERING)
                this.occurEvent(new CounselFlowHubChannelEvent(this.channelType, this.channelInfo, new Date()));
        });
    }

    logout(reasonCode) {
        return this.pushCommand((promiseObject) => {
            CounselFlowHubVoiceChannelIpronConsole.log("[counsel-flow-hub/voice/ipron] logout : reasonCode=>", reasonCode);

            this.isLogoutByUser = true;
            ipron.isAsyncWhenLogout = (reasonCode !== "refresh");
            ipron.AgentLogout(this.channelInfo.extension, this.channelInfo.id, this.options.tenant, 0);

            this.applyEventHandlerPromise(promiseObject);
        })
        .then(() => {
            this.isLogoutByUser = false;
            this.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.NOTLOGIN;
            this.channelInfo.subState = null;
            this.occurEvent(new CounselFlowHubChannelEvent(this.channelType, this.channelInfo, new Date()));
        })
        .then(() => {
            return this.pushCommand((promiseObject) => {
                ipron.Unregister(this.channelInfo.extension, this.options.tenant);

                this.applyEventHandlerPromise(promiseObject);
            });
        });
    }

    ready() {
        return this.pushCommand((promiseObject) => {
            CounselFlowHubVoiceChannelIpronConsole.log("[counsel-flow-hub/voice/ipron] ready");

            ipron.SetAgentState(this.channelInfo.id, this.options.tenant, 40, "", 0, 0);

            this.applyEventHandlerPromise(promiseObject);
        });
    }

    absence(reasonCode) {
        return this.pushCommand((promiseObject) => {
            CounselFlowHubVoiceChannelIpronConsole.log("[counsel-flow-hub/voice/ipron] absense : reasonCode=>", reasonCode);

            ipron.SetAgentState(this.channelInfo.id, this.options.tenant, 30, reasonCode, 0, 0);

            this.applyEventHandlerPromise(promiseObject);
        });
    }

    dial(dial) {
        return this.pushCommand((promiseObject) => {
            CounselFlowHubVoiceChannelIpronConsole.log("[counsel-flow-hub/voice/ipron] dial : dial=>", dial);

            let extensionHandle = 0;
            if (dial.extraData !== undefined && dial.extraData !== null) {
                extensionHandle = ipron.EXTCreateExtension();
                CounselFlowHubVoiceChannelIpron.addExtraData(extensionHandle, dial.extraData);
            }

            const dialData = CounselFlowHubVoiceChannelIpron.makeDialData(dial);
            ipron.MakeCall(this.channelInfo.extension, dial.calledId, dialData.obCallingDn,
                dialData.skillLevel, dialData.priority, dialData.relationAgentDn, dialData.relationAgentId,
                dialData.relationMethod, dialData.routeMethod, dialData.routeSkillId, dialData.routeGroupId,
                dialData.Ucid, extensionHandle, 0, dialData.usePrevAgent, dialData.useDesignatedAgent, dialData.relationTimeout);

            this.applyEventHandlerPromise(promiseObject);
        });
    }

    acceptCall() {
        return this.pushCommand((promiseObject) => {
            CounselFlowHubVoiceChannelIpronConsole.log("[counsel-flow-hub/voice/ipron] accept call");

            let connectionId = "";
            if (this.channelInfo.callInfo.connectionId !== null)
                connectionId = this.channelInfo.callInfo.connectionId;

            ipron.AnswerCall(this.channelInfo.extension, connectionId, 0, 0);

            this.applyEventHandlerPromise(promiseObject);
        });
    }

    rejectCall(reasonCode) {
        return this.pushCommand((promiseObject) => {
            CounselFlowHubVoiceChannelIpronConsole.log("[counsel-flow-hub/voice/ipron] reject call : reasonCode=>", reasonCode);

            let connectionId = "";
            if (this.channelInfo.callInfo.connectionId !== null)
                connectionId = this.channelInfo.callInfo.connectionId;

            ipron.ClearCall(this.channelInfo.extension, connectionId, 0, 0);

            this.applyEventHandlerPromise(promiseObject);
        });
    }

    hold() {
        return this.pushCommand((promiseObject) => {
            CounselFlowHubVoiceChannelIpronConsole.log("[counsel-flow-hub/voice/ipron] hold");

            let connectionId = "";
            if (this.channelInfo.callInfo.connectionId !== null)
                connectionId = this.channelInfo.callInfo.connectionId;

            ipron.HoldCall(this.channelInfo.extension, connectionId, 0, 0);

            this.applyEventHandlerPromise(promiseObject);
        });
    }

    retrieve() {
        return this.pushCommand((promiseObject) => {
            CounselFlowHubVoiceChannelIpronConsole.log("[counsel-flow-hub/voice/ipron] retrieve");

            let connectionId = "";
            if (this.channelInfo.callInfo.connectionId !== null)
                connectionId = this.channelInfo.callInfo.connectionId;

            ipron.RetrieveCall(this.channelInfo.extension, connectionId, 0, 0);

            this.applyEventHandlerPromise(promiseObject);
        });
    }

    hangup() {
        return this.pushCommand((promiseObject) => {
            CounselFlowHubVoiceChannelIpronConsole.log("[counsel-flow-hub/voice/ipron] hangup");

            let connectionId = "";
            if (this.channelInfo.callInfo.connectionId !== null)
                connectionId = this.channelInfo.callInfo.connectionId;

            ipron.ClearCall(this.channelInfo.extension, connectionId, 0, 0);

            this.applyEventHandlerPromise(promiseObject);
        });
    }

    consult(dial, callType, options) {
        return this.pushCommand((promiseObject) => {
            CounselFlowHubVoiceChannelIpronConsole.log("[counsel-flow-hub/voice/ipron] consult : ", dial, callType, options);

            const extensionHandle = ipron.EXTCreateExtension();
            ipron.EXTAddRecord(extensionHandle, "xferData", JSON.stringify(this.channelInfo.callInfo));
            if (dial.extraData !== undefined && dial.extraData !== null)
                CounselFlowHubVoiceChannelIpron.addExtraData(extensionHandle, dial.extraData);

            const dialData = CounselFlowHubVoiceChannelIpron.makeDialData(dial);
            ipron.MakeCall(this.channelInfo.extension, dial.calledId, dialData.obCallingDn,
                dialData.skillLevel, dialData.priority, dialData.relationAgentDn, dialData.relationAgentId,
                dialData.relationMethod, dialData.routeMethod, dialData.routeSkillId, dialData.routeGroupId,
                dialData.Ucid, extensionHandle, 0, dialData.usePrevAgent, dialData.useDesignatedAgent, dialData.relationTimeout);

            this.applyEventHandlerPromise(promiseObject);
        });
    }

    transfer(dial) {
        return this.pushCommand((promiseObject) => {
            CounselFlowHubVoiceChannelIpronConsole.log("[counsel-flow-hub/voice/ipron] transfer : dial=>", dial);

            if (this.channelInfo.callInfo.callType === CounselFlowHubVoiceCode.CallType.CONSULT) {
                let extensionHandle = 0;
                if (dial.extraData !== undefined && dial.extraData !== null) {
                    extensionHandle = ipron.EXTCreateExtension();
                    CounselFlowHubVoiceChannelIpron.addExtraData(extensionHandle, dial.extraData);
                }

                ipron.MuteTransfer(this.channelInfo.extension, this.channelInfo.callInfo.xferConnectionId, dial.calledId, extensionHandle, 0);
            }
            else {
                let connectionId = "";
                if (this.channelInfo.callInfo.connectionId !== null)
                    connectionId = this.channelInfo.callInfo.connectionId;

                const extensionHandle = ipron.EXTCreateExtension();
                ipron.EXTAddRecord(extensionHandle, "direct", JSON.stringify({type: "TRANSFER"}));
                ipron.EXTAddRecord(extensionHandle, "xferData", JSON.stringify(this.channelInfo.callInfo));
                if (dial.extraData !== undefined && dial.extraData !== null)
                    CounselFlowHubVoiceChannelIpron.addExtraData(extensionHandle, dial.extraData);

                const dialData = CounselFlowHubVoiceChannelIpron.makeDialData(dial);
                ipron.SinglestepTransfer(this.channelInfo.extension, connectionId, dial.calledId, dialData.obCallingDn,
                    dialData.skillLevel, dialData.priority, dialData.relationAgentDn, dialData.relationAgentId,
                    dialData.relationMethod, dialData.routeMethod, dialData.routeSkillId, dialData.routeGroupId, extensionHandle, 0,
                    dialData.usePrevAgent, dialData.useDesignatedAgent, dialData.relationTimeout);
            }

            this.applyEventHandlerPromise(promiseObject);
        });
    }

    conference(dial) {
        return this.pushCommand((promiseObject) => {
            CounselFlowHubVoiceChannelIpronConsole.log("[counsel-flow-hub/voice/ipron] conference: dial=>", dial);

            if (this.channelInfo.callInfo.callType === CounselFlowHubVoiceCode.CallType.CONSULT) {
                let extensionHandle = 0;
                if (dial.extraData !== undefined && dial.extraData !== null) {
                    extensionHandle = ipron.EXTCreateExtension();
                    CounselFlowHubVoiceChannelIpron.addExtraData(extensionHandle, dial.extraData);
                }

                const dialData = CounselFlowHubVoiceChannelIpron.makeDialData(dial);
                ipron.Conference(this.channelInfo.extension, this.channelInfo.callInfo.xferConnectionId, this.channelInfo.callInfo.calledId,
                    dialData.obCallingDn, dialData.partyType, extensionHandle, 0);
            }
            else {
                let connectionId = "";
                if (this.channelInfo.callInfo.connectionId !== null)
                    connectionId = this.channelInfo.callInfo.connectionId;

                const extensionHandle = ipron.EXTCreateExtension();
                ipron.EXTAddRecord(extensionHandle, "direct", JSON.stringify({type: "CONFERENCE"}));
                ipron.EXTAddRecord(extensionHandle, "xferData", JSON.stringify(this.channelInfo.callInfo));
                if (dial.extraData !== undefined && dial.extraData !== null)
                    CounselFlowHubVoiceChannelIpron.addExtraData(extensionHandle, dial.extraData);

                const dialData = CounselFlowHubVoiceChannelIpron.makeDialData(dial);
                ipron.SinglestepConference(this.channelInfo.extension, connectionId, dial.calledId, dialData.obCallingDn,
                    dialData.partyType, extensionHandle, 0);
            }

            this.applyEventHandlerPromise(promiseObject);
        });
    }

    getFetcher() {
        return this.fetcher;
    }

    checkQueueAndCommand() {
        if (this.commandQueue.length === 0) {
            setTimeout(this.checkQueueAndCommand.bind(this), 50);
            return;
        }

        const command = this.commandQueue.splice(0, 1);
        command[0].func(command[0].promiseObject);
    }

    pushCommand(func) {
        const promiseObject = {
            promise: null,
            resolve: null,
            reject: null
        };

        promiseObject.promise = new Promise(function(a, b) {
            promiseObject.resolve = a;
            promiseObject.reject = b;
        });

        this.commandQueue.push({
            func: func,
            promiseObject: promiseObject
        });

        return promiseObject.promise;
    }

    applyEventHandlerPromise(promiseObject) {
        this.eventHandler.newPromise()
            .then(function(data) {
                promiseObject.resolve(data);
            })
            .catch(function(error) {
                promiseObject.reject(error);
            })
            .finally(function() {
                this.checkQueueAndCommand();
            }.bind(this));
    }

    static makeDialData(dial) {
        const obCallingDn = (dial.obCallingDn !== undefined ? dial.obCallingDn : "");
        const skillLevel = (dial.skillLevel !== undefined ? dial.skillLevel : 0);
        const priority = (dial.priority !== undefined ? dial.priority : 0);
        const relationAgentDn = (dial.relationAgentDn !== undefined ? dial.relationAgentDn : "");
        const relationAgentId = (dial.relationAgentId !== undefined ? dial.relationAgentId : "");
        const relationMethod = (dial.relationMethod !== undefined ? dial.relationMethod : 0);
        const routeMethod = (dial.routeMethod !== undefined ? dial.routeMethod : 0);
        const routeSkillId = (dial.routeSkillId !== undefined ? dial.routeSkillId : 0);
        const routeGroupId = (dial.routeGroupId !== undefined ? dial.routeGroupId : 0);
        const Ucid = (dial.Ucid !== undefined ? dial.Ucid : "");
        const usePrevAgent = (dial.usePrevAgent !== undefined ? dial.usePrevAgent : 0);
        const useDesignatedAgent = (dial.useDesignatedAgent !== undefined ? dial.useDesignatedAgent : 0);
        const relationTimeout = (dial.relationTimeout !== undefined ? dial.relationTimeout : 0);
        const partyType = (dial.partyType !== undefined ? dial.partyType : 1);

        return {
            obCallingDn: obCallingDn,
            skillLevel: skillLevel,
            priority: priority,
            relationAgentDn: relationAgentDn,
            relationAgentId: relationAgentId,
            relationMethod: relationMethod,
            routeMethod: routeMethod,
            routeSkillId: routeSkillId,
            routeGroupId: routeGroupId,
            Ucid: Ucid,
            usePrevAgent: usePrevAgent,
            useDesignatedAgent: useDesignatedAgent,
            relationTimeout: relationTimeout,
            partyType: partyType
        }
    }

    static addExtraData(extensionHandle, extraData) {
        const keys = Object.keys(extraData);
        keys.forEach(function(key) {
            ipron.EXTAddRecord(extensionHandle, key, extraData[key]);
        });
    }
}
