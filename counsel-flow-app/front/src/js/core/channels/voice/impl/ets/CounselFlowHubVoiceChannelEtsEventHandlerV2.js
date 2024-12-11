import EtsClientEventHandler from "../../../../utils/EtsClientEventHandler";
import CounselFlowHubVoiceChannelConsole from "../../CounselFlowHubVoiceChannelConsole";
import CounselFlowHubChannelEvent from "../../../../domain/CounselFlowHubChannelEvent";
import CounselFlowHubVoiceCallInfo from "../../domain/CounselFlowHubVoiceCallInfo";

export default class CounselFlowHubVoiceChannelEtsEventHandlerV2 extends EtsClientEventHandler {

    constructor(channel) {
        super(channel);
    }

    onResultEvent(event) {
        const parsedEvent = EtsClientEventHandler.parseData(event);
        CounselFlowHubVoiceChannelConsole.log("[counsel-flow-hub/voice/ets] onResultEvent : ", parsedEvent);

        if (parsedEvent.ret === "0" || parsedEvent.ret === 0) {
            if (parsedEvent.cmd === "NOT_READY") {
                this.channel.channelInfo.subState = parsedEvent.msg.reason_id;
                this.channel.channelInfo.callInfo = null;
            }

            if (parsedEvent.cmd === "DROP") {
                const callType = CounselFlowHubVoiceChannelEtsEventHandlerV2.parseCallType(parsedEvent.msg.call_type);
                if (callType === CounselFlowHubVoiceCode.CallType.CONSULT)
                    CounselFlowHubVoiceChannelEtsEventHandlerV2.rollbackCallInfoFromXferCallInfo(this.channel.channelInfo.callInfo);
            }

            this.occurResolve(parsedEvent.msg);
        } else {
            this.occurReject(EtsClientEventHandler.convertError(parsedEvent, this.channel.channelType));
        }
    }

    onAgentEvent(event) {
        const parsedEvent = EtsClientEventHandler.parseData(event);
        CounselFlowHubVoiceChannelConsole.log("[counsel-flow-hub/voice/ets] onAgentEvent : ", parsedEvent);

        if (this.channel.channelInfo.callInfo
            && this.channel.channelInfo.callInfo.callType === CounselFlowHubVoiceCode.CallType.CONFERENCE
            && parsedEvent.msg.state === "TALKING") {
            this.channel.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.ACTIVE;
            if (this.channel.channelInfo.callInfo.xferCallId)
                this.channel.channelInfo.callInfo.callId = this.channel.channelInfo.callInfo.xferCallId;
            this.channel.occurEvent(new CounselFlowHubChannelEvent(this.channel.channelType, this.channel.channelInfo, new Date()));
        } else if (parsedEvent.msg.state === "HOLD") {
            this.channel.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.HELD;
            this.channel.occurEvent(new CounselFlowHubChannelEvent(this.channel.channelType, this.channel.channelInfo, new Date()));
        } else if (parsedEvent.msg.state === "RETRIEVE") {
            this.channel.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.ACTIVE;
            this.channel.occurEvent(new CounselFlowHubChannelEvent(this.channel.channelType, this.channel.channelInfo, new Date()));
        } else if (parsedEvent.msg.state === "WORK") {
            this.channel.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.PROCESS;
            this.channel.occurEvent(new CounselFlowHubChannelEvent(this.channel.channelType, this.channel.channelInfo, new Date()));
        } else if (parsedEvent.msg.state === "NOT_READY") {
            this.channel.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.ABSENCE;
            this.channel.channelInfo.subState = parsedEvent.msg.reason_id;
            this.channel.channelInfo.callInfo = null;
            this.channel.occurEvent(new CounselFlowHubChannelEvent(this.channel.channelType, this.channel.channelInfo, new Date()));
        }
    }

    onCallEvent(event) {
        const parsedEvent = EtsClientEventHandler.parseData(event);
        CounselFlowHubVoiceChannelConsole.log("[counsel-flow-hub/voice/ets] onCallEvent : ", parsedEvent);

        if (parsedEvent.cmd === "dialog") {
            const parsedCallType = parsedEvent.msg.call_type;

            if (this.channel.channelInfo.callInfo && this.channel.channelInfo.callInfo.xferCallId && parsedCallType === "OUT") return;
            if (parsedCallType === "CONSULT_OFFERED") return;

            const channelInfo = EtsClientEventHandler.parseData(parsedEvent.msg[this.channel.channelInfo.extension]);
            if (!channelInfo) return;
            if (channelInfo.state === "INITIATING") return;

            if ((parsedCallType === CounselFlowHubVoiceCode.CallType.TRANSFER || parsedCallType === CounselFlowHubVoiceCode.CallType.CONFERENCE)
                && parsedEvent.msg.state === "ACTIVE"
                && this.channel.channelInfo.callInfo
                && this.channel.channelInfo.callInfo.callType === CounselFlowHubVoiceCode.CallType.CONSULT
                && this.channel.channelInfo.state === CounselFlowHubVoiceCode.ChannelState.ACTIVE)
                return;

            this.channel.channelInfo.state = CounselFlowHubVoiceChannelEtsEventHandlerV2.parseChannelState(channelInfo.state);
            this.channel.channelInfo.subState = parsedEvent.msg.reason_id;

            if (parsedCallType === CounselFlowHubVoiceCode.CallType.CONSULT && channelInfo.state === "DROPPED")
                CounselFlowHubVoiceChannelEtsEventHandlerV2.rollbackCallInfoFromXferCallInfo(this.channel.channelInfo.callInfo);
            else
                this.channel.channelInfo.callInfo = CounselFlowHubVoiceChannelEtsEventHandlerV2.parseCallInfo(parsedEvent, this.channel.channelInfo);

            this.channel.occurEvent(new CounselFlowHubChannelEvent(this.channel.channelType, this.channel.channelInfo, new Date()));
        }
    }

