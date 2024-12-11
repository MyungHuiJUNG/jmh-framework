import EtsClientEventHandler from "../../../../utils/EtsClientEventHandler";
import CounselFlowHubChannelEvent from "../../../../domain/CounselFlowHubChannelEvent";
import CounselFlowHubMailChannelConsole from "../../CounselFlowHubMailChannelConsole";
import CounselFlowHubMailInfo from "../../domain/CounselFlowHubMailInfo";
import CounselFlowHubMailAttachment from "../../domain/CounselFlowHubMailAttachment";
// import Moment from "moment"

export default class CounselFlowHubMailChannelEmcEventHandler extends EtsClientEventHandler {

    constructor(channel) {
        super(channel);
    }

    onResultEvent(event) {
        const parsedEvent = EtsClientEventHandler.parseData(event);
        CounselFlowHubMailChannelConsole.log("[counsel-flow-hub/mail/emc] onResultEvent : ", parsedEvent);
        if ((!parsedEvent.msg || !parsedEvent.msg.contact_type || parsedEvent.msg.contact_type !== "EMAIL") && !(parsedEvent.cmd === "LOGIN" || parsedEvent.cmd === "LOGOUT"))
            return this.occurReject(EtsClientEventHandler.convertError(parsedEvent, this.channel.channelType));

        if (parsedEvent.ret === "0" || parsedEvent.ret === 0) {
            if (parsedEvent.cmd === "DROP")
                this.onCallEvent(event);

            if (parsedEvent.cmd === "EVT_TRANSFER_CANCEL")
                return this.onCallEvent(event);

            this.channel.channelInfo.subState = parsedEvent.cmd === "NOT_READY" || parsedEvent.cmd === "SET_STATUS" ? parsedEvent.msg.reason_code : "";
            this.occurResolve(parsedEvent.msg);
        } else if (parsedEvent.ret === "1" || parsedEvent.ret === 1) {
            if (parsedEvent.cmd === "CONTACT_LIST")
                return;

            this.occurReject(EtsClientEventHandler.convertError(parsedEvent, this.channel.channelType));
        } else {
            this.occurReject(EtsClientEventHandler.convertError(parsedEvent, this.channel.channelType));
        }
    }

    onAgentEvent(event) {
        const parsedEvent = EtsClientEventHandler.parseData(event);
        CounselFlowHubMailChannelConsole.log("[counsel-flow-hub/mail/emc] onAgentEvent : ", parsedEvent);
        if (!parsedEvent.msg || !parsedEvent.msg.contact_type || parsedEvent.msg.contact_type !== "EMAIL") return;

        if (parsedEvent.ret === "0" || parsedEvent.ret === 0) {
            this.channel.channelInfo.state = CounselFlowHubMailChannelEmcEventHandler.parseChannelState(parsedEvent.msg.state);
            this.channel.occurEvent(new CounselFlowHubChannelEvent(this.channel.channelType, this.channel.channelInfo, new Date()));
        } else {
            this.occurReject(EtsClientEventHandler.convertError(parsedEvent, this.channel.channelType));
        }
    }

