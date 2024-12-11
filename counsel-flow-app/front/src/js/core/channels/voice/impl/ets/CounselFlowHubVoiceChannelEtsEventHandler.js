import EtsClientEventHandler from "../../../../utils/EtsClientEventHandler";
import CounselFlowHubChannelEvent from "../../../../domain/CounselFlowHubChannelEvent";
import CounselFlowHubVoiceChannelConsole from "../../CounselFlowHubVoiceChannelConsole";
import CounselFlowHubVoiceCallInfo from "../../domain/CounselFlowHubVoiceCallInfo";

export default class CounselFlowHubVoiceChannelEtsEventHandler extends EtsClientEventHandler {

    constructor(channel) {
        super(channel);
    }

    onResultEvent(event) {
        const parsedEvent = EtsClientEventHandler.parseData(event);
        CounselFlowHubVoiceChannelConsole.log("[counsel-flow-hub/voice/ets] onResultEvent : ", event);

        if (parsedEvent.ret === "0" || parsedEvent.ret === 0) {
            if (parsedEvent.msg && parsedEvent.msg.state)
                this.channel.channelInfo.subState = parsedEvent.msg.state === "NOT_READY" ? parsedEvent.msg.reason_id : "";

            if (parsedEvent.cmd === "DROP") {
                const callType = CounselFlowHubVoiceChannelEtsEventHandler.parseCallType(parsedEvent.msg.call_type);

                if (callType === CounselFlowHubVoiceCode.CallType.CONSULT || callType === CounselFlowHubVoiceCode.CallType.CONFERENCE) {
                    const isLastCall = CounselFlowHubVoiceChannelEtsEventHandler.spliceCallInfos(parsedEvent, this.channel.channelInfo);

                    if (isLastCall === true) {
                        this.channel.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.HELD;
                        this.channel.occurEvent(new CounselFlowHubChannelEvent(this.channel.channelType, this.channel.channelInfo, new Date()));
                    }
                }
            }

            this.occurResolve(parsedEvent.msg);
        } else {
            this.occurReject(EtsClientEventHandler.convertError(parsedEvent, this.channel.channelType));
        }
    }

    onAgentEvent(event) {
        const parsedEvent = EtsClientEventHandler.parseData(event);
        CounselFlowHubVoiceChannelConsole.log("[counsel-flow-hub/voice/ets] onAgentEvent : ", event);

        if (parsedEvent.msg.state === "RESERVED")
            return;

        this.channel.channelInfo.state = CounselFlowHubVoiceChannelEtsEventHandler.parseChannelState(parsedEvent.msg.state);
        this.channel.channelInfo.subState = parsedEvent.msg.state === "NOT_READY" ? parsedEvent.msg.reason_id : "";

        this.channel.occurEvent(new CounselFlowHubChannelEvent(this.channel.channelType, this.channel.channelInfo, new Date()));
    }

