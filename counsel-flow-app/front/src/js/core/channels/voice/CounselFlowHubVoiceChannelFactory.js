import "./const/CounselFlowHubVoiceType"
import "./const/CounselFlowHubVoiceCode"
import CounselFlowHubVoiceChannelEts from "./impl/ets/CounselFlowHubVoiceChannelEts";
import CounselFlowHubVoiceChannelIpron from "./impl/ipron/CounselFlowHubVoiceChannelIpron";
import CounselFlowHubVoiceChannelConsole from "./CounselFlowHubVoiceChannelConsole"

export default class CounselFlowHubVoiceChannelFactory {

    static create(channelType) {
        if (channelType === CounselFlowHubVoiceType.ETS_FINESSE)
            return new CounselFlowHubVoiceChannelEts(channelType);
        if (channelType === CounselFlowHubVoiceType.ETS_FINESSE_V2)
            return new CounselFlowHubVoiceChannelEts(channelType);
        if (channelType === CounselFlowHubVoiceType.IPRON_V5)
            return new CounselFlowHubVoiceChannelIpron(channelType);

        CounselFlowHubVoiceChannelConsole.error("[counsel-flow-hub/voice] not support voice type : ", channelType);
    }

    static getSupportedChannelTypes() {
        const channelTypes = [];
        channelTypes.push(CounselFlowHubVoiceType.ETS_FINESSE);
        channelTypes.push(CounselFlowHubVoiceType.ETS_FINESSE_V2);
        channelTypes.push(CounselFlowHubVoiceType.IPRON_V5);

        return channelTypes;
    }

    static isSupportedChannelType(channelType) {
        return (CounselFlowHubVoiceType[channelType] !== undefined);
    }
}
