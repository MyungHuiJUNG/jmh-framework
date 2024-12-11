import CounselFlowHubChannelError from "../../../../domain/CounselFlowHubChannelError";
import CounselFlowHubChatRoomMessage from "../../domain/CounselFlowHubChatRoomMessage";
import CounselFlowHubChatChannelConsole from "../../CounselFlowHubChatChannelConsole";

export default class CounselFlowHubChatChannelEccEventHandler {
    constructor(channel) {
        this.channel = channel;

        this.serverPromise = {
            resolve: null,
            reject: null
        };
        this.commandPromise = {
            resolve: null,
            reject: null
        };
    }

    newPromise(type) {
        return new Promise(function(resolve, reject) {
            if (type === "server") {
                this.serverPromise.resolve = resolve;
                this.serverPromise.reject = reject;
            }
            else {
                this.commandPromise.resolve = resolve;
                this.commandPromise.reject = reject;
            }
        }.bind(this));
    }

    occurResolve(data, type) {
        if (type === "server") {
            if (this.serverPromise.resolve !== null)
                this.serverPromise.resolve(data);

            this.serverPromise.resolve = null;
            this.serverPromise.reject = null;
        }
        else {
            if (this.commandPromise.resolve !== null)
                this.commandPromise.resolve(data);

            this.commandPromise.resolve = null;
            this.commandPromise.reject = null;
        }
    }

    occurReject(error, type) {
        if (type === "server") {
            if (this.serverPromise.reject !== null)
                this.serverPromise.reject(error);

            this.serverPromise.resolve = null;
            this.serverPromise.reject = null;
        }
        else {
            if (this.commandPromise.reject !== null)
                this.commandPromise.reject(error);

            this.commandPromise.resolve = null;
            this.commandPromise.reject = null;
        }
    }

    onServerEvent(state) {
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/ecc] onServerEvent=>", state);

        if (state === "Connected") {
            this.occurResolve("connected", "server");
        } else if (state === "Disconnected") {
            this.occurResolve("disconnected", "server");
        }
    }

    onCommandEvent(messageType, sequence, massageIdCommand, returnIE, resultCause, responseDetail) {
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/ecc] onCommandEvent=>", messageType, sequence, massageIdCommand, returnIE, resultCause, responseDetail);

        if((massageIdCommand === "8223" || massageIdCommand === 8223) && responseDetail) {
            let chatMessages = [];
            responseDetail = CounselFlowHubChatChannelEccEventHandler.parseData(responseDetail);
            if (!Array.isArray(responseDetail))
                return;

            responseDetail.forEach(detail => {
                if (detail.member_type === "KAKAO" || detail.member_type === "NAVER") detail.member_type = "CUSTOMER";

                const event = {
                    memberType: detail.member_type,
                    senderKey: detail.sender_key,
                    roomKey: detail.room_key,
                    memberKey: detail.member_key,
                    chatMessage: detail.message,
                    extraData: detail.message_extra,
                    messageType: detail.message_type,
                    timestamp: detail.time_last_modify
                };
                const chatMessage = CounselFlowHubChatChannelEccEventHandler.parseChatRoomMessage(event);
                chatMessages.push(chatMessage);
            });
            this.channel.occurChatEvent(chatMessages);
        } else {
            const data = {
                type: "ECC",
                channelType: this.channel.channelType,
                channelInfo: this.channel.channelInfo,
                messageType: messageType,
                sequence: sequence,
                massageIdCommand: massageIdCommand,
                returnIE: returnIE,
                resultCause: resultCause
            };

            if (returnIE === 1 || returnIE === "1")
                this.occurResolve(data);
            else
                this.occurReject(CounselFlowHubChatChannelEccEventHandler.convertError(CounselFlowHubChatType));
        }
    }

    onReceiveMessageEvent(event) {
        const chatMessage = CounselFlowHubChatChannelEccEventHandler.parseChatRoomMessage(event);
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/ecc] onReceiveMessageEvent=>", chatMessage);
        let chatMessages = [];
        chatMessages.push(chatMessage);
        this.channel.occurChatEvent(chatMessages);
    }

    static parseData(data) {
        if (typeof data === "string")
            return JSON.parse(data);

        return data;
    }

    static parseChatRoomMessage(event) {
        let chatMessage = new CounselFlowHubChatRoomMessage();
        chatMessage.roomId = event.roomKey;
        chatMessage.senderType = event.memberType;
        chatMessage.senderId = event.senderKey;
        chatMessage.messageType = event.messageType.toUpperCase();
        chatMessage.message = event.chatMessage;
        if ((chatMessage.messageType === 'LINK' || chatMessage.messageType === 'LINKIMAGE') && event.extraData)
            chatMessage.extraData = CounselFlowHubChatChannelEccEventHandler.parseData(event.extraData);

        chatMessage.sendDateTime = event.timestamp;
        if(event.senderKey === "0000000000") {
            chatMessage.senderType = "SYSTEM";
            chatMessage.senderId = "SYSTEM";
        }

        return chatMessage;
    }

    static convertError(channelType) {
        const error = CounselFlowHubChannelError.UNKNOWN_ERROR;
        error.original = {
            code: "-9999",
            message: ""
        };

        return new CounselFlowHubChannelError(channelType, error);
    }
}

CounselFlowHubChatChannelEccEventHandler.getInstance = function (channel) {
    if (!window.counselFlowHubChatChannelEccEventHandler)
        window.counselFlowHubChatChannelEccEventHandler = new CounselFlowHubChatChannelEccEventHandler(channel);

    return window.counselFlowHubChatChannelEccEventHandler;
};

window.OnEccLinkState = function(state){
    CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/ecc] OnEccLinkState=>", state);
    CounselFlowHubChatChannelEccEventHandler.getInstance().onServerEvent(state);
};

window.OnEccMessage = function (memberType, senderKey, roomKey, memberKey, chatMessage, extraData, chatMessageType, timestamp) {
    CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/ecc] OnEccMessage=>", memberType, senderKey, roomKey, memberKey, chatMessage, extraData, chatMessageType, timestamp);
    if (memberType === "KAKAO" || memberType === "NAVER") memberType = "CUSTOMER";

    const event = {
        memberType: memberType,
        senderKey: senderKey,
        roomKey: roomKey,
        memberKey: memberKey,
        chatMessage: chatMessage,
        extraData: extraData,
        messageType: chatMessageType,
        timestamp: timestamp
    };

    CounselFlowHubChatChannelEccEventHandler.getInstance().onReceiveMessageEvent(event);
};

window.OnEccReturn = function (messageType, sequence, massageIdCommand, returnIE, resultCause, responseDetail) {
    CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/ecc] OnEccReturn=>", messageType, sequence, massageIdCommand, returnIE, resultCause, responseDetail);
    CounselFlowHubChatChannelEccEventHandler.getInstance().onCommandEvent(messageType, sequence, massageIdCommand, returnIE, resultCause, responseDetail);
};

window.OnEccClose = function(roomkey) {
    CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/ecc] OnEccClose=>", roomkey);
};

window.AddShowLog = function (objName,txt) {
};
