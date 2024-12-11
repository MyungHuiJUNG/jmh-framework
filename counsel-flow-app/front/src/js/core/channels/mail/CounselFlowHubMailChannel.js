import CounselFlowHubChannel from "../../domain/CounselFlowHubChannel";
import CounselFlowHubMailChannelInfo from "./domain/CounselFlowHubMailChannelInfo";

export default class CounselFlowHubMailChannel extends CounselFlowHubChannel {

    constructor(channelType) {
        super(channelType);
        this.channelInfo = new CounselFlowHubMailChannelInfo();
    }

    acceptMail(mailInfo) {
    }

    rejectMail(mailInfo) {
    }

    sendNewMail(mailInfo) {
    }

    replyMail(mailInfo) {
    }

    uploadFiles(mailInfo, files) {
    }
}
