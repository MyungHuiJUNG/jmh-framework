import CounselFlowHubChannelInfo from "../../../domain/CounselFlowHubChannelInfo";

export default class CounselFlowHubChatChannelInfo extends CounselFlowHubChannelInfo {

    constructor() {
        super();
        this.state = CounselFlowHubChatCode.ChannelState.NOTLOGIN;
        this.subState = null;
        this.chatRoomInfos = new Map();
    }
}
