import CounselFlowHubChannelInfo from "./CounselFlowHubChannelInfo";

export default class CounselFlowHubChannel {

    constructor(channelType) {
        this.options = null;
        this.channelType = channelType;
        this.channelInfo = new CounselFlowHubChannelInfo();
        this.eventCallbacks = [];
        this.connected = false;
        this.absenceReasonCodes = [];
        this.queueReportInfo = [];
    }

    addEventCallback(eventCallback) {
        if (eventCallback !== null && eventCallback !== undefined)
            this.eventCallbacks.unshift(eventCallback);
    }

    removeEventCallback(eventCallback) {
        if (eventCallback !== null && eventCallback !== undefined) {
            let removeIndex = this.eventCallbacks.indexOf(eventCallback);
            if (removeIndex >= 0)
                this.eventCallbacks.splice(removeIndex, 1);
        }
    }

    occurEvent(event) {
        this.eventCallbacks.forEach(function (eventCallback) {
            eventCallback(event);
        });
    }

    /**
     * connect to channel.
     *
     * @return promise object
     */
    connect() {
    }

    /**
     * disconnect from channel.
     *
     * @return promise object
     */
    disconnect() {
    }

    /**
     * request to get current channel state
     *
     * @return promise object and success function parameter is channel state
     */
    requestChannelState() {
    }

    /**
     * request to get reasons
     *
     * @param reasonType reason type as CTI_CODE.REASON_TYPE
     * @return promis object and success function parameter is reason code list
     */
    requestReasons(reasonType) {
    }

    /**
     * login to channel.
     *
     * @param channelInfo Json object contains (id, password, extension, etc..)
     * @return promise object
     */
    login(channelInfo) {
    }

    /**
     * logout from channel.
     *
     * @param reasonCode reason code as string
     * @return promise object
     */
    logout(reasonCode) {
    }

    /**
     * ready
     *
     * @return promise object
     */
    ready() {
    }

    /**
     * absence
     *
     * @param reasonCode reason code as string
     * @return promise object
     */
    absence(reasonCode) {
    }

    /**
     * working process
     *
     * @return promise object
     */
    process() {
    }

    /**
     * get fetcher for channel information like agent status, cti status etc
     *
     * @return fetcher instance
     */
    getFetcher() {
    }
}