    static parseChannelState(state) {
        if (state === "NOT_READY")
            return CounselFlowHubVoiceCode.ChannelState.ABSENCE;
        else if (state === "READY")
            return CounselFlowHubVoiceCode.ChannelState.READY;
        else if (state === "ALERTING")
            return CounselFlowHubVoiceCode.ChannelState.OFFERING;
        else if (state === "INITIATED")
            return CounselFlowHubVoiceCode.ChannelState.RINGBACK;
        else if (state === "TALKING" || state === "ACTIVE")
            return CounselFlowHubVoiceCode.ChannelState.ACTIVE;
        else if (state === "HELD" || state === "HOLD")
            return CounselFlowHubVoiceCode.ChannelState.HELD;
        else if (state === "DROPPED" || state === "WORK" || state === "WORK_READY" || state === "WRAP_UP")
            return CounselFlowHubVoiceCode.ChannelState.PROCESS;

        return CounselFlowHubVoiceCode.ChannelState.NOTLOGIN;
    }

    static parseCallInfo(event, channelInfo) {
        let callInfo = new CounselFlowHubVoiceCallInfo();

        const callType = CounselFlowHubVoiceChannelEtsEventHandlerV2.parseCallType(event.msg.call_type);
        if (callType === null) return callInfo;

        callInfo.callId = event.msg.call_id;
        callInfo.callType = callType;
        callInfo.direction = (channelInfo.extension !== event.msg.from ? CounselFlowHubVoiceCode.Direction.INBOUND : CounselFlowHubVoiceCode.Direction.OUTBOUND);
        callInfo.callerId = event.msg.from;
        callInfo.calledId = event.msg.to;

        callInfo.extraData = {};
        if (event.msg.callVariable1)
            callInfo.extraData.callVariable1 = event.msg.callVariable1;
        if (event.msg.callVariable2)
            callInfo.extraData.callVariable2 = event.msg.callVariable2;
        if (event.msg.callVariable3)
            callInfo.extraData.callVariable3 = event.msg.callVariable3;
        if (event.msg.callVariable4)
            callInfo.extraData.callVariable4 = event.msg.callVariable4;
        if (event.msg.callVariable5)
            callInfo.extraData.callVariable5 = event.msg.callVariable5;
        if (event.msg.callVariable6)
            callInfo.extraData.callVariable6 = event.msg.callVariable6;
        if (event.msg.callVariable7)
            callInfo.extraData.callVariable7 = event.msg.callVariable7;
        if (event.msg.callVariable8)
            callInfo.extraData.callVariable8 = event.msg.callVariable8;
        if (event.msg.callVariable9)
            callInfo.extraData.callVariable9 = event.msg.callVariable9;
        if (event.msg.callVariable10)
            callInfo.extraData.callVariable10 = event.msg.callVariable10;

        if (callType === CounselFlowHubVoiceCode.CallType.CONSULT) {
            if (channelInfo.callInfo && channelInfo.callInfo.xferCallId) {
                callInfo.callerId = channelInfo.callInfo.callerId;
                callInfo.calledId = channelInfo.callInfo.calledId;

                callInfo.xferCallId = channelInfo.callInfo.xferCallId;
                callInfo.xferDirection = channelInfo.callInfo.direction;
                callInfo.xferCallerId = channelInfo.callInfo.callerId;
                callInfo.xferCalledId = channelInfo.callInfo.calledId;
                callInfo.xferExtraData = channelInfo.callInfo.extraData;
            } else {
                if (channelInfo.callInfo && channelInfo.callInfo.callerId)
                    callInfo.callerId = channelInfo.callInfo.callerId;
                if (channelInfo.callInfo && channelInfo.callInfo.calledId)
                    callInfo.calledId = channelInfo.callInfo.calledId;
                if (channelInfo.callInfo)
                    CounselFlowHubVoiceChannelEtsEventHandlerV2.copyToXferCallInfoFromCallInfo(callInfo, channelInfo.callInfo);
            }
        }

        return callInfo;
    }

    static parseCallType(callType) {
        if (callType === "CONSULT")
            return CounselFlowHubVoiceCode.CallType.CONSULT;
        else if (callType === "CONFERENCE")
            return CounselFlowHubVoiceCode.CallType.CONFERENCE;
        else if (callType === "TRANSFER")
            return CounselFlowHubVoiceCode.CallType.TRANSFER;

        return CounselFlowHubVoiceCode.CallType.NORMAL;
    }

    static copyToXferCallInfoFromCallInfo(dest, origin) {
        dest.xferCallId = origin.callId;
        dest.xferDirection = origin.direction;
        dest.xferCallerId = origin.callerId;
        dest.xferCalledId = origin.calledId;
        dest.xferExtraData = origin.extraData;
    }

    static rollbackCallInfoFromXferCallInfo(callInfo) {
        callInfo.callId = callInfo.xferCallId
        callInfo.direction = callInfo.xferDirection;
        callInfo.callerId = callInfo.xferCallerId;
        callInfo.calledId = callInfo.xferCalledId;
        callInfo.extraData = callInfo.xferExtraData;

        callInfo.xferCallId = null;
        callInfo.xferDirection = null;
        callInfo.xferCallerId = null;
        callInfo.xferCalledId = null;
        callInfo.xferExtraData = null;
    }
}
