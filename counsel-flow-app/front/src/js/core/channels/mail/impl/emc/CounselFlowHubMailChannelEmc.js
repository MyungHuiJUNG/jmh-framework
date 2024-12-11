import CounselFlowHubMailChannel from "../../CounselFlowHubMailChannel";
import EtsClientWrapper from "../../../../utils/EtsClientWrapper";
import CounselFlowHubMailChannelEmcEventHandler from "./CounselFlowHubMailChannelEmcEventHandler"
import CounselFlowHubMailChannelConsole from "../../CounselFlowHubMailChannelConsole";
import CounselFlowHubChannelEvent from "../../../../domain/CounselFlowHubChannelEvent";

export default class CounselFlowHubMailChannelEmc extends CounselFlowHubMailChannel {

    constructor(channelType) {
        super(channelType);
        this.emcEventHandler = new CounselFlowHubMailChannelEmcEventHandler(this);
        EtsClientWrapper.getInstance().addEmcHandler(this.emcEventHandler);
    }

    connect() {
        CounselFlowHubMailChannelConsole.log("[counsel-flow-hub/mail/emc] connect, options : ", this.options);
        if (!this.options)
            throw new Error("[counsel-flow-hub/mail/emc] you must set options");

        EtsClientWrapper.getInstance().getEtsClient().setServerInfo(this.options.activeServer, this.options.activePort, this.options.standbyServer, this.options.standbyPort, this.options.enableSsl);
        EtsClientWrapper.getInstance().connect();
        return this.emcEventHandler.newPromise("server");
    }

    disconnect() {
        CounselFlowHubMailChannelConsole.log("[counsel-flow-hub/mail/emc] disconnect");
        EtsClientWrapper.getInstance().disconnect();
        return this.emcEventHandler.newPromise("server");
    }

    login(channelInfo) {
        CounselFlowHubMailChannelConsole.log("[counsel-flow-hub/mail/emc] login : channelInfo=>", channelInfo);
        if (!channelInfo || !this.options)
            throw new Error("[counsel-flow-hub/chat/ets] invalid channelInfo or options");

        this.channelInfo.id = channelInfo.id;
        EtsClientWrapper.getInstance().getEtsClient().EMC_login(channelInfo.id);
        return this.emcEventHandler.newPromise()
            .then(data => {
                this.channelInfo.state = CounselFlowHubMailChannelEmcEventHandler.parseChannelState(data.state);
                this.occurEvent(new CounselFlowHubChannelEvent(this.channelType, this.channelInfo, new Date()));
            });
    }

    logout(reasonCode) {
        CounselFlowHubMailChannelConsole.log("[counsel-flow-hub/mail/emc] logout : reasonCode=>", reasonCode);
        EtsClientWrapper.getInstance().getEtsClient().EMC_logout();
        return this.emcEventHandler.newPromise()
            .then(data => {
                this.channelInfo.state = CounselFlowHubMailCode.ChannelState.NOTLOGIN;
                this.occurEvent(new CounselFlowHubChannelEvent(this.channelType, this.channelInfo, new Date()));
            });
    }

    ready() {
        let maxCount = 3;
        if (this.options && this.options.mailMaxCount) maxCount = this.options.mailMaxCount;

        CounselFlowHubMailChannelConsole.log("[counsel-flow-hub/mail/emc] ready", maxCount);
        EtsClientWrapper.getInstance().getEtsClient().EMC_ready("EMAIL", maxCount);
        return this.emcEventHandler.newPromise()
            .then(() => {
                this.channelInfo.state = CounselFlowHubMailCode.ChannelState.READY;
                this.occurEvent(new CounselFlowHubChannelEvent(this.channelType, this.channelInfo, new Date()));
            });
    }

    absence(reasonCode) {
        CounselFlowHubMailChannelConsole.log("[counsel-flow-hub/mail/emc] absense : reasonCode=>", reasonCode);
        EtsClientWrapper.getInstance().getEtsClient().EMC_notReady("EMAIL", reasonCode);
        return this.emcEventHandler.newPromise()
            .then(() => {
                this.channelInfo.state = CounselFlowHubMailCode.ChannelState.ABSENCE;
                this.occurEvent(new CounselFlowHubChannelEvent(this.channelType, this.channelInfo, new Date()));
            });
    }