    onCallEvent(event) {
        const parsedEvent = EtsClientEventHandler.parseData(event);
        CounselFlowHubVoiceChannelConsole.log("[counsel-flow-hub/voice/ets] onCallEvent : ", event);

        if (parsedEvent.msg.call_type === "SUPERVISOR_MONITOR") {
            return;
        }

        if (parsedEvent.cmd === "dialog") {
            const channelInfo = EtsClientEventHandler.parseData(parsedEvent.msg[this.channel.channelInfo.extension]);
            if (!channelInfo) return;

            if (channelInfo.state === "ALERTING" || channelInfo.state === "INITIATED" || channelInfo.state === "ACTIVE" || channelInfo.state === "HELD") {
                let isDuplicateCallId = false;
                if (this.channel.channelInfo && this.channel.channelInfo.callInfos && this.channel.channelInfo.callInfos.length > 0) {
                    this.channel.channelInfo.callInfos.forEach(callInfo => {
                        if (callInfo.callId === parsedEvent.msg.call_id)
                            isDuplicateCallId = true;
                    });
                }

                if (isDuplicateCallId === false)
                    this.channel.channelInfo.callInfos.push(CounselFlowHubVoiceChannelEtsEventHandler.parseCallInfo(parsedEvent, this.channel.channelInfo));

                // 상태가 변경되면 안되는 조건
                if (this.channel.channelInfo.callInfo && this.channel.channelInfo.callInfo.xferCallId
                    && (parsedEvent.msg.call_type === "PREROUTE_ACD_IN" || parsedEvent.msg.call_type === "OUT" || parsedEvent.msg.call_type === "AGENT_INSIDE" || parsedEvent.msg.call_type === "CONSULT_OFFERED" || parsedEvent.msg.call_type === "SUPERVISOR_MONITOR"))
                    return;

                const callType = CounselFlowHubVoiceChannelEtsEventHandler.parseCallType(parsedEvent.msg.call_type);

                if (callType === CounselFlowHubVoiceCode.CallType.TRANSFER && this.channel.channelInfo.callInfos.length > 1) {
                    this.channel.occurEvent(new CounselFlowHubChannelEvent(this.channel.channelType, this.channel.channelInfo, new Date()));
                    return;
                }

                // 상대방이 컨퍼런스 통화를 종료했을때(ARS)
                if (callType === CounselFlowHubVoiceCode.CallType.CONFERENCE && this.channel.channelInfo.callInfo && this.channel.channelInfo.callInfos.length === 1) {
                    this.channel.channelInfo.callInfo.callType = CounselFlowHubVoiceCode.CallType.NORMAL;

                    this.channel.channelInfo.callInfo.xferCallId = null;
                    this.channel.channelInfo.callInfo.xferDirection = null;
                    this.channel.channelInfo.callInfo.xferCallerId = null;
                    this.channel.channelInfo.callInfo.xferCalledId = null;
                    this.channel.channelInfo.callInfo.xferExtraData = null;

                    if (this.channel.channelInfo.callInfo.extraData && this.channel.channelInfo.callInfo.extraData.callVariable11)
                        this.channel.channelInfo.callInfo.extraData.callVariable11 = "";

                    this.channel.occurEvent(new CounselFlowHubChannelEvent(this.channel.channelType, this.channel.channelInfo, new Date()));
                    return;
                }

                this.channel.channelInfo.state = CounselFlowHubVoiceChannelEtsEventHandler.parseChannelState(channelInfo.state);
                this.channel.channelInfo.callInfo = CounselFlowHubVoiceChannelEtsEventHandler.parseCallInfo(parsedEvent, this.channel.channelInfo);

                this.channel.occurEvent(new CounselFlowHubChannelEvent(this.channel.channelType, this.channel.channelInfo, new Date()));
            } else if (channelInfo.state !== "INITIATING") {
                if (this.channel.channelInfo.state !== CounselFlowHubVoiceCode.ChannelState.ABSENCE &&
                    this.channel.channelInfo.state !== CounselFlowHubVoiceCode.ChannelState.PROCESS) {
                    this.channel.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.ABSENCE;

                    this.channel.channelInfo.callInfo = null;
                    this.channel.channelInfo.callInfos = [];

                    this.channel.occurEvent(new CounselFlowHubChannelEvent(this.channel.channelType, this.channel.channelInfo, new Date()));
                }
            }
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
            // else if (state === "TALKING")
        //     return CounselFlowHubVoiceCode.ChannelState.BUSY;
        else if (state === "TALKING" || state === "ACTIVE")
            return CounselFlowHubVoiceCode.ChannelState.ACTIVE;
        else if (state === "HELD" || state === "HOLD")
            return CounselFlowHubVoiceCode.ChannelState.HELD;
        else if (state === "DROPPED" || state === "WORK" || state === "WORK_READY")
            return CounselFlowHubVoiceCode.ChannelState.PROCESS;

        return CounselFlowHubVoiceCode.ChannelState.NOTLOGIN;
    }

    static parseCallInfo(event, channelInfo) {
        const callType = CounselFlowHubVoiceChannelEtsEventHandler.parseCallType(event.msg.call_type);
        if (callType === null)
            return null;

        let callInfo = new CounselFlowHubVoiceCallInfo();
        callInfo.callId = event.msg.call_id;
        callInfo.callType = callType;
        // callInfo.direction = (agentInfo.extension === event.msg.to ? CounselFlowHubVoiceCode.Direction.INBOUND : CounselFlowHubVoiceCode.Direction.OUTBOUND);
        callInfo.direction = (channelInfo.extension !== event.msg.from ? CounselFlowHubVoiceCode.Direction.INBOUND : CounselFlowHubVoiceCode.Direction.OUTBOUND);
        callInfo.callerId = event.msg.from;
        callInfo.calledId = event.msg.to;

        if (callType === CounselFlowHubVoiceCode.CallType.CONSULT || callType === CounselFlowHubVoiceCode.CallType.CONFERENCE) {
            if (channelInfo.callInfo) {
                if (channelInfo.callInfo.callerId)
                    callInfo.callerId = channelInfo.callInfo.callerId;
                if (channelInfo.callInfo.calledId)
                    callInfo.calledId = channelInfo.callInfo.calledId;
                CounselFlowHubVoiceChannelEtsEventHandler.copyToXferCallInfoFromCallInfo(callInfo, channelInfo.callInfo);
            }
        }

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

        //
        const callVariable11 = event.msg["user.conftype"];
        if (callVariable11)
            callInfo.extraData.callVariable11 = callVariable11;
        const callVariable12 = event.msg["user.accnum"];
        if (callVariable12)
            callInfo.extraData.callVariable12 = callVariable12;
        const callVariable13 = event.msg["user.dialogID"];
        if (callVariable13)
            callInfo.extraData.callVariable13 = callVariable13;
        const callVariable14 = event.msg["user.agentID"];
        if (callVariable14)
            callInfo.extraData.callVariable14 = callVariable14;

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

    static spliceCallInfos(event, channelInfo) {
        let callInfoIndex = -1;
        channelInfo.callInfos.forEach(function (callInfo, index) {
            if (callInfo.callId === event.msg.call_id)
                callInfoIndex = index;
        }.bind(this));

        if (callInfoIndex >= 0) {
            const isLastCall = (callInfoIndex === channelInfo.callInfos.length - 1);

            channelInfo.callInfos.splice(callInfoIndex, 1);
            channelInfo.callInfo = new CounselFlowHubVoiceCallInfo();
            if (channelInfo.callInfos.length >= 1) {
                channelInfo.callInfo = channelInfo.callInfos[channelInfo.callInfos.length - 1];

                return isLastCall;
            }
        }

        return false;
    }
}
