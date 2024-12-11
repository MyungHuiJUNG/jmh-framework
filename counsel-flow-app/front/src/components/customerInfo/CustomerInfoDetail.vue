<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { showAlert, showConfirm } from "src/js/common/dialog";
import { useCodeStore } from "src/stores/codeStore";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import ABtn from "components/common/ABtn.vue";
import ASelect from "components/common/ASelect.vue";
import AInput from "components/common/AInput.vue";
import ATitleBar from "components/common/ATitleBar.vue";
import ATextarea from "components/common/ATextarea.vue";
import customerInfoApi from "src/js/api/customerInfoApi";
import { handleApiError } from "src/js/common/errorHandler";
import FlowSystemCode from "src/js/common/FlowSystemCode";
import FlowRoleCode from "src/js/common/FlowRoleCode";

const CUSTOMER_TYPE = FlowSystemCode.CODES.CUSTOMER_TYPE;

const codeStore = useCodeStore();
const permissionRoleStore = usePermissionRoleStore();

const props = defineProps(["customerInfoEntityId"]);
const emit = defineEmits(["close", "saveCustomerInfo"]);
defineExpose({ getCustomerInfo });

const canSaveCustomerInfo = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.CUSTOMER_INFO_ROLE.SAVE));
const canAddCustomerInfo = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.CUSTOMER_INFO_ROLE.ADD));
const canDeleteCustomerInfo = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.CUSTOMER_INFO_ROLE.DELETE));

const title = "업체 상세정보";

const customerInfo = ref([]);

const name = ref(); // 회사명
const representativeNumber = ref();
const secondaryNumber = ref();
const thirdNumber = ref();
const managerName = ref(); // 담당자이름
const customerTypeCode = ref({ name: "선택", value: null }); // 고객유형
const note = ref(""); // 비고
const createdDate = ref();
const lastModifiedDate = ref();
const createdByUserName = ref();
const lastModifiedByUserName = ref();

const customerTypeOptions = ref([]);

