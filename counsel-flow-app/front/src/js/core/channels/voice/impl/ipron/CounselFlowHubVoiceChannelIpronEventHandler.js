import CounselFlowHubChannelError from "../../../../domain/CounselFlowHubChannelError";
import CounselFlowHubChannelEvent from "../../../../domain/CounselFlowHubChannelEvent";
import CounselFlowHubVoiceCallInfo from "../../domain/CounselFlowHubVoiceCallInfo";
import CounselFlowHubVoiceChannelIpronConsole from "./CounselFlowHubVoiceChannelIpronConsole";

export default class CounselFlowHubVoiceChannelIpronEventHandler {
  constructor(channel) {
    this.channel = channel;

    this.serverPromise = {
      resolve: null,
      reject: null,
    };
    this.commandPromise = {
      resolve: null,
      reject: null,
    };
  }

  newPromise(type) {
    return new Promise(
      function (resolve, reject) {
        if (type === "server") {
          this.serverPromise.resolve = resolve;
          this.serverPromise.reject = reject;
        } else {
          this.commandPromise.resolve = resolve;
          this.commandPromise.reject = reject;
        }
      }.bind(this)
    );
  }

  occurResolve(data, type) {
    if (type === "server") {
      if (this.serverPromise.resolve !== null) this.serverPromise.resolve(data);

      this.serverPromise.resolve = null;
      this.serverPromise.reject = null;
    } else {
      if (this.commandPromise.resolve !== null) this.commandPromise.resolve(data);

      this.commandPromise.resolve = null;
      this.commandPromise.reject = null;
    }
  }

  occurReject(error, type) {
    if (type === "server") {
      if (this.serverPromise.reject !== null) this.serverPromise.reject(error);

      this.serverPromise.resolve = null;
      this.serverPromise.reject = null;
    } else {
      if (this.commandPromise.reject !== null) this.commandPromise.reject(error);

      this.commandPromise.resolve = null;
      this.commandPromise.reject = null;
    }
  }

