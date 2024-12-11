import CounselFlowHubChannelEvent from "../../../../domain/CounselFlowHubChannelEvent";
import CounselFlowHubVoiceChannel from "../../CounselFlowHubVoiceChannel";
import CounselFlowHubVoiceChannelConsole from "../../CounselFlowHubVoiceChannelConsole";
import CounselFlowHubVoiceChannelEtsEventHandler from "./CounselFlowHubVoiceChannelEtsEventHandler";
import CounselFlowHubVoiceChannelEtsEventHandlerV2 from "./CounselFlowHubVoiceChannelEtsEventHandlerV2";
import EtsClientWrapper from "../../../../utils/EtsClientWrapper";

export default class CounselFlowHubVoiceChannelEts extends CounselFlowHubVoiceChannel {

    constructor(channelType) {
        super(channelType);

        if (channelType === CounselFlowHubVoiceType.ETS_FINESSE)
            this.etsEventHandler = new CounselFlowHubVoiceChannelEtsEventHandler(this);
        else if (channelType === CounselFlowHubVoiceType.ETS_FINESSE_V2)
            this.etsEventHandler = new CounselFlowHubVoiceChannelEtsEventHandlerV2(this);

        if (this.etsEventHandler)
            EtsClientWrapper.getInstance().setFinesseHandler(this.etsEventHandler);
    }

    connect() {
        CounselFlowHubVoiceChannelConsole.log("[counsel-flow-hub/voice/ets] connect");

        if (this.options === null)
            throw new Error("[counsel-flow-hub/voice/ets] you must set options");

        EtsClientWrapper.getInstance().getEtsClient().setServerInfo(this.options.activeServer, this.options.activePort, this.options.standbyServer, this.options.standbyPort, this.options.enableSsl);
        EtsClientWrapper.getInstance().connect();

        return this.etsEventHandler.newPromise("server");
    }

    disconnect() {
        CounselFlowHubVoiceChannelConsole.log("[counsel-flow-hub/voice/ets] disconnect");

        EtsClientWrapper.getInstance().disconnect();

        return this.etsEventHandler.newPromise("server");
    }

    requestChannelState() {
        CounselFlowHubVoiceChannelConsole.log("[counsel-flow-hub/voice/ets] requestAgentState");

        EtsClientWrapper.getInstance().getEtsClient().getUserList();

        return this.etsEventHandler.newPromise()
            .then(function (data) {
                const currentChannelInfo = data[this.channelInfo.extension];
                if (currentChannelInfo !== undefined) {
                    const parsedCurrentChannelInfo = JSON.parse(currentChannelInfo);
                    this.channelInfo.state = CounselFlowHubVoiceChannelEtsEventHandler.parseChannelState(parsedCurrentChannelInfo.state);
                }
            }.bind(this));
    }

    login(channelInfo) {
        CounselFlowHubVoiceChannelConsole.log("[counsel-flow-hub/voice/ets] login : channelInfo=>", channelInfo);

        if (channelInfo === null || channelInfo === undefined)
            throw new Error("[counsel-flow-hub/voice/ets] invalid channelInfo");

        this.channelInfo.id = channelInfo.id;
        this.channelInfo.password = channelInfo.password;
        this.channelInfo.extension = channelInfo.extension;

        EtsClientWrapper.getInstance().getEtsClient().login(channelInfo.id, channelInfo.password, channelInfo.extension);

        return this.etsEventHandler.newPromise()
            .then(function (data) {
                this.channelInfo.state = CounselFlowHubVoiceChannelEtsEventHandler.parseChannelState(data.state);
                this.occurEvent(new CounselFlowHubChannelEvent(this.channelType, this.channelInfo, new Date()));
            }.bind(this));
    }

    logout(reasonCode) {
        CounselFlowHubVoiceChannelConsole.log("[counsel-flow-hub/voice/ets] logout : reasonCode=>", reasonCode);

        EtsClientWrapper.getInstance().getEtsClient().logout();

        return this.etsEventHandler.newPromise()
            .then(function () {
                this.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.NOTLOGIN;
                this.occurEvent(new CounselFlowHubChannelEvent(this.channelType, this.channelInfo, new Date()));
            }.bind(this));
    }

    ready() {
        CounselFlowHubVoiceChannelConsole.log("[counsel-flow-hub/voice/ets] ready");

        EtsClientWrapper.getInstance().getEtsClient().ready();

        return this.etsEventHandler.newPromise()
            .then(function () {
                this.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.READY;
                this.occurEvent(new CounselFlowHubChannelEvent(this.channelType, this.channelInfo, new Date()));
            }.bind(this));
    }

    absence(reasonCode) {
        CounselFlowHubVoiceChannelConsole.log("[counsel-flow-hub/voice/ets] absense : reasonCode=>", reasonCode);

        EtsClientWrapper.getInstance().getEtsClient().notReady(reasonCode);

        return this.etsEventHandler.newPromise()
            .then(function () {
                this.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.ABSENCE;
                this.occurEvent(new CounselFlowHubChannelEvent(this.channelType, this.channelInfo, new Date()));
            }.bind(this));
    }

