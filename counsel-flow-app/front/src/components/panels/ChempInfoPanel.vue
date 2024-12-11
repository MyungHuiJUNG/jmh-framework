<script setup>
import ABtn from "components/common/ABtn.vue";
import ACallBtn from "../common/ACallBtn.vue";
</script>

<template>
  <div class="column fit">
    <div class="col-auto row fixed-height">
      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">상호(명칭)</div>
      <div class="col top-border-left justify-center column q-px-xs">
        <div class="row justify-between">
          <span></span>
          <a-btn label="업체조회" />
        </div>
      </div>
      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">사업자등록번호</div>
      <div class="col top-border-right justify-center column q-px-xs"></div>
    </div>
    <div class="col-auto row fixed-height">
      <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">성명(대표자)</div>
      <div class="col body-border-left justify-center column q-px-xs"></div>
      <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">담당자 연락처</div>
      <div class="col body-border-right justify-center column q-px-xs">
        <div class="row justify-between">
          <span></span>
          <a-call-btn />
        </div>
      </div>
    </div>
    <div class="col-auto row fixed-height">
      <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">담당자 성명</div>
      <div class="col body-border-left justify-center column q-px-xs"></div>
      <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">담당자 이메일</div>
      <div class="col body-border-right justify-center column q-px-xs"></div>
    </div>
    <div class="col-auto row fixed-height">
      <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">소재지(사업장) 주소</div>
      <div class="col body-border-left justify-center column q-px-xs"></div>
    </div>
    <div class="col-auto row fixed-height">
      <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">소재지 전화번호</div>
      <div class="col body-border-left justify-center column q-px-xs">
        <div class="row justify-between">
          <span></span>
          <a-call-btn />
        </div>
      </div>
      <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">소재지 팩스번호</div>
      <div class="col body-border-right justify-center column q-px-xs">
        <div class="row justify-between">
          <span></span>
          <a-call-btn />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.t-column {
  background-color: $grey-2;
  width: 140px;
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

.width-20 {
  width: 20%;
}

.width-25 {
  width: 25%;
}
</style>