    async onCallEvent(event) {
        const parsedEvent = EtsClientEventHandler.parseData(event);
        CounselFlowHubMailChannelConsole.log("[counsel-flow-hub/mail/emc] onCallEvent : ", parsedEvent);
        if (!parsedEvent.msg || !parsedEvent.msg.contact_type || parsedEvent.msg.contact_type !== "EMAIL") return;

        if (parsedEvent.ret === "0" || parsedEvent.ret === 0) {
            let mailInfo = this.parseEmcEventToMailInfo(this.channel, parsedEvent.msg);
            switch (mailInfo.state) {
                case CounselFlowHubMailCode.MailState.WAIT_ACCEPT:
                    this.channel.channelInfo.mailInfos.set(mailInfo.connectionId, mailInfo);
                    this.channel.channelInfo.state = this.parseChannelStateByMailInfos(this.channel, this.channel.channelInfo.mailInfos);
                    this.channel.occurEvent(new CounselFlowHubChannelEvent(this.channel.channelType, this.channel.channelInfo, new Date()));
                    break;

                case CounselFlowHubMailCode.MailState.CONNECTED:
                case CounselFlowHubMailCode.MailState.PROCESS:
                    if (!mailInfo.mailId) {
                        const ecmEntity = await this.getMailDetail(mailInfo);
                        if (!ecmEntity) {
                            this.channel.channelInfo.mailInfos.set(mailInfo.connectionId, mailInfo);
                            this.occurReject(EtsClientEventHandler.convertError(parsedEvent, this.channel.channelType));
                            break;
                        }
                        mailInfo = this.parseEcmEntityToMailInfo(mailInfo, ecmEntity);
                    }
                    this.channel.channelInfo.mailInfos.set(mailInfo.connectionId, mailInfo);
                    this.channel.channelInfo.state = this.parseChannelStateByMailInfos(this.channel, this.channel.channelInfo.mailInfos);
                    this.channel.occurEvent(new CounselFlowHubChannelEvent(this.channel.channelType, this.channel.channelInfo, new Date()));
                    break;

                case CounselFlowHubMailCode.MailState.TRANSFERRING:
                case CounselFlowHubMailCode.MailState.FAILED_TRANSFER:
                    this.channel.channelInfo.mailInfos.set(mailInfo.connectionId, mailInfo);
                    this.channel.channelInfo.state = this.parseChannelStateByMailInfos(this.channel, this.channel.channelInfo.mailInfos);
                    this.channel.occurEvent(new CounselFlowHubChannelEvent(this.channel.channelType, this.channel.channelInfo, new Date()));
                    break;

                case CounselFlowHubMailCode.MailState.COMPLETE_TRANSFER:
                    this.channel.channelInfo.mailInfos.set(mailInfo.connectionId, mailInfo);
                    this.channel.channelInfo.state = this.parseChannelStateByMailInfos(this.channel, this.channel.channelInfo.mailInfos);
                    this.channel.occurEvent(new CounselFlowHubChannelEvent(this.channel.channelType, this.channel.channelInfo, new Date()));

                    this.channel.transferComplete(mailInfo)
                        .then(() => {
                            this.channel.rejectMail(mailInfo)
                                .then(() => {
                                    this.channel.occurEvent(new CounselFlowHubChannelEvent(this.channel.channelType, this.channel.channelInfo, new Date()));
                                });
                        });
                    break;

                case CounselFlowHubMailCode.MailState.FINISH:
                    this.channel.channelInfo.mailInfos.delete(mailInfo.connectionId);
                    this.channel.channelInfo.state = this.parseChannelStateByMailInfos(this.channel, this.channel.channelInfo.mailInfos);
                    this.channel.occurEvent(new CounselFlowHubChannelEvent(this.channel.channelType, this.channel.channelInfo, new Date()));
                    break;

            }
        } else {
            this.occurReject(EtsClientEventHandler.convertError(parsedEvent, this.channel.channelType));
        }
    }

    onErrorEvent(event) {
        const parsedEvent = EtsClientEventHandler.parseData(event);
        CounselFlowHubMailChannelConsole.log("[counsel-flow-hub/mail/emc] onErrorEvent : ", parsedEvent);
    }

