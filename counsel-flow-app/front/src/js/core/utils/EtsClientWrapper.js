import EtsClientEventHandler from "./EtsClientEventHandler";

export default class EtsClientWrapper {

    static ConnectState = Object.freeze({
        CONNECTED: "CONNECTED",
        CONNECTING: "CONNECTING",
        DISCONNECTED: "DISCONNECTED",
        DISCONNECTING: "DISCONNECTING"
    });

    static instance = null;
    static getInstance() {
        if (this.instance === null)
            this.instance = new EtsClientWrapper();

        return this.instance;
    }

    constructor() {
        require("../externals/ETSClient_Base");
        require("../externals/ETSClient_EMC");
        require("../externals/ETSClient_Finesse");
        require("../externals/ETSClient_Jtapi");

        this.isChanged = false;
        this.finesseHandler = null;
        this.emcHandlers = [];
        this.etsClient = null;
        this.etsClientConnectState = EtsClientWrapper.ConnectState.DISCONNECTED;
    }

    setFinesseHandler(finesseHandler) {
        if (finesseHandler !== null && finesseHandler !== undefined) {
            this.isChanged = true;
            this.finesseHandler = finesseHandler;
        }
    }

    addEmcHandler(emcHandler) {
        if (emcHandler !== null && emcHandler !== undefined) {
            this.isChanged = true;
            this.emcHandlers.push(emcHandler);
        }
    }

    connect() {
        if (this.etsClientConnectState === EtsClientWrapper.ConnectState.CONNECTING)
            return;

        this.etsClientConnectState = EtsClientWrapper.ConnectState.CONNECTING;
        this.getEtsClient().connectToServer();
    }

    disconnect() {
        if (this.etsClientConnectState === EtsClientWrapper.ConnectState.DISCONNECTING)
            return;

        this.etsClientConnectState = EtsClientWrapper.ConnectState.DISCONNECTING;
        this.getEtsClient().disconnect();
    }

    getEtsClient() {
        if (this.isChanged === false && this.etsClient !== null)
            return this.etsClient;

        let type = "";
        if (this.finesseHandler !== null)
            type = "finesse";

        this.isChanged = false;
        this.etsClient = CreateETSMsgLib(type, this.emcHandlers.length > 0);

        if (this.finesseHandler !== null) {
            this.etsClient.SetOnResultEvent(this.finesseHandler.onResultEvent.bind(this.finesseHandler));
            this.etsClient.SetOnAgentEvent(this.finesseHandler.onAgentEvent.bind(this.finesseHandler));
            this.etsClient.SetOnCallEvent(this.finesseHandler.onCallEvent.bind(this.finesseHandler));
            this.etsClient.SetOnErrorEvent(this.finesseHandler.onErrorEvent.bind(this.finesseHandler));
        }

        if (this.emcHandlers.length > 0) {
            this.etsClient.EMC_SetOnResultEvent(function(event) {
                this.emcHandlers.forEach(function(emcHandler) {
                    emcHandler.onResultEvent(event);
                });
            }.bind(this));
            this.etsClient.EMC_SetOnAgentEvent(function(event) {
                this.emcHandlers.forEach(function(emcHandler) {
                    emcHandler.onAgentEvent(event);
                });
            }.bind(this));
            this.etsClient.EMC_SetOnCallEvent(function(event) {
                this.emcHandlers.forEach(function(emcHandler) {
                    emcHandler.onCallEvent(event);
                });
            }.bind(this));
            this.etsClient.EMC_SetOnErrorEvent(function(event) {
                this.emcHandlers.forEach(function(emcHandler) {
                    emcHandler.onErrorEvent(event);
                });
            }.bind(this));
        }

        this.etsClient.SetOnServerEvent(function(event) {
            const parsedEvent = EtsClientEventHandler.parseData(event);
            if (parsedEvent.ret === "0" || parsedEvent.ret === 0)
                this.etsClientConnectState = EtsClientWrapper.ConnectState.CONNECTED;
            else if (parsedEvent.ret === "1005" || parsedEvent.ret === 1005)
                this.etsClientConnectState = EtsClientWrapper.ConnectState.DISCONNECTED;

            if (this.finesseHandler !== null)
                this.finesseHandler.onServerEvent(event);

            this.emcHandlers.forEach(function(emcHandler) {
                emcHandler.onServerEvent(event);
            });
        }.bind(this));

        return this.etsClient;
    }
}
