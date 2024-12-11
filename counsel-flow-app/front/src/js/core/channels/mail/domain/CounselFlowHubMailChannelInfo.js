import CounselFlowHubChannelInfo from "../../../domain/CounselFlowHubChannelInfo";

export default class CounselFlowHubMailChannelInfo extends CounselFlowHubChannelInfo {

    constructor() {
        super();
        this.state = CounselFlowHubMailCode.ChannelState.NOTLOGIN;
        this.subState = null;
        this.mailInfos = new Map();
    }
}
