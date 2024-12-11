import { boot } from "quasar/wrappers";
import "./counsel-flow-hub";
// import VoiceCommonCode from "boot/VoiceCommonCode";
import mitt from "mitt";
const emitter = mitt();
let counselHub, channel;

export default boot(({ app }) => {
  app.config.globalProperties.$emitter = emitter;

  counselHub = CounselFlowHubFactory.create([CounselFlowHubVoiceType.IPRON_V5]);
  channel = counselHub.getChannel(CounselFlowHubVoiceType.IPRON_V5);
  channel.id = CounselFlowHubVoiceType.IPRON_V5;

  app.config.globalProperties.$counselHub = counselHub;
  app.config.globalProperties.$channel = channel;
});

export { counselHub, channel };
