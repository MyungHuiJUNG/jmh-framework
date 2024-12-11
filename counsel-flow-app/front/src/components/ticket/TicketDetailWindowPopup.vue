<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import AInput from "components/common/AInput.vue";
import ATitleBar from "components/common/ATitleBar.vue";
import ATextarea from "components/common/ATextarea.vue";

/**
 * props로 grid에서 클릭한 데이터를 받아온다.
 * grid에 표시되지 않고있는 데이터도, 애초에 들어있는 정보라면 그대로 다 넘어온다.
 * 아래 빈 항목들은 해당하는 데이터를 표시하면 된다.
 * 수정하는 정보 : 처리상태, 상담구분, 상담유형, 상담내용, 재통화예약, 담당자
 * => 저장 시 변화된 정보 api 요청 보내서 update 해야함
 */
const $q = useQuasar();
const title = "티켓 상세";
const ticket = ref({
  typeCode: null,
  entityId: null,
  statusCode: null,
  inChannel: null,
  outChannel: null,
  counselCategoryCode: null,
  inboundPath: null,
  counselTypeCodeLarge: null,
  counselTypeCodeMedium: null,
  counselTypeCodeSmall: null,
  contents: null,
  reservationDate: null,
  reservationTime: null,
  createdByUserName: null,
  managerUserName: null,
  createdDate: null,
  lastModifiedDate: null,
  customerName: null,
  tel: null,
  productType: null,
  inquiry: null,
  // companyName: null,
});

onMounted(() => {
  ticket.value = window.opener.getTicketData();
});
</script>

<template>
  <div class="detail fit column">
    <a-title-bar :title="title" class="col-auto full-width" />

    <div class="col q-pa-xs b-border column table-container full-width">
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs full-height">
          티켓유형
        </div>
        <div class="col top-border-right justify-center column q-px-xs full-height">
          {{ ticket.typeCode }}
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          티켓번호
        </div>
        <div class="col body-border-right justify-center column q-px-xs full-height">{{ ticket.entityId }}</div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          처리상태
        </div>
        <div class="col body-border-right justify-center column q-px-xs full-height">
          {{ ticket.statusCode }}
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">IN채널</div>
        <div class="col body-border-right justify-center column q-px-xs full-height">{{ ticket.inChannel }}</div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          OUT채널
        </div>
        <div class="col body-border-right justify-center column q-px-xs full-height">{{ ticket.outChannel }}</div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          제품분류
        </div>
        <div class="col body-border-right justify-center column q-px-xs full-height">{{ ticket.productType }}</div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          상담구분
        </div>
        <div class="col body-border-right justify-center column q-px-xs full-height">
          {{ ticket.counselCategoryCode }}
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          인입경로
        </div>
        <div class="col body-border-right justify-center column q-px-xs full-height">
          {{ ticket.inboundPath }}
        </div>
      </div>
      <div class="col-auto row full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          상담유형
        </div>
        <div class="col body-border-right justify-center column q-pa-xs full-height">
          <span>{{ ticket.counselTypeCodeLarge }}</span>
          <span>{{ ticket.counselTypeCodeMedium }}</span>
          <span>{{ ticket.counselTypeCodeSmall }}</span>
        </div>
      </div>
      <div class="col-1 row full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">문의</div>
        <div class="col body-border-right justify-center column q-pa-xs full-height">
          <a-textarea height="100%" v-model="ticket.inquiry" :readonly="true" class="col" />
        </div>
      </div>
      <div class="col row full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          상담내용
        </div>
        <div class="col body-border-right justify-center column q-pa-xs full-height">
          <a-textarea height="100%" v-model="ticket.contents" :readonly="true" class="col" />
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          재통화예약
        </div>
        <div class="col body-border-right justify-center column q-px-xs full-height">
          <div class="row no-wrap">
            <a-input type="date" class="col" v-model="ticket.reservationDate" :readonly="true" />
            <a-input type="time" class="col" v-model="ticket.reservationTime" :readonly="true" />
          </div>
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">보고자</div>
        <div class="col body-border-right justify-center column q-px-xs full-height">
          {{ ticket.createdByUserName }}
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">담당자</div>
        <div class="col body-border-right justify-center column q-px-xs full-height">
          {{ ticket.managerUserName }}
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          생성일시
        </div>
        <div class="col body-border-right justify-center column q-px-xs full-height">
          {{ ticket.createdDate }}
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          변경일시
        </div>
        <div class="col body-border-right justify-center column q-px-xs full-height">
          {{ ticket.lastModifiedDate }}
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">고객명</div>
        <div class="col body-border-right justify-center column q-px-xs full-height">
          {{ ticket.customerName }}
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          전화번호
        </div>
        <div class="col body-border-right justify-center column q-px-xs full-height">
          {{ ticket.tel }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.detail {
  width: 400px;
}

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

.b-border {
  border-right: 1px solid $grey-5;
  border-left: 1px solid $grey-5;
  border-bottom: 1px solid $grey-5;
}
</style>
