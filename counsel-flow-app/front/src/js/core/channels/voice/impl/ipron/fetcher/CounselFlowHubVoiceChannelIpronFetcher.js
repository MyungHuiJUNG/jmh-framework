import CounselFlowHubChannelFetcher from "../../../../../domain/CounselFlowHubChannelFetcher"
import CounselFlowHubVoiceChannelFetcherConsole from "../../../CounselFlowHubVoiceChannelFetcherConsole"

export default class CounselFlowHubVoiceChannelIpronFetcher extends CounselFlowHubChannelFetcher {

    constructor(channel) {
        super(channel);
    }

    getGroupList() {
        return this.channel.pushCommand((promiseObject) => {
            CounselFlowHubVoiceChannelFetcherConsole.log("[counsel-flow-hub/voice/ipron] get group list");

            ipron.GetGroupList(this.channel.options.tenant, 0);

            this.channel.applyEventHandlerPromise(promiseObject);
        });
    }

    getQueueList() {
        return this.channel.pushCommand((promiseObject) => {
            CounselFlowHubVoiceChannelFetcherConsole.log("[counsel-flow-hub/voice/ipron] get queue list");

            ipron.GetQueueList(this.channel.options.tenant, 0);

            this.channel.applyEventHandlerPromise(promiseObject);
        });
    }

    getAgentQueueList() {
        return this.channel.pushCommand((promiseObject) => {
            CounselFlowHubVoiceChannelFetcherConsole.log("[counsel-flow-hub/voice/ipron] get agent queue list");

            ipron.GetAgentQueueList(this.channel.options.tenant, this.channel.channelInfo.id);

            this.channel.applyEventHandlerPromise(promiseObject);
        });
    }

    getAgentList(groupId, queueDn) {
        return this.channel.pushCommand((promiseObject) => {
            CounselFlowHubVoiceChannelFetcherConsole.log("[counsel-flow-hub/voice/ipron] get agent list");

            if (groupId === undefined || groupId === null)
                throw new Error("[counsel-flow-hub/voice/ipron] group id is empty");

            if (queueDn === undefined || queueDn === null)
                queueDn = "";

            ipron.GetAgentList(this.channel.options.tenant, groupId, queueDn, 0, 0, 0);

            this.channel.applyEventHandlerPromise(promiseObject);
        });
    }

    reportTenant() {
        return this.channel.pushCommand((promiseObject) => {
            CounselFlowHubVoiceChannelFetcherConsole.log("[counsel-flow-hub/voice/ipron] report tenant");

            ipron.TenantReport(this.channel.options.tenant, 0);

            this.channel.applyEventHandlerPromise(promiseObject);
        });
    }

    reportAgent() {
        return this.channel.pushCommand((promiseObject) => {
            CounselFlowHubVoiceChannelFetcherConsole.log("[counsel-flow-hub/voice/ipron] report agent");

            ipron.AgentReport(this.channel.channelInfo.id, this.channel.options.tenant, 0);

            this.channel.applyEventHandlerPromise(promiseObject);
        });
    }

    reportGroup(groupIdList) {
        return this.channel.pushCommand((promiseObject) => {
            CounselFlowHubVoiceChannelFetcherConsole.log("[counsel-flow-hub/voice/ipron] report group=>", groupIdList);

            if (groupIdList === undefined || groupIdList === null || groupIdList.length === 0)
                throw new Error("[counsel-flow-hub/voice/ipron] group id list is empty");

            let param = "";
            groupIdList.forEach(function(groupId, index) {
                param += groupId;
                if (index < groupIdList.length - 1)
                    param += "-";
            });

            ipron.GroupReport(this.channel.options.tenant, param, 0);

            this.channel.applyEventHandlerPromise(promiseObject);
        });
    }

    reportQueue(queueDnList) {
        return this.channel.pushCommand((promiseObject) => {
            CounselFlowHubVoiceChannelFetcherConsole.log("[counsel-flow-hub/voice/ipron] report queue=>", queueDnList);

            if (queueDnList === undefined || queueDnList === null || queueDnList.length === 0)
                throw new Error("[counsel-flow-hub/voice/ipron] queue dn list is empty");

            let param = "";
            queueDnList.forEach(function(queueDn, index) {
                param += queueDn;
                if (index < queueDnList.length - 1)
                    param += "-";
            });

            ipron.QueueReport(this.channel.options.tenant, param, 0);

            this.channel.applyEventHandlerPromise(promiseObject);
        });
    }

    reportQueueSubscribe(tenantName, queueDnSet) {
        return this.channel.pushCommand((promiseObject) => {
            CounselFlowHubVoiceChannelFetcherConsole.log("[counsel-flow-hub/voice/ipron] report queue subscribe start");
            ipron.QueueRptSubscribe(tenantName, queueDnSet, null, 1, 0);
            this.channel.applyEventHandlerPromise(promiseObject);
        });
    }
}