  onResponse(data) {
    let showLog = CounselFlowHubVoiceChannelIpronConsole.isPrintResponse;
    if (CounselFlowHubVoiceChannelIpronConsole.isPrintFetcherResponse === false) {
      if (data.messagetype === ipron.MsgType.ICResponse) {
        if (
          data.method === ipron.APIMethod.GETGROUPLIST_RES ||
          data.method === ipron.APIMethod.GETQUEUELIST_RES ||
          data.method === ipron.APIMethod.GETAGENT_QUEUELIST_RES
        )
          showLog = false;
      }
    }
    if (showLog === true)
      CounselFlowHubVoiceChannelIpronConsole.log("[counsel-flow-hub/voice/ipron] onResponse : ", data);

    if (data.messagetype === ipron.MsgType.AjaxResponse) {
      if (data.method === ipron.Request.CloseServer) {
        if (data.result === ipron.JSONValue.True) {
          this.channel.connected = false;
          this.occurResolve(data, "server");
        }
      }

      if (data.result === ipron.JSONValue.False)
        this.occurReject(CounselFlowHubChannelError.UNKNOWN_ERROR.create(this.channel.channelType));
    } else if (data.messagetype === ipron.MsgType.ICResponse) {
      if (data.method === ipron.APIMethod.GETGROUPLIST_RES) {
        if (data.result === 0) {
          const groups = [];

          const keys = CounselFlowHubVoiceChannelIpronEventHandler.getExtensionDataKeys(data.extensiondata);
          keys.forEach(function (key) {
            const dataArray = data.extensiondata[key];
            groups.push({
              id: key,
              name: dataArray !== undefined && dataArray !== null && dataArray.length > 0 ? dataArray[0] : "",
            });
          });

          this.occurResolve(groups);
          return;
        }
      } else if (data.method === ipron.APIMethod.GETQUEUELIST_RES) {
        if (data.result === 0) {
          const queues = [];

          const keys = CounselFlowHubVoiceChannelIpronEventHandler.getExtensionDataKeys(data.extensiondata);
          keys.forEach(function (key) {
            const dataArray = data.extensiondata[key];
            queues.push({
              id: key,
              dn: dataArray !== undefined && dataArray !== null && dataArray.length > 0 ? dataArray[0] : "",
              name: dataArray !== undefined && dataArray !== null && dataArray.length > 1 ? dataArray[1] : "",
            });
          });

          this.occurResolve(queues);
          return;
        }
      } else if (data.method === ipron.APIMethod.GETAGENT_QUEUELIST_RES) {
        if (data.result === 0) {
          const queues = [];

          const keys = CounselFlowHubVoiceChannelIpronEventHandler.getExtensionDataKeys(data.extensiondata);
          keys.forEach(function (key) {
            const dataArray = data.extensiondata[key];
            queues.push({
              id: key,
              name: dataArray !== undefined && dataArray !== null && dataArray.length > 0 ? dataArray[0] : "",
              dn: dataArray !== undefined && dataArray !== null && dataArray.length > 1 ? dataArray[1] : "",
              skillId: dataArray !== undefined && dataArray !== null && dataArray.length > 2 ? dataArray[2] : "",
            });
          });

          this.occurResolve(queues);
          return;
        }
      } else if (data.method === ipron.APIMethod.GETAGENTLIST_RES) {
        if (data.result === 0) {
          const queues = [];

          const keys = CounselFlowHubVoiceChannelIpronEventHandler.getExtensionDataKeys(data.extensiondata);
          keys.forEach(function (key) {
            const dataArray = data.extensiondata[key];

            let state = "";
            let subState =
              dataArray !== undefined && dataArray !== null && dataArray.length > 4 ? Number(dataArray[4]) : "";
            if (dataArray !== undefined && dataArray !== null && dataArray.length > 3) {
              state = CounselFlowHubVoiceChannelIpronEventHandler.parseChannelState(Number(dataArray[3]));
              if (dataArray[3] === "20") {
                state = CounselFlowHubVoiceCode.ChannelState.ABSENCE;
                subState = -999;
              }
            }

            queues.push({
              assignDn: dataArray !== undefined && dataArray !== null && dataArray.length > 0 ? dataArray[0] : "",
              loginDn: dataArray !== undefined && dataArray !== null && dataArray.length > 1 ? dataArray[1] : "",
              agentName: dataArray !== undefined && dataArray !== null && dataArray.length > 2 ? dataArray[2] : "",
              state: state,
              subState: subState,
              stateTime:
                dataArray !== undefined && dataArray !== null && dataArray.length > 5 ? Number(dataArray[5]) : "",
              inOut:
                dataArray !== undefined && dataArray !== null && dataArray.length > 6
                  ? CounselFlowHubVoiceChannelIpronEventHandler.getInboundOutbound(Number(dataArray[6]))
                  : "",
              skillLevel: dataArray !== undefined && dataArray !== null && dataArray.length > 7 ? dataArray[7] : "",
            });
          });

          this.occurResolve(queues);
          return;
        }
      }

      if (data.result === 0) this.occurResolve(data);
      else this.occurReject(CounselFlowHubVoiceChannelIpronEventHandler.convertError(data, this.channel.channelType));
    }
  }

