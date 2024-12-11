import CounselFlowHubChannel from "../../domain/CounselFlowHubChannel";
import CounselFlowHubChatChannelInfo from "./domain/CounselFlowHubChatChannelInfo";

export default class CounselFlowHubChatChannel extends CounselFlowHubChannel {

    constructor(channelType) {
        super(channelType);
        this.channelInfo = new CounselFlowHubChatChannelInfo();
    }

    addChatMessageEventCallback(eventCallback) {
    }

    removeChatMessageEventCallback(eventCallback) {
    }

    occurChatEvent(event) {
    }

    accept(chatRoomInfo) {
    }

    reject(chatRoomInfo) {
    }

    join(chatRoomInfo, options) {
    }

    hold(chatRoomInfo, options) {
    }

    retrieve(chatRoomInfo, options) {
    }

    exit(chatRoomInfo) {
    }

    transfer(chatRoomInfo, options) {
    }

    cancelTransfer(chatRoomInfo) {
    }

    eccConnect() {
    }

    eccLogin() {
    }

    sendMessage(chatRoomInfo, options) {
    }

    getList(options) {
    }

    getMessages(chatRoomInfo, options) {
    }
}