    dial(dial) {
        CounselFlowHubVoiceChannelConsole.log("[counsel-flow-hub/voice/ets] dial : dial=>", dial);

        EtsClientWrapper.getInstance().getEtsClient().makeCall(dial.calledId, dial.extraData);

        return this.etsEventHandler.newPromise();
    }

    acceptCall() {
        CounselFlowHubVoiceChannelConsole.log("[counsel-flow-hub/voice/ets] accept call");

        let callId = "";
        if (this.channelInfo.callInfo !== null)
            callId = this.channelInfo.callInfo.callId;

        EtsClientWrapper.getInstance().getEtsClient().answerCall(callId);

        return this.etsEventHandler.newPromise()
            .then(function () {
                this.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.ACTIVE;
                this.occurEvent(new CounselFlowHubChannelEvent(this.channelType, this.channelInfo, new Date()));
            }.bind(this));
    }

    rejectCall(reasonCode) {
        CounselFlowHubVoiceChannelConsole.log("[counsel-flow-hub/voice/ets] reject call : reasonCode=>", reasonCode);

        let callId = "";
        if (this.channelInfo.callInfo !== null)
            callId = this.channelInfo.callInfo.callId;

        EtsClientWrapper.getInstance().getEtsClient().rejectCall(callId);

        return this.etsEventHandler.newPromise();
    }

    hold() {
        CounselFlowHubVoiceChannelConsole.log("[counsel-flow-hub/voice/ets] hold");

        let callId = "";
        if (this.channelInfo.callInfo !== null)
            callId = this.channelInfo.callInfo.callId;

        EtsClientWrapper.getInstance().getEtsClient().hold(callId);

        return this.etsEventHandler.newPromise();
    }

    retrieve() {
        CounselFlowHubVoiceChannelConsole.log("[counsel-flow-hub/voice/ets] retrieve");

        let callId = "";
        if (this.channelInfo.callInfo !== null)
            callId = this.channelInfo.callInfo.callId;

        EtsClientWrapper.getInstance().getEtsClient().unHold(callId);

        return this.etsEventHandler.newPromise()
            .then(function () {
                this.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.ACTIVE;
                this.occurEvent(new CounselFlowHubChannelEvent(this.channelType, this.channelInfo, new Date()));
            }.bind(this));
    }

    hangup() {
        CounselFlowHubVoiceChannelConsole.log("[counsel-flow-hub/voice/ets] hangup");

        let callId = "";
        if (this.channelInfo.callInfo !== null)
            callId = this.channelInfo.callInfo.callId;

        EtsClientWrapper.getInstance().getEtsClient().releaseCall(callId);

        return this.etsEventHandler.newPromise();
    }

    transfer(dial) {
        CounselFlowHubVoiceChannelConsole.log("[counsel-flow-hub/voice/ets] transfer : dial=>", dial);

        if (this.channelInfo.callInfo !== null && this.channelInfo.callInfo.xferCallId !== null) {
            EtsClientWrapper.getInstance().getEtsClient().transferComplete();

            return this.etsEventHandler.newPromise();
        }

        let callId = "";
        if (this.channelInfo.callInfo !== null)
            callId = this.channelInfo.callInfo.callId;

        if (dial.extraData)
            EtsClientWrapper.getInstance().getEtsClient().setCallData(dial.extraData, callId);

        EtsClientWrapper.getInstance().getEtsClient().ssTransfer(dial.calledId, callId);

        return this.etsEventHandler.newPromise();
    }

    consult(dial) {
        CounselFlowHubVoiceChannelConsole.log("[counsel-flow-hub/voice/ets] consult", dial);

        let callId = "";
        if (this.channelInfo.callInfo !== null)
            callId = this.channelInfo.callInfo.callId;

        if (dial.extraData)
            EtsClientWrapper.getInstance().getEtsClient().setCallData(dial.extraData, callId);

        EtsClientWrapper.getInstance().getEtsClient().consultCall(dial.calledId, callId);

        return this.etsEventHandler.newPromise();
    }

    conference(dial) {
        CounselFlowHubVoiceChannelConsole.log("[counsel-flow-hub/voice/ets] conference...");

        if (this.channelInfo.callInfo !== null && this.channelInfo.callInfo.xferCallId !== null) {
            EtsClientWrapper.getInstance().getEtsClient().conferenceComplete();

            return this.etsEventHandler.newPromise();
        }

        let callId = "";
        if (this.channelInfo.callInfo !== null)
            callId = this.channelInfo.callInfo.callId;

        // EtsClientWrapper.getInstance().getEtsClient().ssConference(dial.calledId, callId);
        EtsClientWrapper.getInstance().getEtsClient().conferenceComplete();

        return this.etsEventHandler.newPromise();
    }

    setExtraData(extraData) {
        EtsClientWrapper.getInstance().getEtsClient().setCallData(extraData.extraData, extraData.callId);
    }
}
