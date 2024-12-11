import CounselFlowHubChannel from "../../domain/CounselFlowHubChannel";
import CounselFlowHubVoiceChannelInfo from "./domain/CounselFlowHubVoiceChannelInfo";

export default class CounselFlowHubVoiceChannel extends CounselFlowHubChannel {

    constructor(channelType) {
        super(channelType);

        this.channelInfo = new CounselFlowHubVoiceChannelInfo();
    }

    /**
     * dial new call
     *
     * @param dial Json object contains (type, calledId)
     * @return promise object
     */
    dial(dial) {
    }

    /**
     * accept current call
     *
     * @return promise object
     */
    acceptCall() {
    }

    /**
     * reject current call
     *
     * @param reasonCode reason code as string
     * @return promise object
     */
    rejectCall(reasonCode) {
    }

    /**
     * hold current call
     *
     * @return promise object
     */
    hold() {
    }

    /**
     * retrieve held call
     *
     * @return promise object
     */
    retrieve() {
    }

    /**
     * dial consult call
     *
     * @param dial Json object contains (type, calledId)
     * @param callType transfer or conference type
     * @param options options for consult
     * @return promise object
     */
    consult(dial, callType, options) {
    }

    /**
     * transfer current call to other
     *
     * @param dial Json object contains (type, calledId)
     * @return promise object
     */
    transfer(dial) {
    }

    /**
     * conference call from consulting call
     *
     * @param dial Json object contains (type, calledId)
     * @return promise object
     */
    conference(dial) {
    }

    /**
     * hangup current call
     *
     * @return promise object
     */
    hangup() {
    }

    /**
     * pass extra data to current call
     *
     * @param extraData
     */
    setExtraData(extraData) {
    }
}
