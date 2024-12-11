import CounselFlowHubChatChannel from "../../CounselFlowHubChatChannel";
import EtsClientWrapper from "../../../../utils/EtsClientWrapper";
import CounselFlowHubChatChannelEmcEventHandler from "./CounselFlowHubChatChannelEmcEventHandler";
import CounselFlowHubChannelEvent from "../../../../domain/CounselFlowHubChannelEvent";
import CounselFlowHubChatChannelEccEventHandler from "../ecc/CounselFlowHubChatChannelEccEventHandler"
import CounselFlowHubChatChannelConsole from "../../CounselFlowHubChatChannelConsole";

export default class CounselFlowHubChatChannelEmc extends CounselFlowHubChatChannel {

    constructor(channelType) {
        super(channelType);
        require("../../../../../externals/ecclib");
        this.emcEventHandler = new CounselFlowHubChatChannelEmcEventHandler(this);
        EtsClientWrapper.getInstance().addEmcHandler(this.emcEventHandler);
        this.chatMaxCount = null;
        this.eccConnected = false;
        this.eccLogined = false;
        this.eccEventCallbacks = [];
        this.eccEventHandler = CounselFlowHubChatChannelEccEventHandler.getInstance(this);
    }

    addChatMessageEventCallback(eventCallback) {
        if (eventCallback)
            this.eccEventCallbacks.unshift(eventCallback);
    }

    removeChatMessageEventCallback(eventCallback) {
        if (eventCallback) {
            let removeIndex = this.eccEventCallbacks.indexOf(eventCallback);
            if (removeIndex >= 0)
                this.eccEventCallbacks.splice(removeIndex, 1);
        }
    }

    occurChatEvent(event) {
        this.eccEventCallbacks.forEach(function (eventCallback) {
            eventCallback(event);
        });
    }

    connect() {
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/emc] connect");
        if (!this.options)
            throw new Error("[counsel-flow-hub/chat/emc] you must set options");