function saveCustomerInfo() {
  if (!name.value || !name.value.trim()) {
    showAlert("회사명을 입력해주세요.");
    return;
  }

  if (!representativeNumber.value || !representativeNumber.value.trim()) {
    showAlert("대표번호를 입력해주세요.");
    return;
  }

  if (!customerTypeCode.value || customerTypeCode.value.value === null) {
    showAlert("고객유형을 선택해주세요.");
    return;
  }

  const cleanRepresentativeNumber = representativeNumber.value.replace(/-/g, "");
  const cleanSecondaryNumber = secondaryNumber.value?.replace(/-/g, "") || "";
  const cleanThirdNumber = thirdNumber.value?.replace(/-/g, "") || "";

  const customerInfoEntity = {
    name: name.value, // 고객명
    representativeNumber: cleanRepresentativeNumber,
    secondaryNumber: cleanSecondaryNumber, // 전화번호
    thirdNumber: cleanThirdNumber, // 전화번호
    managerName: managerName.value,
    customerTypeCode: customerTypeCode.value.code,
    note: note.value, // 비고
  };

  const requestData = {
    entity: customerInfoEntity,
  };

  const apiCall = props.customerInfoEntityId
    ? customerInfoApi.updateCustomerInfo(props.customerInfoEntityId, requestData)
    : customerInfoApi.saveCustomerInfo(requestData);

  apiCall
    .then((response) => {
      if (response.status === 200) {
        showAlert("저장이 완료되었습니다").then(() => {
          customerInfoApi
            .getCustomerInfo(props.customerInfoEntityId || response.data.entityId)
            .then((response) => {
              if (response.status === 200) {
                customerInfo.value = response.data;
              }
            })
            .catch((error) => {
              handleApiError(error);
            });

          emit("saveCustomerInfo");
        });
      }
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function getCustomerInfo() {
  customerInfoApi
    .getCustomerInfo(props.customerInfoEntityId)
    .then((response) => {
      if (response.status === 200) {
        customerInfo.value = response.data;
        setData();
      }
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function setData() {
  const customerTypeData = codeStore.codes.get(customerInfo.value.customerTypeCode);

  name.value = customerInfo.value.name;
  representativeNumber.value = customerInfo.value.representativeNumber;
  secondaryNumber.value = customerInfo.value.secondaryNumber;
  thirdNumber.value = customerInfo.value.thirdNumber;
  managerName.value = customerInfo.value.managerName;
  customerTypeCode.value = {
    name: customerTypeData.name ?? "",
    value: customerInfo.value.customerTypeCode,
  };
  note.value = customerInfo.value.note;
  createdDate.value = customerInfo.value.createdDate;
  lastModifiedDate.value = customerInfo.value.lastModifiedDate;
  createdByUserName.value = `${customerInfo.value.createdByUserName} [${customerInfo.value.createdByUserId}]`;
  lastModifiedByUserName.value = `${customerInfo.value.lastModifiedByUserName} [${customerInfo.value.lastModifiedByUserId}]`;
}

function deleteCustomerInfo() {
  if (!props.customerInfoEntityId) return;

  showConfirm("삭제하시겠습니까?").then((res) => {
    if (res) {
      customerInfoApi
        .deleteCustomerInfo(props.customerInfoEntityId)
        .then((response) => {
          if (response.status === 200) {
            emit("saveCustomerInfo");
            newData();
          }
        })
        .catch((error) => {
          handleApiError(error);
        });
    }
  });
}

function newData() {
  name.value = "";
  representativeNumber.value = "";
  secondaryNumber.value = "";
  thirdNumber.value = "";
  managerName.value = "";
  customerTypeCode.value = { name: "선택", value: null };
  note.value = "";
  createdDate.value = "";
  lastModifiedDate.value = "";
  createdByUserName.value = "";
  lastModifiedByUserName.value = "";

  customerInfo.value = {
    name: "",
    representativeNumber: "",
    secondaryNumber: "",
    thirdNumber: "",
    managerName: "",
    customerTypeCode: "",
    note: "",
    createdDate: "",
    lastModifiedDate: "",
    createdByUserName: "",
    lastModifiedByUserName: "",
  };

  emit("resetCustomerInfoEntityId");
}

watch(
  () => props.customerInfoEntityId,
  (newVal) => {
    if (newVal) {
      getCustomerInfo();
    }
  }
);

onMounted(() => {
  customerTypeOptions.value = [...codeStore.codes.get(CUSTOMER_TYPE)?.children];
});
</script>

<template>
  <div class="detail q-ml-xs column">
    <a-title-bar :title="title" class="col-auto full-width" />

    <div class="col q-pa-xs b-border column table-container full-width">
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
          <div class="row">
            <q-badge class="q-pa-none q-mr-xs" color="grey-2" text-color="red">*</q-badge>
            회사명
          </div>
        </div>
        <div class="col top-border-right justify-center column q-px-xs">
          <a-input v-model="name" maxlength="500" />
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">
          <div class="row">
            <q-badge class="q-pa-none q-mr-xs" color="grey-2" text-color="red">*</q-badge>
            대표번호
          </div>
        </div>
        <div class="col body-border-right justify-center column q-px-xs">
          <a-input v-model="representativeNumber" maxlength="50" />
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">전화번호1</div>
        <div class="col body-border-right justify-center column q-px-xs">
          <a-input v-model="secondaryNumber" maxlength="50" />
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">전화번호2</div>
        <div class="col body-border-right justify-center column q-px-xs">
          <a-input v-model="thirdNumber" maxlength="50" />
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">업체담당자</div>
        <div class="col body-border-right justify-center column q-px-xs">
          <a-input v-model="managerName" maxlength="500" />
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">
          <div class="row">
            <q-badge class="q-pa-none q-mr-xs" color="grey-2" text-color="red">*</q-badge>
            고객유형
          </div>
        </div>
        <div class="col body-border-right justify-center column q-px-xs">
          <a-select
            :options="customerTypeOptions"
            option-label="name"
            option-value="value"
            v-model="customerTypeCode"
          />
        </div>
      </div>
      <div class="col row full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">
          비고<br /><span>({{ note?.length || 0 }} / 500자)</span>
        </div>
        <div class="col body-border-right justify-center column q-pa-xs">
          <a-textarea height="100%" class="col" v-model="note" maxlength="500" />
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">등록일시</div>
        <div class="col body-border-right justify-center column q-px-xs">
          {{ createdDate }}
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">등록자명</div>
        <div class="col body-border-right justify-center column q-px-xs">
          {{ createdByUserName }}
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">변경일시</div>
        <div class="col body-border-right justify-center column q-px-xs">
          {{ lastModifiedDate }}
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">변경자명</div>
        <div class="col body-border-right justify-center column q-px-xs">
          {{ lastModifiedByUserName }}
        </div>
      </div>
      <div class="text-right q-mt-xs col-auto full-width bg-grey-5 q-pa-xs">
        <a-btn v-if="canAddCustomerInfo" label="신규" @click="newData" />
        <a-btn
          v-if="props.customerInfoEntityId && canDeleteCustomerInfo"
          label="삭제"
          @click="deleteCustomerInfo"
          class="q-ml-xs"
        />
        <a-btn
          v-if="
            (canSaveCustomerInfo && props.customerInfoEntityId) || (canAddCustomerInfo && !props.customerInfoEntityId)
          "
          label="저장"
          @click="saveCustomerInfo"
          class="q-ml-xs"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.body-border-left {
  border-left: 1px solid $grey-5;
  border-bottom: 1px solid $grey-5;
}

.body-border-right {
  border: 1px solid $grey-5;
  border-top: none;
}

.top-border-left {
  border: 1px solid $grey-5;
  border-right: none;
}

.top-border-right {
  border: 1px solid $grey-5;
}

.t-column {
  width: 90px;
  background-color: $grey-2;
}

.fixed-height {
  height: $line-height + 2;
}

.detail {
  width: 400px;
}

.b-border {
  border-right: 1px solid $grey-5;
  border-left: 1px solid $grey-5;
  border-bottom: 1px solid $grey-5;
}
</style>
