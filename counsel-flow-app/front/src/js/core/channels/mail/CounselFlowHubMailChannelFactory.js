import "./const/CounselFlowHubMailType"
import "./const/CounselFlowHubMailCode"
import CounselFlowHubMailChannelEmc from "./impl/emc/CounselFlowHubMailChannelEmc";
import CounselFlowHubMailChannelConsole from "./CounselFlowHubMailChannelConsole";

export default class CounselFlowHubChatChannelFactory {

    static create(channelType) {
        if (channelType === CounselFlowHubMailType.EMC_ECM)
            return new CounselFlowHubMailChannelEmc(channelType);

        CounselFlowHubMailChannelConsole.error("[counsel-flow-hub/mail] not support mail type : ", channelType);
    }

    static getSupportedChannelTypes() {
        const channelTypes = [];
        channelTypes.push(CounselFlowHubMailType.EMC_ECM);

        return channelTypes;
    }

    static isSupportedChannelType(channelType) {
        return (CounselFlowHubMailType[channelType] !== undefined);
    }
}