        EtsClientWrapper.getInstance().getEtsClient().setServerInfo(this.options.activeServer, this.options.activePort, this.options.standbyServer, this.options.standbyPort, this.options.enableSsl);
        EtsClientWrapper.getInstance().connect();
        return this.emcEventHandler.newPromise("server")
            .then(() => {
                if (!this.eccConnected)
                    return this.eccConnect();
            })
            .then((result) => {
                if (result === "connected")
                    this.eccConnected = true;
                else if (result === "disconnected")
                    this.eccConnected = false;
            });
    }

    eccConnect() {
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/ecc] connect =>", this.channelInfo.id);
        if (!this.options || !this.channelInfo.id)
            throw new Error("[counsel-flow-hub/chat/ecc] connect invalid options or cti login id");

        __m_ecc_agent_id = this.channelInfo.id;
        if (this.options.enableSsl) __m_ecc_socket_url = "wss://" + this.options.eccServer + ":" + this.options.eccPort;
        else __m_ecc_socket_url = "ws://" + this.options.eccServer + ":" + this.options.eccPort;
        JS_ECC_ConnectToServer(this.channelInfo.id);
        return this.eccEventHandler.newPromise("server")
            .then((result) => {
                if (result === "connected") {
                    this.eccConnected = true;
                    return this.eccLogin();
                }
            })
            .then((result) => {
                this.eccLogined = true;
            });
    }

    disconnect() {
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/emc] disconnect");
        EtsClientWrapper.getInstance().disconnect();
        return this.emcEventHandler.newPromise("server")
            .then(() => {
                if (this.eccConnected) {
                    JS_ECC_DisConnectToServer();
                    return this.eccEventHandler.newPromise("server");
                }
            })
            .then(() => {
                this.eccConnected = false;
            });
    }

    login(channelInfo) {
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/emc] login : channelInfo=>", channelInfo);
        if (!channelInfo || !this.options)
            throw new Error("[counsel-flow-hub/chat/ets] invalid channelInfo or options");

        if (channelInfo.id) {
            this.channelInfo.id = channelInfo.id;
            __m_ecc_agent_id = this.channelInfo.id;
        }

        EtsClientWrapper.getInstance().getEtsClient().EMC_login(this.channelInfo.id);
        return this.emcEventHandler.newPromise()
            .then((data) => {
                this.channelInfo.state = CounselFlowHubChatChannelEmcEventHandler.parseChannelState(data.state);
            })
            .then(() => {
                if (!this.eccConnected)
                    return this.eccConnect();
                else if (this.eccConnected && !this.eccLogined)
                    return this.eccLogin();
                else
                    this.occurEvent(new CounselFlowHubChannelEvent(this.channelType, this.channelInfo, new Date()));
            })
            .then(() => {
                this.eccLogined = true;
                this.occurEvent(new CounselFlowHubChannelEvent(this.channelType, this.channelInfo, new Date()));
            });
    }

    eccLogin() {
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/ecc] login =>", this.channelInfo.id);
        if (!this.channelInfo.id)
            throw new Error("[counsel-flow-hub/chat/ecc] invalid channelInfo.id");

        JS_ECC_Login();
        return this.eccEventHandler.newPromise();
    }

    logout(reasonCode) {
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/emc] logout : reasonCode=>", reasonCode);
        EtsClientWrapper.getInstance().getEtsClient().EMC_logout();
        return this.emcEventHandler.newPromise()
            .then(() => {
                this.channelInfo.state = CounselFlowHubChatCode.ChannelState.NOTLOGIN;
                this.occurEvent(new CounselFlowHubChannelEvent(this.channelType, this.channelInfo, new Date()));
            });
    }

    ready() {
        let maxCount = 3;
        if (this.options) maxCount = this.options.chatMaxCount;

        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/emc] ready=>", maxCount);

        EtsClientWrapper.getInstance().getEtsClient().EMC_ready("CHAT", maxCount);
        return this.emcEventHandler.newPromise()
            .then(() => {
                this.channelInfo.state = CounselFlowHubChatCode.ChannelState.READY;
                if (!this.eccConnected)
                    return this.eccConnect();
                else if (this.eccConnected && !this.eccLogined)
                    return this.eccLogin();
                else
                    this.occurEvent(new CounselFlowHubChannelEvent(this.channelType, this.channelInfo, new Date()));
            })
            .then(() => {
                this.eccLogined = true;
                this.occurEvent(new CounselFlowHubChannelEvent(this.channelType, this.channelInfo, new Date()));
            });
    }

    absence(reasonCode) {
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/emc] absense : reasonCode=>", reasonCode);
        EtsClientWrapper.getInstance().getEtsClient().EMC_notReady("CHAT", reasonCode);
        return this.emcEventHandler.newPromise()
            .then(() => {
                this.channelInfo.state = CounselFlowHubChatCode.ChannelState.ABSENCE;
                this.occurEvent(new CounselFlowHubChannelEvent(this.channelType, this.channelInfo, new Date()));
            });
    }

    accept(chatRoomInfo) {
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/ets] acceptChat : contactId=>", chatRoomInfo);
        EtsClientWrapper.getInstance().getEtsClient().EMC_accept(chatRoomInfo.connectionId, "CHAT");
        return this.emcEventHandler.newPromise()
            .then(() => {
                this.occurEvent(new CounselFlowHubChannelEvent(this.channelType, this.channelInfo, new Date()));
            });
    }

    reject(chatRoomInfo) {
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/ets] rejectChat : contactId=>", chatRoomInfo.connectionId);
        EtsClientWrapper.getInstance().getEtsClient().EMC_release(chatRoomInfo.connectionId);
        return this.emcEventHandler.newPromise()
            .then(() => {
                this.occurEvent(new CounselFlowHubChannelEvent(this.channelType, this.channelInfo, new Date()));
            });
    }

    join(chatRoomInfo, options) {
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/ets] joinChatRoom : roomKey=>", chatRoomInfo.id);
        if (!options || !options.isManager || !options.enableChat)
            options = {isManager: "OFF", enableChat: "OFF"};

        JS_ECC_Join(chatRoomInfo.id, options.isManager, options.enableChat);
        return this.eccEventHandler.newPromise();
    }

    standbyChat(chatRoomInfo, options) {
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/ets] standbyChatRoom : roomKey=>", chatRoomInfo.id);
        if (!options || !options.isManager)
            options = {isManager: "OFF"};

        JS_ECC_Hold(chatRoomInfo.id, options.isManager, "OFF", "OFF");
        return this.eccEventHandler.newPromise();
    }

    activeChat(chatRoomInfo, options) {
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/ets] activeChatRoom : roomKey=>", chatRoomInfo.id);
        if (!options || !options.isManager)
            options = {isManager: "OFF"};

        JS_ECC_Hold(chatRoomInfo.id, options.isManager, "ON", "OFF");
        return this.eccEventHandler.newPromise();
    }

    hold(chatRoomInfo, options) {
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/ets] holdChatRoom : roomKey=>", chatRoomInfo.id);
        if (!options || !options.isManager)
            options = {isManager: "OFF"};

        JS_ECC_Hold(chatRoomInfo.id, options.isManager, "ON", "ON");
        return this.eccEventHandler.newPromise();
    }

    retrieve(chatRoomInfo, options) {
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/ets] retrieveChatRoom : roomKey=>", chatRoomInfo.id);
        if (!options || !options.isManager)
            options = {isManager: "OFF"};

        JS_ECC_Hold(chatRoomInfo.id, options.isManager, "ON", "OFF");
        return this.eccEventHandler.newPromise();
    }

    exit(chatRoomInfo) {
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/ets] exitChatRoom : roomKey=>", chatRoomInfo.id);
        JS_ECC_Exit(chatRoomInfo.id);
        return this.eccEventHandler.newPromise();
    }

    transfer(chatRoomInfo, options) {
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/ets] transfer : chatRoomInfo =>", chatRoomInfo);
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/ets] transfer : options =>", options);
        if (!options)
            throw new Error("[counsel-flow-hub/chat/ets] transfer : invalid options");

        if (options.type === "AGENT") {
            EtsClientWrapper.getInstance().getEtsClient().EMC_transferToAgent(options.targetAgentId, chatRoomInfo.connectionId, JSON.stringify(options));
        } else if (options.type === "SKILL") {
            EtsClientWrapper.getInstance().getEtsClient().EMC_transfer(options.targetSkill, chatRoomInfo.connectionId, JSON.stringify(options));
        }
        return this.emcEventHandler.newPromise();
    }

    sendMessage(chatRoomInfo, options) {
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/ets] send Message : roomKey / Message=>", chatRoomInfo.id, options.messageType, options.message, options.extraDatas);
        if (!options.extraDatas) options.extraDatas = "";
        else options.extraDatas = JSON.stringify(options.extraDatas);

        if (options.extraDatas && !options.message) options.message = "";

        JS_ECC_SendMessage(options.message, chatRoomInfo.id, options.messageType, options.extraDatas);
        return this.eccEventHandler.newPromise();
    }

    getList(options) {
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/ets] get contact list");
        EtsClientWrapper.getInstance().getEtsClient().EMC_getContactList();
        return this.emcEventHandler.newPromise();
    }

    getMessages(chatRoomInfo, options) {
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/ets] get message list=>", chatRoomInfo.id, options.page, options.countPerPage);
        JS_ECC_GetMessageList(chatRoomInfo.id, options.page, options.countPerPage);
        return this.eccEventHandler.newPromise()
            .then((data) => {
                this.occurChatEvent(data);
            });
    }

    transferComplete(chatRoomInfo) {
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/ets] transferComplete : contactId=>", chatRoomInfo.connectionId);
        EtsClientWrapper.getInstance().getEtsClient().EMC_transferComplete(chatRoomInfo.connectionId);
        return this.emcEventHandler.newPromise();
    }

    cancelTransfer(chatRoomInfo) {
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/ets] cancelTransfer : contactId=>", chatRoomInfo.connectionId);
        EtsClientWrapper.getInstance().getEtsClient().EMC_transferCancel(chatRoomInfo.connectionId);
        return this.emcEventHandler.newPromise();
    }
}
