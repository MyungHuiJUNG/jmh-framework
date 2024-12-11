import "./const/CounselFlowHubCode"
import CounselFlowHub from "./CounselFlowHub";
import CounselFlowHubVoiceChannelFactory from "./channels/voice/CounselFlowHubVoiceChannelFactory"
import CounselFlowHubChatChannelFactory from "./channels/chat/CounselFlowHubChatChannelFactory";
import CounselFlowHubMailChannelFactory from "./channels/mail/CounselFlowHubMailChannelFactory";

export default class CounselFlowHubFactory {

    static create(channelTypes) {
        const hub = new CounselFlowHub();

        if (channelTypes !== null && channelTypes !== undefined) {
            channelTypes.forEach(function(channelType) {
                if (CounselFlowHubVoiceChannelFactory.isSupportedChannelType(channelType))
                    hub.addChannel(channelType, CounselFlowHubVoiceChannelFactory.create(channelType));
                else if (CounselFlowHubChatChannelFactory.isSupportedChannelType(channelType))
                    hub.addChannel(channelType, CounselFlowHubChatChannelFactory.create(channelType));
                else if (CounselFlowHubMailChannelFactory.isSupportedChannelType(channelType))
                    hub.addChannel(channelType, CounselFlowHubMailChannelFactory.create(channelType));
            });
        }

        return hub;
    }

    static getSupportedChannelTypes() {
        let channelTypes = [];
        channelTypes = channelTypes.concat(CounselFlowHubVoiceChannelFactory.getSupportedChannelTypes());
        channelTypes = channelTypes.concat(CounselFlowHubChatChannelFactory.getSupportedChannelTypes());
        channelTypes = channelTypes.concat(CounselFlowHubMailChannelFactory.getSupportedChannelTypes());

        return channelTypes;
    }
}
