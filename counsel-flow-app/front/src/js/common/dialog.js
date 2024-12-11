import { Dialog } from "quasar";
import CommonPopup from "components/common/CommonPopup.vue";

function showAlert(message, showOk = true, showCancel = false) {
  return new Promise((resolve) => {
    Dialog.create({
      component: CommonPopup,
      componentProps: {
        msg: message,
        showOkButton: showOk,
        showCancelButton: showCancel,
      },
    })
      .onOk(() => {
        resolve();
      })
      .onCancel(() => {
        resolve();
      });
  });
}

function showConfirm(message, showOk = true, showCancel = true) {
  return new Promise((resolve, reject) => {
    Dialog.create({
      component: CommonPopup,
      componentProps: {
        msg: message,
        showOkButton: showOk,
        showCancelButton: showCancel,
      },
    })
      .onOk(() => {
        resolve(true);
      })
      .onCancel(() => {
        resolve(false);
      });
  });
}

export { showAlert, showConfirm };