  onEvent(data) {
    let showLog = CounselFlowHubVoiceChannelIpronConsole.isPrintEvent;
    if (CounselFlowHubVoiceChannelIpronConsole.isPrintSubscribeEvent === false) {
      if (data.method === ipron.APIEvent.QUEUE_SSCRIBE_PUSH) showLog = false;
    }
    if (showLog === true) CounselFlowHubVoiceChannelIpronConsole.log("[counsel-flow-hub/voice/ipron] onEvent : ", data);

    if (
      data.method === ipron.WebEvent.ERR_OPENSERVER ||
      data.method === ipron.WebEvent.ERR_DISCONNECT ||
      data.method === ipron.APIEvent.ACTIVE_TIMEOUT
    ) {
      let isNeedOccurEvent = this.channel.connected === true;

      this.channel.connected = false;
      this.occurReject(
        CounselFlowHubVoiceChannelIpronEventHandler.convertError(data, this.channel.channelType),
        "server"
      );

      if (isNeedOccurEvent === true) {
        this.channel.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.NOTLOGIN;
        this.channel.channelInfo.subState = null;
        if (this.channel.isLogoutByUser === false) this.channel.channelInfo.subState = -1000;
        this.channel.occurEvent(
          new CounselFlowHubChannelEvent(
            this.channel.channelType,
            this.channel.channelInfo,
            CounselFlowHubVoiceChannelIpronEventHandler.extractDate(data)
          )
        );
      }
    } else if (data.method === ipron.APIEvent.OPENSRVSUCCESS) {
      this.channel.connected = true;
      this.occurResolve(data, "server");
    } else if (data.method === ipron.APIEvent.BANISHMENT) {
      ipron.Unregister(this.channel.channelInfo.extension, this.channel.options.tenant);
      ipron.CloseServer();

      this.channel.connected = false;
      this.channel.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.NOTLOGIN;
      this.channel.channelInfo.subState = null;
      this.channel.channelInfo.callInfo = null;
      this.channel.channelInfo.callInfos = [];
      this.channel.occurEvent(
        new CounselFlowHubChannelEvent(
          this.channel.channelType,
          this.channel.channelInfo,
          CounselFlowHubVoiceChannelIpronEventHandler.extractDate(data)
        )
      );
    } else {
      if (data.method === ipron.APIEvent.QUEUE_SSCRIBE_PUSH) {
        this.channel.occurEvent(
          new CounselFlowHubChannelEvent(
            this.channel.channelType,
            this.channel.channelInfo,
            CounselFlowHubVoiceChannelIpronEventHandler.extractDate(data),
            CounselFlowHubVoiceChannelIpronEventHandler.parseQueueReportInfo(data)
          )
        );
      }
      if (data.agentstate !== undefined) {
        const state = CounselFlowHubVoiceChannelIpronEventHandler.parseChannelState(data.agentstate);
        const subState = data.agentstatesub;
        if (this.channel.channelInfo.state !== state || this.channel.channelInfo.subState !== subState) {
          this.channel.channelInfo.state = state;
          this.channel.channelInfo.subState = subState;

          if (this.channel.channelInfo.state !== CounselFlowHubVoiceCode.ChannelState.ACTIVE) {
            this.channel.channelInfo.callInfo = new CounselFlowHubVoiceCallInfo();
            this.channel.channelInfo.callInfos = [];
          }

          this.channel.occurEvent(
            new CounselFlowHubChannelEvent(
              this.channel.channelType,
              this.channel.channelInfo,
              CounselFlowHubVoiceChannelIpronEventHandler.extractDate(data)
            )
          );
        }
      } else {
        if (data.method === ipron.APIEvent.INITIATED) {
          this.channel.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.BUSY;
          this.channel.occurEvent(
            new CounselFlowHubChannelEvent(
              this.channel.channelType,
              this.channel.channelInfo,
              CounselFlowHubVoiceChannelIpronEventHandler.extractDate(data)
            )
          );
        } else if (data.method === ipron.APIEvent.RINGING) {
          this.channel.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.OFFERING;
          this.channel.channelInfo.callInfo = CounselFlowHubVoiceChannelIpronEventHandler.parseCallInfo(
            data,
            this.channel.channelInfo
          );
          this.channel.channelInfo.callInfos.push(this.channel.channelInfo.callInfo);

          this.channel.occurEvent(
            new CounselFlowHubChannelEvent(
              this.channel.channelType,
              this.channel.channelInfo,
              CounselFlowHubVoiceChannelIpronEventHandler.extractDate(data)
            )
          );
        } else if (data.method === ipron.APIEvent.DIALING) {
          this.channel.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.RINGBACK;
          this.channel.channelInfo.callInfo = CounselFlowHubVoiceChannelIpronEventHandler.parseCallInfo(
            data,
            this.channel.channelInfo
          );
          if (this.channel.channelInfo.callInfos.length >= 2)
            this.channel.channelInfo.callInfo.callType = CounselFlowHubVoiceCode.CallType.CONSULT;
          this.channel.channelInfo.callInfos.push(this.channel.channelInfo.callInfo);

          this.channel.occurEvent(
            new CounselFlowHubChannelEvent(
              this.channel.channelType,
              this.channel.channelInfo,
              CounselFlowHubVoiceChannelIpronEventHandler.extractDate(data)
            )
          );
        } else if (data.method === ipron.APIEvent.ESTABLISHED) {
          this.channel.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.ACTIVE;
          this.channel.occurEvent(
            new CounselFlowHubChannelEvent(
              this.channel.channelType,
              this.channel.channelInfo,
              CounselFlowHubVoiceChannelIpronEventHandler.extractDate(data)
            )
          );
        } else if (data.method === ipron.APIEvent.PARTYCHANGED) {
          this.channel.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.ACTIVE;
          this.channel.channelInfo.callInfo.callType = CounselFlowHubVoiceCode.CallType.TRANSFER;
          this.channel.channelInfo.callInfo.callId = data.callid;
          this.channel.channelInfo.callInfo.connectionId = data.connectionid;

          const callInfo = CounselFlowHubVoiceChannelIpronEventHandler.parseCallInfo(data, this.channel.channelInfo);
          this.channel.channelInfo.callInfo.extraData = callInfo.extraData;

          this.channel.occurEvent(
            new CounselFlowHubChannelEvent(
              this.channel.channelType,
              this.channel.channelInfo,
              CounselFlowHubVoiceChannelIpronEventHandler.extractDate(data)
            )
          );
        } else if (data.method === ipron.APIEvent.PARTYADDED) {
          const prevCallType = this.channel.channelInfo.callInfo.callType;

          this.channel.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.ACTIVE;
          this.channel.channelInfo.callInfo.callType = CounselFlowHubVoiceCode.CallType.CONFERENCE;
          this.channel.channelInfo.callInfo.callId = data.callid;
          this.channel.channelInfo.callInfo.connectionId = data.connectionid;

          if (prevCallType === CounselFlowHubVoiceCode.CallType.NORMAL) {
            this.channel.channelInfo.callInfo.xferCallId = data.callid;
            this.channel.channelInfo.callInfo.xferConnectionId = data.connectionid;
            this.channel.channelInfo.callInfo.xferDirection = CounselFlowHubVoiceCode.Direction.OUTBOUND;
            this.channel.channelInfo.callInfo.xferCallerId = data.otherdn;
            this.channel.channelInfo.callInfo.xferCalledId = data.thirdpartydn;
          }

          const callInfo = CounselFlowHubVoiceChannelIpronEventHandler.parseCallInfo(data, this.channel.channelInfo);
          this.channel.channelInfo.callInfo.extraData = callInfo.extraData;

          this.channel.channelInfo.callInfos = [];
          this.channel.channelInfo.callInfos.push(this.channel.channelInfo.callInfo);

          this.channel.occurEvent(
            new CounselFlowHubChannelEvent(
              this.channel.channelType,
              this.channel.channelInfo,
              CounselFlowHubVoiceChannelIpronEventHandler.extractDate(data)
            )
          );
        } else if (data.method === ipron.APIEvent.PARTYDELETED) {
          this.channel.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.ACTIVE;
          this.channel.channelInfo.callInfo.callType = CounselFlowHubVoiceCode.CallType.NORMAL;

          //TODO Conference Call 종료시 데이터 오류가 있어서 재할당 - 확인 필요
          this.channel.channelInfo.callInfo.calledId = this.channel.channelInfo.callInfo.xferCalledId;
          this.channel.channelInfo.callInfo.callerId = this.channel.channelInfo.callInfo.xferCallerId;
          this.channel.channelInfo.callInfo.direction = this.channel.channelInfo.callInfo.xferDirection;

          this.channel.channelInfo.callInfo.xferCallId = null;
          this.channel.channelInfo.callInfo.xferConnectionId = null;
          this.channel.channelInfo.callInfo.xferDirection = null;
          this.channel.channelInfo.callInfo.xferCallerId = null;
          this.channel.channelInfo.callInfo.xferCalledId = null;

          const callInfo = CounselFlowHubVoiceChannelIpronEventHandler.parseCallInfo(data, this.channel.channelInfo);
          this.channel.channelInfo.callInfo.extraData = callInfo.extraData;

          this.channel.occurEvent(
            new CounselFlowHubChannelEvent(
              this.channel.channelType,
              this.channel.channelInfo,
              CounselFlowHubVoiceChannelIpronEventHandler.extractDate(data)
            )
          );
        } else if (data.method === ipron.APIEvent.HELD) {
          if (data.connectionid === this.channel.channelInfo.callInfo.connectionId) {
            this.channel.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.HELD;
            this.channel.occurEvent(
              new CounselFlowHubChannelEvent(
                this.channel.channelType,
                this.channel.channelInfo,
                CounselFlowHubVoiceChannelIpronEventHandler.extractDate(data)
              )
            );
          }
        } else if (data.method === ipron.APIEvent.RETRIEVED) {
          if (data.connectionid === this.channel.channelInfo.callInfo.connectionId) {
            this.channel.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.ACTIVE;
            this.channel.occurEvent(
              new CounselFlowHubChannelEvent(
                this.channel.channelType,
                this.channel.channelInfo,
                CounselFlowHubVoiceChannelIpronEventHandler.extractDate(data)
              )
            );
          }
        } else if (data.method === ipron.APIEvent.RELEASED) {
          // console.log("[RELEASED] : ", data);
          let callInfoIndex = -1;
          this.channel.channelInfo.callInfos.forEach(
            function (callInfo, index) {
              if (callInfo.callId === data.callid) callInfoIndex = index;
            }.bind(this)
          );

          // console.log("[callInfoIndex] : ", callInfoIndex);

          if (callInfoIndex >= 0) {
            const isLastCall = callInfoIndex === this.channel.channelInfo.callInfos.length - 1;

            // console.log("[isLastCall] : ", isLastCall);

            this.channel.channelInfo.callInfos.splice(callInfoIndex, 1);
            this.channel.channelInfo.callInfo = new CounselFlowHubVoiceCallInfo();

            if (this.channel.channelInfo.callInfos.length >= 1) {
              this.channel.channelInfo.callInfo =
                this.channel.channelInfo.callInfos[this.channel.channelInfo.callInfos.length - 1];

              if (isLastCall === true) {
                this.channel.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.HELD;
                this.channel.occurEvent(
                  new CounselFlowHubChannelEvent(
                    this.channel.channelType,
                    this.channel.channelInfo,
                    CounselFlowHubVoiceChannelIpronEventHandler.extractDate(data)
                  )
                );
              } else if (this.channel.channelInfo.callInfos.length === 1) {
                // console.log("여기 타나요?", JSON.parse(JSON.stringify(this.channel.channelInfo)));
                //TODO 협의전화가 끊기고 일반콜로 전환될 때
                // 협의통화가 연결돼서 ACTIVE상태에서 고객이 끊으면 NORMAL콜로 전환되는것 - 정상
                // 협의통화 연결중에 RINGBACK상태에서 고객이 끊으면 NORMAL콜 ACTIVE로 전환되는것 - 비정상
                // 그대로 RINGBACK이어야하는데 자꾸 ACTIVE로 바뀜
                if (this.channel.channelInfo.state === CounselFlowHubVoiceCode.ChannelState.ACTIVE) {
                  this.channel.channelInfo.callInfo.callType = CounselFlowHubVoiceCode.CallType.NORMAL;
                  this.channel.channelInfo.callInfo.xferCallId = null;
                  this.channel.channelInfo.callInfo.xferDirection = null;
                  this.channel.channelInfo.callInfo.xferCallerId = null;
                  this.channel.channelInfo.callInfo.xferCalledId = null;
                  this.channel.channelInfo.callInfo.xferExtraData = null;
                  this.channel.channelInfo.callInfo.xferConnectionId = null;
                  this.channel.occurEvent(
                    new CounselFlowHubChannelEvent(
                      this.channel.channelType,
                      this.channel.channelInfo,
                      CounselFlowHubVoiceChannelIpronEventHandler.extractDate(data)
                    )
                  );
                } else {
                  // this.channel.channelInfo.callInfo.callType = CounselFlowHubVoiceCode.CallType.CONSULT;
                  this.channel.channelInfo.callInfo.xferCallId = null;
                  this.channel.channelInfo.callInfo.xferDirection = null;
                  this.channel.channelInfo.callInfo.xferCallerId = null;
                  this.channel.channelInfo.callInfo.xferCalledId = null;
                  this.channel.channelInfo.callInfo.xferExtraData = null;
                  this.channel.channelInfo.callInfo.xferConnectionId = null;
                  return;
                  // this.channel.occurEvent(
                  //   new CounselFlowHubChannelEvent(
                  //     this.channel.channelType,
                  //     this.channel.channelInfo,
                  //     CounselFlowHubVoiceChannelIpronEventHandler.extractDate(data)
                  //   )
                  // );
                }
              }
            }
          }
        } else if (data.method === ipron.APIEvent.DIVERTED) {
          if (this.channel.channelInfo.state === CounselFlowHubVoiceCode.ChannelState.OFFERING) {
            this.channel.channelInfo.state = CounselFlowHubVoiceCode.ChannelState.ABSENCE;
            if (
              this.channel.channelInfo.callInfo.extraData === undefined ||
              this.channel.channelInfo.callInfo.extraData === null
            )
              this.channel.channelInfo.callInfo.extraData = {};
            this.channel.channelInfo.callInfo.extraData.isDiverted = true;

            this.channel.occurEvent(
              new CounselFlowHubChannelEvent(
                this.channel.channelType,
                this.channel.channelInfo,
                CounselFlowHubVoiceChannelIpronEventHandler.extractDate(data)
              )
            );
          }
        }
      }
    }
  }

