import CounselFlowHubChannelInfo from "../../../domain/CounselFlowHubChannelInfo";

export default class CounselFlowHubVoiceChannelInfo extends CounselFlowHubChannelInfo {

    constructor() {
        super();

        this.state = CounselFlowHubVoiceCode.ChannelState.NOTLOGIN;
        this.subState = null;
        this.callInfo = null;
        this.callInfos = [];
    }
}
