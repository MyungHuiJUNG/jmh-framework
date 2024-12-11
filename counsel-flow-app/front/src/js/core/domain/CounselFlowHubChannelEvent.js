export default class CounselFlowHubChannelEvent {

    constructor(channelType, channelInfo, expiredDate, queueReportInfo) {
        this.channelType = channelType;
        this.channelInfo = channelInfo;
        this.expiredDate = expiredDate;
        this.queueReportInfo = queueReportInfo;
    }
}