  static parseChannelState(state) {
    if (state === 30) return CounselFlowHubVoiceCode.ChannelState.ABSENCE;
    else if (state === 40 || state === 41 || state === 42) return CounselFlowHubVoiceCode.ChannelState.READY;
    else if (state === 50) return CounselFlowHubVoiceCode.ChannelState.ACTIVE; // 통화중
    else if (state === 51) return CounselFlowHubVoiceCode.ChannelState.OFFERING; // 통화오는중
    else if (state === 52) return CounselFlowHubVoiceCode.ChannelState.RINGBACK; // 통화거는중
    else if (state === 60) return CounselFlowHubVoiceCode.ChannelState.PROCESS;

    return CounselFlowHubVoiceCode.ChannelState.NOTLOGIN;
  }

  static parseCallInfo(data, channelInfo) {
    const callInfo = new CounselFlowHubVoiceCallInfo();
    callInfo.callType = CounselFlowHubVoiceCode.CallType.NORMAL;
    callInfo.callId = data.callid;
    callInfo.connectionId = data.connectionid;

    let ani = data.ani;
    let otherDn = data.otherdn;
    if (data.calltype === 2) {
      callInfo.direction = CounselFlowHubVoiceCode.Direction.INBOUND;
      if (data.ani !== undefined && data.ani.length > 0) otherDn = data.ani;
    } else if (data.calltype === 3) {
      callInfo.direction = CounselFlowHubVoiceCode.Direction.OUTBOUND;
      if (data.dnis !== undefined && data.dnis.length > 0) otherDn = data.dnis;
    } else if (data.lastdn !== undefined && data.lastdn.length > 0) {
      ani = data.lastdn;
      otherDn = data.lastdn;
    }

    if (callInfo.direction === null)
      callInfo.direction =
        channelInfo.extension === ani
          ? CounselFlowHubVoiceCode.Direction.OUTBOUND
          : CounselFlowHubVoiceCode.Direction.INBOUND;
    callInfo.callerId =
      callInfo.direction === CounselFlowHubVoiceCode.Direction.OUTBOUND ? channelInfo.extension : otherDn;
    callInfo.calledId =
      callInfo.direction === CounselFlowHubVoiceCode.Direction.OUTBOUND ? otherDn : channelInfo.extension;

    if (data.extensiondata !== undefined) {
      if (data.extensiondata["xferData"] !== undefined && data.extensiondata["xferData"] !== null) {
        const xferData = JSON.parse(data.extensiondata["xferData"]);
        if (xferData.xferCallId !== null)
          CounselFlowHubVoiceChannelIpronEventHandler.copyToXferCallInfoFromXferCallInfo(callInfo, xferData);
        else CounselFlowHubVoiceChannelIpronEventHandler.copyToXferCallInfoFromCallInfo(callInfo, xferData);
        callInfo.xferCallId = xferData.callId;
        callInfo.xferConnectionId = xferData.connectionId;

        data.extensiondata["xferData"] = undefined;

        callInfo.callType = CounselFlowHubVoiceCode.CallType.CONSULT;
        if (data.extensiondata["direct"] !== undefined && data.extensiondata["direct"] !== null) {
          const direct = JSON.parse(data.extensiondata["direct"]);
          if (direct.type === "TRANSFER") callInfo.callType = CounselFlowHubVoiceCode.CallType.TRANSFER;
          else if (direct.type === "CONFERENCE") callInfo.callType = CounselFlowHubVoiceCode.CallType.CONFERENCE;
          data.extensiondata["direct"] = undefined;
        }
      }

      callInfo.extraData = data.extensiondata;
    }
    if (data.ucid !== undefined) {
      if (callInfo.extraData === undefined || callInfo.extraData === null) callInfo.extraData = {};

      callInfo.extraData.ucid = data.ucid;
    }

    return callInfo;
  }