    acceptMail(mailInfo) {
        CounselFlowHubMailChannelConsole.log("[counsel-flow-hub/mail/emc] acceptMail : mailInfo.ctiContactId=>", mailInfo.ctiContactId);
        EtsClientWrapper.getInstance().getEtsClient().EMC_accept(`${mailInfo.ctiContactId}`, "EMAIL");
        return this.emcEventHandler.newPromise()
            .then(() => {
                this.occurEvent(new CounselFlowHubChannelEvent(this.channelType, this.channelInfo, new Date()));
            });
    }

    rejectMail(mailInfo) {
        CounselFlowHubMailChannelConsole.log("[counsel-flow-hub/mail/emc] rejectMail : mailInfo.ctiContactId=>", mailInfo.ctiContactId);
        EtsClientWrapper.getInstance().getEtsClient().EMC_release(`${mailInfo.ctiContactId}`);
        return this.emcEventHandler.newPromise()
            .then(() => {
                this.occurEvent(new CounselFlowHubChannelEvent(this.channelType, this.channelInfo, new Date()));
            });
    }

    transfer(mailInfo, options) {
        CounselFlowHubMailChannelConsole.log("[counsel-flow-hub/mail/emc] transfer : mailInfo =>", mailInfo);
        CounselFlowHubMailChannelConsole.log("[counsel-flow-hub/mail/emc] transfer : options =>", options);
        if (!options)
            throw new Error("[counsel-flow-hub/mail/emc] transfer : invalid options");

        if (options.type === "AGENT") {
            EtsClientWrapper.getInstance().getEtsClient().EMC_transferToAgent(options.targetAgentId, mailInfo.ctiContactId, JSON.stringify(options));
        } else if (options.type === "SKILL") {
            EtsClientWrapper.getInstance().getEtsClient().EMC_transfer(options.targetSkill, mailInfo.ctiContactId, JSON.stringify(options));
        }

        return this.emcEventHandler.newPromise();
    }

    transferComplete(mailInfo) {
        CounselFlowHubMailChannelConsole.log("[counsel-flow-hub/mail/emc] transferComplete : ctiContactId=>", mailInfo.ctiContactId);
        EtsClientWrapper.getInstance().getEtsClient().EMC_transferComplete(mailInfo.ctiContactId);
        return this.emcEventHandler.newPromise();
    }

    cancelTransfer(mailInfo) {
        CounselFlowHubMailChannelConsole.log("[counsel-flow-hub/mail/emc] cancelTransfer : ctiContactId=>", mailInfo.ctiContactId);
        EtsClientWrapper.getInstance().getEtsClient().EMC_transferCancel(mailInfo.ctiContactId);
        return this.emcEventHandler.newPromise();
    }

    async sendNewMail(mailInfo) {
        CounselFlowHubMailChannelConsole.log("[counsel-flow-hub/mail/emc] acceptMail : mailInfo=>", mailInfo);
        mailInfo = await CounselFlowHubMailChannelEmcEventHandler.sendNewMail(this.channelInfo.id, mailInfo, this.options);
        return new Promise((resolve, reject) => {
            resolve(mailInfo);
        });
    }

    async finishNewMailProcess(mailInfo) {
        CounselFlowHubMailChannelConsole.log("[counsel-flow-hub/mail/emc] finishNewMailProcess : mailInfo=>", mailInfo);
        mailInfo = await CounselFlowHubMailChannelEmcEventHandler.finishNewMailProcess(this.channelInfo.id, mailInfo, this.options);
        return new Promise((resolve, reject) => {
            resolve(mailInfo);
        });
    }

    async replyMail(mailInfo) {
        CounselFlowHubMailChannelConsole.log("[counsel-flow-hub/mail/emc] replyMail");
        mailInfo = await CounselFlowHubMailChannelEmcEventHandler.sendReplyMail(this.channelInfo.id, mailInfo);
        return new Promise((resolve, reject) => {
            resolve(mailInfo);
        });
    }

    uploadFiles(mailInfo, files) {
        let attachments = [];
        files.forEach((file) => {
            let formData = new FormData();
            formData.append("file", file);
            attachments.push(new Promise(async (resolve, reject) => {
                CounselFlowHubMailChannelEmcEventHandler.uploadFile(mailInfo, formData, this.options, this.channelInfo.id)
                    .then(result => {
                        resolve(result);
                    });
            }));
        });

        return Promise.all(attachments);
    }
}
