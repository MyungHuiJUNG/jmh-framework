import EtsClientEventHandler from "../../../../utils/EtsClientEventHandler";
import CounselFlowHubChannelEvent from "../../../../domain/CounselFlowHubChannelEvent";
import CounselFlowHubChatRoomInfo from "../../domain/CounselFlowHubChatRoomInfo";
import CounselFlowHubChatRoomMember from "../../domain/CounselFlowHubChatRoomMember";
import CounselFlowHubChatChannelConsole from "../../CounselFlowHubChatChannelConsole";

export default class CounselFlowHubChatChannelEmcEventHandler extends EtsClientEventHandler {

    constructor(channel) {
        super(channel);
    }

    onResultEvent(event) {
        const parsedEvent = EtsClientEventHandler.parseData(event);
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/emc] onResultEvent : ", parsedEvent);

        if ((!parsedEvent.msg || !parsedEvent.msg.contact_type || parsedEvent.msg.contact_type !== "CHAT") && !(parsedEvent.cmd === "LOGIN" || parsedEvent.cmd === "LOGOUT"))
            return this.occurReject(EtsClientEventHandler.convertError(parsedEvent, this.channel.channelType));

        if (parsedEvent.ret === "0" || parsedEvent.ret === 0) {
            if (parsedEvent.cmd === "DROP" && parsedEvent.msg.state === "QUEUING")
                this.channel.channelInfo.chatRoomInfos.delete(parsedEvent.msg.mm_contact_id);
            if (parsedEvent.cmd === "EVT_TRANSFER") {
                parsedEvent.msg.state = CounselFlowHubChatCode.ChatState.TRANSFERRING;
                this.onCallEvent(parsedEvent);
                return;
            } else if (parsedEvent.cmd === "EVT_TRANSFER_CANCEL") {
                this.onCallEvent(parsedEvent);
            }
            this.channel.channelInfo.subState = parsedEvent.cmd === "NOT_READY" || parsedEvent.cmd === "SET_STATUS" ? parsedEvent.msg.reason_code : "";

            this.occurResolve(parsedEvent.msg);
        } else if (parsedEvent.ret === "1" || parsedEvent.ret === 1){
            if (parsedEvent.cmd === "CONTACT_LIST")
                return;

            this.occurReject(EtsClientEventHandler.convertError(parsedEvent, this.channel.channelType));
        } else {
            this.occurReject(EtsClientEventHandler.convertError(parsedEvent, this.channel.channelType));
        }
    }

    onAgentEvent(event) {
        const parsedEvent = EtsClientEventHandler.parseData(event);
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/emc] onAgentEvent : ", parsedEvent);
        if (!parsedEvent.msg || !parsedEvent.msg.contact_type || parsedEvent.msg.contact_type !== "CHAT") return;

        if (parsedEvent.ret === "0" || parsedEvent.ret === 0) {
            this.channel.channelInfo.state = CounselFlowHubChatChannelEmcEventHandler.parseChannelState(parsedEvent.msg.state);
            this.channel.occurEvent(new CounselFlowHubChannelEvent(this.channel.channelType, this.channel.channelInfo, new Date()));
        } else {
            this.occurReject(EtsClientEventHandler.convertError(parsedEvent, this.channel.channelType));
        }
    }

    onCallEvent(event) {
        const parsedEvent = EtsClientEventHandler.parseData(event);
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/emc] onCallEvent : ", parsedEvent);
        if (!parsedEvent.msg || !parsedEvent.msg.contact_type || parsedEvent.msg.contact_type !== "CHAT") return;

        if (parsedEvent.ret === "0" || parsedEvent.ret === 0) {
            const chatRoomInfo = CounselFlowHubChatChannelEmcEventHandler.parseChatRoomInfo(this.channel, parsedEvent.msg);
            if (!chatRoomInfo) return;

            switch (chatRoomInfo.state) {
                case CounselFlowHubChatCode.ChatState.WAIT_ACCEPT:
                case CounselFlowHubChatCode.ChatState.CHATTING:
                case CounselFlowHubChatCode.ChatState.STANDBY:
                case CounselFlowHubChatCode.ChatState.HOLD:
                case CounselFlowHubChatCode.ChatState.PROCESS:
                case CounselFlowHubChatCode.ChatState.TRANSFERRING:
                    this.channel.channelInfo.chatRoomInfos.set(chatRoomInfo.id, chatRoomInfo);
                    break;

                case CounselFlowHubChatCode.ChatState.FINISH:
                    this.channel.channelInfo.chatRoomInfos.delete(chatRoomInfo.id);
                    break;
            }

            this.channel.channelInfo.state = CounselFlowHubChatChannelEmcEventHandler.parseChannelStateByChatRoomInfos(this.channel, this.channel.channelInfo.chatRoomInfos);
            this.channel.occurEvent(new CounselFlowHubChannelEvent(this.channel.channelType, this.channel.channelInfo, new Date()));
        } else {
            this.occurReject(EtsClientEventHandler.convertError(parsedEvent, this.channel.channelType));
        }
    }

    onErrorEvent(event) {
        const parsedEvent = EtsClientEventHandler.parseData(event);
        CounselFlowHubChatChannelConsole.log("[counsel-flow-hub/chat/emc] onErrorEvent : ", parsedEvent);
    }

    static parseChannelState(state) {
        if (state === "LOGIN" || state === "NOTREADY")
            return CounselFlowHubChatCode.ChannelState.ABSENCE;
        else if (state === "READY")
            return CounselFlowHubChatCode.ChannelState.READY;
        else if (state === "LOGOUT")
            return CounselFlowHubChatCode.ChannelState.NOTLOGIN;
        else if (state === "ACW")
            return CounselFlowHubChatCode.ChannelState.PROCESS;

        return CounselFlowHubChatCode.ChannelState.NOTLOGIN;
    }

    static parseChannelStateByChatRoomInfos(channel, chatRoomInfos) {
        let isOffering = false;
        if(chatRoomInfos && chatRoomInfos.size > 0) {
            chatRoomInfos.forEach(chatRoomInfo => {
                if (chatRoomInfo.state === CounselFlowHubChatCode.ChatState.WAIT_ACCEPT)
                    isOffering = true;
            });
        }

        if (isOffering)
            return CounselFlowHubChatCode.ChannelState.OFFERING;

        if (channel.channelInfo.state === CounselFlowHubChatCode.ChannelState.OFFERING)
            return CounselFlowHubChatCode.ChannelState.READY;
        else
            return channel.channelInfo.state;
    }

    static parseChatState(state, isActive, isHold) {
        if (state === "ALERTING")
            return CounselFlowHubChatCode.ChatState.WAIT_ACCEPT;
        else if (state === "CONNECTED" && isActive === "ON" && (isHold === "" || isHold === "OFF"))
            return CounselFlowHubChatCode.ChatState.CHATTING;
        else if (state === "CONNECTED" && isActive === "OFF" && (isHold === "" || isHold === "OFF"))
            return CounselFlowHubChatCode.ChatState.STANDBY;
        else if (state === "CONNECTED" && isActive === "ON" && isHold === "ON")
            return CounselFlowHubChatCode.ChatState.HOLD;
        else if (state === "ACW")
            return CounselFlowHubChatCode.ChatState.PROCESS;
        else if (state === "ETS_RELEASE" || state === "RELEASE")
            return CounselFlowHubChatCode.ChatState.FINISH;

        return state;
    }

    static parseChatRoomInfo(channel, event) {
        const customerData = EtsClientEventHandler.parseData(event.customer_data);
        let chatRoomInfo = channel.channelInfo.chatRoomInfos.get(event.mm_contact_id);
        if (!chatRoomInfo)
            chatRoomInfo = new CounselFlowHubChatRoomInfo();

        if ((event.flag_is_transfer === "ON" && event.transfer_agent === "") || ((event.flag_is_transfer === "" || event.flag_is_transfer === "OFF"))) {
            if (event.state === "QUEUING") return;

            if (channel.channelInfo.chatRoomInfos.get(event.mm_contact_id)) {
                chatRoomInfo = channel.channelInfo.chatRoomInfos.get(event.mm_contact_id);
            } else {
                chatRoomInfo.connectionId = event.cti_contact_id;
                chatRoomInfo.startDate = customerData.TIME_OPEN;
            }

            if (event.call_type === "TRANS_COMPLETE" && event.state === "RELEASE" && chatRoomInfo.connectionId !== event.cti_contact_id)
                return null;

            chatRoomInfo.type = customerData.METHOD_NAME;
            chatRoomInfo.inboundPath = event.skill;
            chatRoomInfo.id = event.mm_contact_id;
            chatRoomInfo.state = CounselFlowHubChatChannelEmcEventHandler.parseChatState(event.state, event.flag_active, event.flag_hold);
            chatRoomInfo.xferMessage = customerData.transferMessage;


            let members = [];
            let agent = new CounselFlowHubChatRoomMember();
            agent.type = "AGENT";
            agent.id = event.agent;
            members.push(agent);

            let customer = new CounselFlowHubChatRoomMember();
            customer.type = "CUSTOMER";
            customer.id = customerData.MEMBER_KEY;
            members.push(customer);

            chatRoomInfo.members = members;

            if (chatRoomInfo.state === "ETS_ACCEPT" && event.flag_is_transfer === "OFF" && (event.call_type === "" || event.call_type === "NONE" ||  event.call_type === "TRANS_COMPLETE")) {
                channel.join(chatRoomInfo)
                    .then(function () {
                    }.bind(this));
            }
        } else if (event.flag_is_transfer === "ON" && event.transfer_agent !== "") {
            if (event.state === "RESERVED" || event.state === "ALERTING") {
                chatRoomInfo.state = CounselFlowHubChatCode.ChatState.TRANSFERRING;
                chatRoomInfo.xferMessage = customerData.transferMessage;
            } else if (event.state === "ETS_ACCEPT") {
                chatRoomInfo.xferConnectionId = event.cti_contact_id;
                channel.transferComplete(chatRoomInfo)
                    .then(function () {
                    }.bind(this));
            } else if (event.state === "ETS_RELEASE" || event.state === "RELEASE") {
                chatRoomInfo.state = CounselFlowHubChatCode.ChatState.CHATTING;
            }
        }
        return chatRoomInfo;
    }
}