  static parseQueueReportInfo(data) {
    return {
      waitCount: data.waitcount,
      method: data.method,
    };
  }

  static getExtensionDataKeys(extensionData) {
    if (extensionData === undefined || extensionData === null) return [];

    return Object.keys(extensionData);
  }

  static getInboundOutbound(value) {
    switch (value) {
      case 1:
        return CounselFlowHubVoiceCode.Direction.INBOUND;
      case 2:
        return CounselFlowHubVoiceCode.Direction.OUTBOUND;
    }

    return "";
  }

  static copyToXferCallInfoFromCallInfo(dest, origin) {
    dest.xferCallId = origin.callId;
    dest.xferDirection = origin.direction;
    dest.xferCallerId = origin.callerId;
    dest.xferCalledId = origin.calledId;
    dest.xferExtraData = origin.extraData;
    dest.xferConnectionId = origin.connectionId;
  }

  static copyToXferCallInfoFromXferCallInfo(dest, origin) {
    dest.xferCallId = origin.xferCallId;
    dest.xferDirection = origin.xferDirection;
    dest.xferCallerId = origin.xferCallerId;
    dest.xferCalledId = origin.xferCalledId;
    dest.xferExtraData = origin.xferExtraData;
    dest.xferConnectionId = origin.xferConnectionId;
  }

