import {Dialog, Loading, Notify, QSpinnerGears} from "quasar";
import AppPopupBase from "components/common/base/AppPopupBase.vue";
import AppUtil from "components/common/js/app-util";

export default function AppPopup() {
}

AppPopup.showAlert = function(title, msg, options) {
  Dialog.create({
    title: title,
    message: msg,
    ok: "확인"
  })
};

AppPopup.showConfirm = function(title, msg) {
  const popupConfirm = {
    yesFunc: null,
    noFunc: null,
  };

  Dialog.create({
    title: title,
    message: msg,
    cancel: "취소",
    ok: "확인"
    // persistent: true
  }).onOk(() => {
    popupConfirm.yesFunc();
  }).onCancel(() => {
    popupConfirm.noFunc();
  })

  return {
    yes: function (fun) {
      popupConfirm.yesFunc = fun;
      return this;
    },
    no: function (fun) {
      popupConfirm.noFunc = fun;
      return this;
    },
  };
};

AppPopup.showBlock = function(message, spinner) {
  Loading.show({
    spinner: spinner ? QSpinnerGears : null,
    message: message !== null ? message : null
  })
};

AppPopup.hideBlock = function() {
  Loading.hide();
};

AppPopup.openWindow = function(options) {
  const width = options.width;
  const height = options.height;
  const target = `/view/winpopup?comp=${options.component.__name}`;

  const popup = window.open(
    target,
    "_blank",
    `width=${width},height=${height}`
  );
  localStorage.setItem("flow-winpopup-props", JSON.stringify(options.props));

  popup.focus();
};

AppPopup.showNotify = function (msg, options) {
  let color = AppUtil.isEmpty(options.color)? "white" : options.color;
  let textColor = AppUtil.isEmpty(options.textColor)? "black" : options.textColor;
  Notify.create({
    message: msg,
    color: color,
    textColor: textColor,
    position: 'center',
    timeout: 0,
    actions: [{ icon: 'close', 'aria-label': 'Dismiss' }]
  })
}

AppPopup.openLayered = function(options) {
   Dialog.create({
     component: AppPopupBase,
     componentProps: {
       title: options.title,
       width: options.width,
       height: options.height,
       component: options.component,
       propData: options.propData,
       position: options.position,
       top: options.top, 
       left: options.left,
    }
  }).onOk((result) => {
    options.callbackFunc(result);
  }).onCancel(() => {
  });
};

