<script setup>
import { ref, onMounted } from "vue";
import ATitleBar from "components/common/ATitleBar.vue";
import ticketHistoryApi from "src/js/api/ticketHistoryApi";
import { useCodeStore } from "src/stores/codeStore";
import { useCounselTypeStore } from "src/stores/counselTypeStore";
import { handleApiError } from "src/js/common/errorHandler";

const props = defineProps(["ticketEntityId"]);

const codeStore = useCodeStore();
const counselTypeStore = useCounselTypeStore();

const title = "작업이력";
const history = ref([]);
const entityNames = {
  TYPE: "티켓유형",
  STATUS: "처리상태",
  PRODUCT_TYPE: "제품분류",
  COUNSEL_CATEGORY_CODE: "상담구분",
  COUNSEL_TYPE_CODE_LARGE: "상담유형(대)",
  COUNSEL_TYPE_CODE_MEDIUM: "상담유형(중)",
  COUNSEL_TYPE_CODE_SMALL: "상담유형(소)",
  INQUIRY: "문의",
  CONTENTS: "상담내용",
  CALLBACK_RESERVATION_DATE: "재통화예약",
  MANAGER_EID: "담당자",
  CUSTOMER_NAME: "고객명",
  TEL: "전화번호",
  // COMPANY_NAME: "회사명",
};

onMounted(() => {
  getTicketHistory();
});

function getTicketHistory() {
  const param = {};
  param["entity.ticketEntityId"] = props.ticketEntityId;
  ticketHistoryApi
    .getTicketHistory(param)
    .then((response) => {
      if (response.status === 200) {
        history.value = groupByDateAndModifier(response.data);
        console.log(history.value);
      }
    })
    .catch((error) => {
      handleApiError(error);
    });
}
function groupByDateAndModifier(historyData) {
  const groupedData = historyData.reduce((acc, item) => {
    const dateKey = item.createdDate;

    // createdDate 기준으로 먼저 그룹화
    if (!acc[dateKey]) {
      acc[dateKey] = {};
    }

    // lastModifiedBy 기준으로 다시 그룹화
    const modifierKey = item.lastModifiedBy;

    if (!acc[dateKey][modifierKey]) {
      acc[dateKey][modifierKey] = [];
    }

    acc[dateKey][modifierKey].push(item);
    return acc;
  }, {});

  // 객체를 최신순으로 정렬
  const sortedGroupedData = Object.entries(groupedData)
    .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA)) // createdDate 내림차순
    .reduce((sortedAcc, [dateKey, modifiers]) => {
      sortedAcc[dateKey] = Object.entries(modifiers)
        .sort(([modifierA], [modifierB]) => modifierB - modifierA) // lastModifiedBy 내림차순 정렬
        .reduce((modAcc, [modifierKey, items]) => {
          // entityNames에 정의된 순서대로 정렬
          const orderedItems = items.sort((a, b) => {
            const orderA = Object.keys(entityNames).indexOf(a.typeCode);
            const orderB = Object.keys(entityNames).indexOf(b.typeCode);
            return orderA - orderB;
          });
          modAcc[modifierKey] = orderedItems;
          return modAcc;
        }, {});

      return sortedAcc;
    }, {});

  return sortedGroupedData;
}

// details 텍스트 추출 함수
function getDetailsText(details) {
  const detailsObj = JSON.parse(details);
  return detailsObj.contents;
}

// 항목 이름을 반환하는 함수
function getEntityName(typeCode) {
  return entityNames[typeCode] || "기타";
}

function getCodeValueName(typeCode, codeValue) {
  if (typeCode === "TYPE" || typeCode === "STATUS" || typeCode === "COUNSEL_CATEGORY_CODE") {
    return codeStore.codes.get(codeValue)?.name || codeValue;
  } else if (
    typeCode === "COUNSEL_TYPE_CODE_LARGE" ||
    typeCode === "COUNSEL_TYPE_CODE_MEDIUM" ||
    typeCode === "COUNSEL_TYPE_CODE_SMALL"
  ) {
    return counselTypeStore.counselTypes.get(codeValue)?.name || codeValue;
  } else {
    return codeValue;
  }
}
</script>

<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss transition-show="fade" transition-hide="fade">
    <q-card class="dialog-large">
      <a-title-bar :title="title" :close="true" />
      <q-card-section class="q-pa-xs">
        <div class="fit total">
          <div v-if="Object.keys(history).length">
            <div v-for="(dateGroup, createdDate) in history" :key="createdDate" class="fit q-mt-xs">
              <div v-for="(modifications, modifier) in dateGroup" :key="modifier" class="fit">
                <span v-html="getDetailsText(modifications[0].details)"></span>
                <table class="a-table full-width">
                  <colgroup>
                    <col width="20%" />
                    <col width="40%" />
                    <col width="40%" />
                  </colgroup>
                  <thead>
                    <tr>
                      <td>항목명</td>
                      <td>원래 값</td>
                      <td>새 값</td>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- 각 변경된 항목을 반복해서 표시 -->
                    <tr v-for="item in modifications" :key="item.entityId">
                      <td>{{ getEntityName(item.typeCode) }}</td>
                      <td>{{ getCodeValueName(item.typeCode, item.previousData) || "-" }}</td>
                      <td>{{ getCodeValueName(item.typeCode, item.newData) || "-" }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div v-else>
            <span>작업 내역이 없습니다.</span>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.total {
  overflow: auto;
  max-height: 590px;
}

.dialog-large {
  min-width: 700px;
  min-height: 630px;
}
.a-table,
.a-table tr,
.a-table td {
  border: 1px solid $grey-5;
  border-collapse: collapse;
  background-color: $grey-2;
  text-align: center;
}

.a-table td {
  padding: 1px map-get($space-xs, x);
  vertical-align: middle;
}

.a-table tr,
.a-table td {
  height: $line-height + 2;
}
</style>