  static extractConnectionInfos(extensiondata) {
    const connectionInfos = [];
    const keys = Object.keys(extensiondata);
    keys.forEach(
      function (key) {
        const connectionInfo = extensiondata[key];
        if (connectionInfo.length >= 3) connectionInfos.push({ connectionId: key, callId: connectionInfo[2] });
      }.bind(this)
    );

    return connectionInfos;
  }

  static extractCallInfos(extensionData) {
    const callInfos = [];
    const keys = Object.keys(extensionData);
    keys.forEach(function (key) {
      const callInfo = extensionData[key];
      if (callInfo.length >= 3) callInfos.push({ state: callInfo[1], dn: callInfo[2] });
    });

    return callInfos;
  }

  static extractDate(data) {
    function parse(str) {
      const yyyy = str.substr(0, 4);
      const MM = str.substr(4, 2);
      const dd = str.substr(6, 2);
      const HH = str.substr(8, 2);
      const mm = str.substr(10, 2);
      const ss = str.substr(12, 2);
      return new Date(yyyy, MM - 1, dd, HH, mm, ss);
    }

    if (data.datetime !== undefined && data.datetime !== null) {
      if (data.datetime.length >= 14) return parse(data.datetime);
    }

    return new Date();
  }

  static convertError(data, channelType) {
    const error = CounselFlowHubChannelError.UNKNOWN_ERROR;
    error.original = {
      method: data.method,
      result: data.result,
      code: data.status,
      message: data.statusText,
    };

    if (data.statusText === "timeout") return CounselFlowHubChannelError.TIMEOUT.create(channelType);
    else if (data.result === 2001) return CounselFlowHubChannelError.LOGIN_ALREADY_LOGINED.create(channelType);
    else if (data.result === 2103) return CounselFlowHubChannelError.LOGIN_WRONG_TENANT.create(channelType);
    else if (data.result === 2101) return CounselFlowHubChannelError.INVALID_EXTENSION_NUMBER.create(channelType);
    else if (data.result === 2105) return CounselFlowHubChannelError.LOGIN_WRONG_ID.create(channelType);
    else if (data.result === 2106 || data.result === 2107)
      return CounselFlowHubChannelError.NO_RESOURCE_FOR_OPERATION.create(channelType);
    else if (data.result === 2110 || data.result === 2111)
      return CounselFlowHubChannelError.NO_RESOURCE_FOR_OPERATION.create(channelType);
    else if (data.result === 2502) return CounselFlowHubChannelError.LOGIN_WRONG_PASSWORD.create(channelType);
    else if (data.result === 2402) return CounselFlowHubChannelError.INVALID_CHANNEL_STATE.create(channelType);
    else if (data.result === 2405 || data.result === 2506)
      return CounselFlowHubChannelError.INVALID_CALL_STATE.create(channelType);

    return new CounselFlowHubChannelError(channelType, error);
  }
}