    getMailDetail(mailInfo) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: mailInfo.extraData.contentUrl,
                contentType: "application/json",
                type: "GET",
                data: null,
                cache: false,
                processData: false,
                success: function (data) {
                    if (data && data.resCode === '9999') {
                        CounselFlowHubMailChannelConsole.error("[counsel-flow-hub/mail/emc] getMailDetail Error : ", data.resMsg);
                        resolve();
                    } else {
                        resolve(data);
                    }
                },
                error: function (data) {
                    resolve();
                }
            });
        });
    }

    parseEcmEntityToMailInfo(mailInfo, ecmEntity) {
        mailInfo.mailId = ecmEntity.email_id;
        mailInfo.ctiContactId = ecmEntity.cti_contact_id;
        mailInfo.subject = ecmEntity.content_title;
        mailInfo.content = ecmEntity.content_body;
        mailInfo.sender = ecmEntity.sender;
        mailInfo.recipients = ecmEntity.receiver ? ecmEntity.receiver.split(';') : null;
        mailInfo.ccRecipients = ecmEntity.receiver_cc ? ecmEntity.receiver_cc.split(';') : null;
        mailInfo.bccRecipients = ecmEntity.receiver_bcc ? ecmEntity.receiver_bcc.split(';') : null;
        mailInfo.dateTime = ecmEntity.received_time;
        mailInfo.attachments = [];
        if (ecmEntity.content_attach && ecmEntity.content_attach.length > 0) {
            ecmEntity.content_attach.forEach((attach) => {
                let attachment = new CounselFlowHubMailAttachment();
                attachment.type = attach.attach_type;
                attachment.fileName = attach.file_name
                attachment.fileUrl = attach.attach_url;
                attachment.filePath = attach.file_path;

                mailInfo.attachments.push(attachment);
            });
        }
        return mailInfo;
    }

    parseEmcEventToMailInfo(channel, event) {
        const customerData = EtsClientEventHandler.parseData(event.customer_data);
        const connectionId = event.mm_contact_id.replace('EMAIL', '');
        let mailInfo = channel.channelInfo.mailInfos.get(connectionId);
        if (!mailInfo)
            mailInfo = new CounselFlowHubMailInfo();

        mailInfo.type = event.contact_type;
        mailInfo.state = this.parseMailState(channel, event);
        mailInfo.inboundPath = customerData.SKILL;
        mailInfo.connectionId = connectionId;
        if (!(mailInfo.state === CounselFlowHubMailCode.MailState.TRANSFERRING || mailInfo.state === CounselFlowHubMailCode.MailState.FAILED_TRANSFER) && !mailInfo.ctiContactId)
            mailInfo.ctiContactId = event.cti_contact_id;

        mailInfo.extraData = customerData;
        mailInfo.extraData.inboundDate = customerData.TIME_OPEN;
        mailInfo.extraData.listUrl = customerData.LIST_URL;
        mailInfo.extraData.contentUrl = customerData.CONTANT_URL;
        mailInfo.extraData.sendUrl = customerData.SEND_URL;
        mailInfo.extraData.uploadUrl = customerData.UPLOAD_URL;

        return mailInfo;
    }

    parseMailState(channel, event) {
        if (event.state === "RESERVED" || event.state === "ALERTING") {
            if (event.call_type === 'TRANS' && event.transfer_agent !== "")
                return CounselFlowHubMailCode.MailState.TRANSFERRING;
            else
                return CounselFlowHubMailCode.MailState.WAIT_ACCEPT;
        } else if (event.state === "ETS_CONNECT" || event.state === "CONNECTED") {
            if (event.call_type === 'TRANS' && event.transfer_agent !== "")
                return CounselFlowHubMailCode.MailState.COMPLETE_TRANSFER;
            else
                return CounselFlowHubMailCode.MailState.CONNECTED;
        }
        else if (event.state === "ACW")
            return CounselFlowHubMailCode.MailState.PROCESS;
        else if (event.state === "ETS_RELEASE" || event.state === "RELEASE") {
            if (event.call_type === 'TRANS_EXPIRED' && event.transfer_agent !== "")
                return CounselFlowHubMailCode.MailState.FAILED_TRANSFER;
            else
                return CounselFlowHubMailCode.MailState.FINISH;
        }

        return event.state;
    }

    parseChannelStateByMailInfos(channel, mailInfos) {
        let isOffering = false;
        if(mailInfos && mailInfos.size > 0) {
            mailInfos.forEach(mailInfo => {
                if (mailInfo.state === CounselFlowHubMailCode.MailState.WAIT_ACCEPT)
                    isOffering = true;
            });
        }

        if (isOffering)
            return CounselFlowHubMailCode.ChannelState.OFFERING;

        if (channel.channelInfo.state === CounselFlowHubMailCode.ChannelState.OFFERING)
            return CounselFlowHubMailCode.ChannelState.READY;
        else
            return channel.channelInfo.state;
    }

    static parseMailInfoToEcmEntity(ctiLoginId, mailInfo, isReply) {
        let ecmEntity = {
            content_title: mailInfo.subject,
            agent: ctiLoginId,
            content_body: mailInfo.content,
            sender: mailInfo.sender,
            time_start: mailInfo.dateTime,
            // time_send: Moment().format("YYYYMMDDHHmmss"),
            time_send: null,
            receive_mail_id: null,
            cti_contact_id: null,
            mm_contact_id: null,
            receiver: null,
            receiver_cc: null,
            receiver_bcc: null,
            email_id: null,
            content_other: []
        };

        if (mailInfo.recipients) {
            let recipients = "";
            mailInfo.recipients.forEach((recipient) => {
                recipients += recipients !== "" ? `;${recipient}` : recipient;
            });
            ecmEntity.receiver = recipients;
        }
        if (mailInfo.ccRecipients) {
            let ccRecipients = "";
            mailInfo.ccRecipients.forEach((recipient) => {
                ccRecipients += ccRecipients !== "" ? `;${recipient}` : recipient;
            });
            ecmEntity.receiver_cc = ccRecipients;
        }
        if (mailInfo.bccRecipients) {
            let bccRecipients = "";
            mailInfo.bccRecipients.forEach((recipient) => {
                bccRecipients += bccRecipients !== "" ? `;${recipient}` : recipient;
            });
            ecmEntity.receiver_bcc = bccRecipients;
        }

        if (mailInfo.attachments && mailInfo.attachments.length > 0) {
            mailInfo.attachments.forEach((attachment) => {
                ecmEntity.content_other.push({
                    file_name: attachment.fileName,
                    type: attachment.type,
                    url: {
                        fileDomain: attachment.fileDomain,
                        filePath: attachment.filePath,
                        fileUrl: attachment.fileUrl
                    }
                });
            });
        }

        if (isReply) {
            ecmEntity.receive_mail_id = `EMAIL${mailInfo.connectionId}`;
            ecmEntity.cti_contact_id = `${mailInfo.ctiContactId}`;
            ecmEntity.mm_contact_id = `EMAIL${mailInfo.connectionId}`;
            ecmEntity.email_id = `${mailInfo.mailId}`;
            ecmEntity.reply_end = mailInfo.isMiddleReply ? 'OFF' : 'ON';
            ecmEntity.flag_forward = mailInfo.isForward ? 'ON' : 'OFF';
        }

        return ecmEntity;
    }

    static parseEcmFileEntityToMailAttachment(ecmFileEntity) {
        let mailAttachment = new CounselFlowHubMailAttachment();
        mailAttachment.type = ecmFileEntity.type;
        mailAttachment.fileName = ecmFileEntity.file_name;
        mailAttachment.fileUrl = ecmFileEntity.url.fileUrl;
        mailAttachment.fileDomain = ecmFileEntity.url.fileDomain;
        mailAttachment.filePath = ecmFileEntity.url.filePath;
        return mailAttachment;
    }

    static sendNewMail(ctiLoginId, mailInfo, options) {
        return new Promise((resolve, reject) => {
            const ecmEntity = CounselFlowHubMailChannelEmcEventHandler.parseMailInfoToEcmEntity(ctiLoginId, mailInfo, false);
            $.ajax({
                url: `${options.ecmProtocol}://${options.ecmServer}:${options.ecmPort}${options.pathPatterns.sendNewMail.path}`,
                contentType: options.pathPatterns.sendNewMail.contentType,
                type: options.pathPatterns.sendNewMail.method,
                data: JSON.stringify(ecmEntity),
                cache: false,
                processData: false,
                success: function (data) {
                    if (data.resCode === "0000") {
                        mailInfo.dateTime = data.resDttm;
                        mailInfo.mailId = data.email_id;
                        resolve(mailInfo);
                    } else {
                        resolve();
                    }
                },
                error: function (data) {
                    resolve();
                }
            });
        });
    }

    static parseMailInfoToFinishNewMailEntity(ctiLoginId, mailInfo) {
        const finishNewMailEntity = {
            agent: ctiLoginId,
            contact_type: 'EMAIL',
            email_id: mailInfo.mailId,
            time_close: null
            // time_close: Moment().format("YYYYMMDDHHmmss")
        };

        return finishNewMailEntity;
    }

    static finishNewMailProcess(ctiLoginId, mailInfo, options) {
        return new Promise(async (resolve, reject) => {
            const finishNewMailEntity = CounselFlowHubMailChannelEmcEventHandler.parseMailInfoToFinishNewMailEntity(ctiLoginId, mailInfo);
            $.ajax({
                url: `${options.ecmProtocol}://${options.ecmServer}:${options.ecmPort}${options.pathPatterns.newMailProcess.path}`,
                contentType: options.pathPatterns.newMailProcess.contentType,
                type: options.pathPatterns.newMailProcess.method,
                data: JSON.stringify(finishNewMailEntity),
                cache: false,
                processData: false,
                success: function (data) {
                    if (data.resCode === "0000") {
                        resolve(mailInfo);
                    } else {
                        resolve();
                    }
                },
                error: function (data) {
                    resolve();
                }
            });
        });
    }

    static sendReplyMail(ctiLoginId, mailInfo) {
        return new Promise(async (resolve, reject) => {
            const ecmEntity = CounselFlowHubMailChannelEmcEventHandler.parseMailInfoToEcmEntity(ctiLoginId, mailInfo, true);

            $.ajax({
                url: mailInfo.extraData.sendUrl,
                contentType: "application/json",
                type: "POST",
                data: JSON.stringify(ecmEntity),
                cache: false,
                processData: false,
                success: function (data) {
                    if (data.resCode === "0000") {
                        mailInfo.dateTime = data.resDttm;
                        resolve(mailInfo);
                    } else {
                        resolve();
                    }
                },
                error: function (data) {
                    resolve();
                }
            });
        });
    }

    static uploadFile(mailInfo, formData, options, ctiLoginId) {
        let requestUrl = `${options.ecmProtocol}://${options.ecmServer}:${options.ecmPort}${options.pathPatterns.uploadFile.path}/${ctiLoginId}`;
        const method = `${options.pathPatterns.uploadFile.method}`;
        if (mailInfo.extraData && mailInfo.extraData.uploadUrl)
            requestUrl = mailInfo.extraData.uploadUrl;

        return new Promise(async (resolve, reject) => {
            $.ajax({
                url: requestUrl,
                contentType: false,
                type: method,
                data: formData,
                cache: false,
                processData: false,
                success: function (response) {
                    if (response && response.length === 1) {
                        const mailAttachment = CounselFlowHubMailChannelEmcEventHandler.parseEcmFileEntityToMailAttachment(response[0]);
                        resolve(mailAttachment);
                    } else {
                        resolve();
                    }
                },
                error: function (response) {
                    resolve();
                }
            });
        });
    }

    static parseChannelState(state) {
        if (state === "LOGIN" || state === "NOTREADY")
            return CounselFlowHubMailCode.ChannelState.ABSENCE;
        else if (state === "READY")
            return CounselFlowHubMailCode.ChannelState.READY;
        else if (state === "LOGOUT")
            return CounselFlowHubMailCode.ChannelState.NOTLOGIN;
        else if (state === "ACW")
            return CounselFlowHubMailCode.ChannelState.PROCESS;

        return CounselFlowHubMailCode.ChannelState.NOTLOGIN;
    }
}
