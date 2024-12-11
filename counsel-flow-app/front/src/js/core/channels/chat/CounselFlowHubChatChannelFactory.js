import "./const/CounselFlowHubChatType"
import "./const/CounselFlowHubChatCode"
import CounselFlowHubChatChannelEmc from "./impl/emc/CounselFlowHubChatChannelEmc";
import CounselFlowHubChatChannelConsole from "./CounselFlowHubChatChannelConsole"

export default class CounselFlowHubChatChannelFactory {

    static create(channelType) {
        if (channelType === CounselFlowHubChatType.EMC_ECC)
            return new CounselFlowHubChatChannelEmc(channelType);

        CounselFlowHubChatChannelConsole.error("[counsel-flow-hub/chat] not support chat type : ", channelType);
    }

    static getSupportedChannelTypes() {
        const channelTypes = [];
        channelTypes.push(CounselFlowHubChatType.EMC_ECC);

        return channelTypes;
    }

    static isSupportedChannelType(channelType) {
        return (CounselFlowHubChatType[channelType] !== undefined);
    }
}
