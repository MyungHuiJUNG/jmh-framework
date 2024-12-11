import CounselFlowHubChannelError from "../domain/CounselFlowHubChannelError";
import EtsClientWrapper from "./EtsClientWrapper";

export default class EtsClientEventHandler {

    constructor(channel) {
        this.channel = channel;

        this.serverPromise = {
            resolve: null,
            reject: null
        };
        this.commandPromise = {
            resolve: null,
            reject: null
        };
    }

    newPromise(type) {
        return new Promise(function(resolve, reject) {
            if (type === "server") {
                this.serverPromise.resolve = resolve;
                this.serverPromise.reject = reject;
            }
            else {
                this.commandPromise.resolve = resolve;
                this.commandPromise.reject = reject;
            }
        }.bind(this));
    }

    occurResolve(data, type) {
        if (type === "server") {
            if (this.serverPromise.resolve !== null)
                this.serverPromise.resolve(data);

            this.serverPromise.resolve = null;
            this.serverPromise.reject = null;
        }
        else {
            if (this.commandPromise.resolve !== null)
                this.commandPromise.resolve(data);

            this.commandPromise.resolve = null;
            this.commandPromise.reject = null;
        }
    }

    occurReject(error, type) {
        if (type === "server") {
            if (this.serverPromise.reject !== null)
                this.serverPromise.reject(error);

            this.serverPromise.resolve = null;
            this.serverPromise.reject = null;
        }
        else {
            if (this.commandPromise.reject !== null)
                this.commandPromise.reject(error);

            this.commandPromise.resolve = null;
            this.commandPromise.reject = null;
        }
    }

    onServerEvent(event) {
        const parsedEvent = EtsClientEventHandler.parseData(event);
        console.log("[counsel-flow-hub/ets-emc] onServerEvent : ", parsedEvent);

        if (parsedEvent.ret === "0" || parsedEvent.ret === 0) {
            this.channel.connected = true;
            this.occurResolve(parsedEvent.msg, "server");
        }
        else if (parsedEvent.ret === "1005" || parsedEvent.ret === 1005) {
            this.channel.connected = false;
            this.occurResolve(parsedEvent.msg, "server");
        }
        else {
            const retryCount = EtsClientWrapper.getInstance().getEtsClient().retryCnt;
            const maxRetryCount = EtsClientWrapper.getInstance().getEtsClient().SOCK_RETRY_CNT;
            if (retryCount === maxRetryCount)
                this.occurReject(EtsClientEventHandler.convertError(parsedEvent, this.channel.channelType), "server");

            this.occurReject(CounselFlowHubChannelError.TIMEOUT.create(this.channel.channelType));
        }
    }

    onResultEvent(event) {
    }

    onAgentEvent(event) {
    }

    onCallEvent(event) {
    }

    onErrorEvent(event) {
    }

    static parseData(data) {
        if (typeof data === "string")
            return JSON.parse(data);

        return data;
    }

    static convertError(event, channelType) {
        if (event.ret === "-200")
            return CounselFlowHubChannelError.LOGIN_FAIL.create(channelType);
        else if (event.ret === "-1" && event.cmd === "LOGIN")
            return CounselFlowHubChannelError.LOGIN_FAIL.create(channelType);
        else if (event.ret === "-1")
            return CounselFlowHubChannelError.INVALID_CHANNEL_STATE.create(channelType);
        else if (event.ret === "-203" || event.ret === "-1001" || event.ret === "-1002" || event.ret === "-1003")
            return CounselFlowHubChannelError.LOGIN_ALREADY_LOGINED.create(channelType);
        else if (event.ret === "-204" || event.ret === "-1000")
            return CounselFlowHubChannelError.CHANNEL_NOT_LOGINED.create(channelType);
        else if (event.ret === "-207" || event.ret === "-208" || event.ret === "-209")
            return CounselFlowHubChannelError.INVALID_CHANNEL_STATE.create(channelType);
        else if (event.ret === "-210")
            return CounselFlowHubChannelError.LOGIN_USING_EXTENSION.create(channelType);
        else if (event.ret === "-2000" || event.ret === "-2001")
            return CounselFlowHubChannelError.INVALID_PARAMETER.create(channelType);
        else if (event.ret === "-4000")
            return CounselFlowHubChannelError.SERVER_CONNECT_ERROR.create(channelType);

        const error = CounselFlowHubChannelError.UNKNOWN_ERROR;
        error.original = {
            code: event.ret,
            message: event.desc
        };

        return new CounselFlowHubChannelError(channelType, error);
    }
}
