<script setup>
defineProps(["accountDetails"]);
</script>

<template>
  <div>
    <table class="a-table full-width">
      <colgroup>
        <col class="t-column" />
        <col />
        <col class="t-column" />
        <col />
        <col class="t-column" />
        <col />
        <col class="t-column" />
        <col />
      </colgroup>
      <tr>
        <td class="text-center">개별계좌개설일</td>
        <td>{{ $props.accountDetails.openingDate }}</td>
        <td class="text-center">카드발급상태</td>
        <td>{{ $props.accountDetails.cardIssuanceStatus }}</td>
        <td class="text-center">계좌활동유형</td>
        <td>{{ $props.accountDetails.accountType }}</td>
        <td class="text-center">계좌관리점</td>
        <td>{{ $props.accountDetails.management }}</td>
      </tr>

      <tr>
        <td class="text-center">개별계좌폐쇄일</td>
        <td>{{ $props.accountDetails.closureDate }}</td>
        <td class="text-center">체크카드번호</td>
        <td>{{ $props.accountDetails.checkCardNo }}</td>
        <td class="text-center">계좌상품유형</td>
        <td>{{ $props.accountDetails.productType }}</td>
        <td class="text-center">사고여부</td>
        <td>{{ $props.accountDetails.accident }}</td>
      </tr>

      <tr>
        <td class="text-center">휴면/통폐합일</td>
        <td>{{ $props.accountDetails.consolidationDate }}</td>
        <td class="text-center">원화연계번호</td>
        <td>{{ $props.accountDetails.wonNo }}</td>
        <td class="text-center">비대면계좌여부</td>
        <td>{{ $props.accountDetails.nonF2FAccount }}</td>
        <td class="text-center">신용등급</td>
        <td>{{ $props.accountDetails.creditRate }}</td>
      </tr>

      <tr>
        <td class="text-center">최종거래일</td>
        <td>{{ $props.accountDetails.latestDate }}</td>
        <td class="text-center">외화연계번호</td>
        <td>{{ $props.accountDetails.foreignNo }}</td>
        <td class="text-center">은행연계구분</td>
        <td>{{ $props.accountDetails.bankLinked }}</td>
        <td class="text-center">보안카드/OTP</td>
        <td>{{ $props.accountDetails.otp }}</td>
      </tr>

      <tr>
        <td class="text-center">고객확인재수행기간</td>
        <td>{{ $props.accountDetails.verificationDate }}</td>
        <td class="text-center">주문대리인지정</td>
        <td>{{ $props.accountDetails.orderingAgent }}</td>
        <td class="text-center">제휴대출구분</td>
        <td>{{ $props.accountDetails.loan }}</td>
        <td class="text-center">고객등급</td>
        <td>{{ $props.accountDetails.level }}</td>
      </tr>

      <tr>
        <td class="text-center">법인구분</td>
        <td>{{ $props.accountDetails.corporation }}</td>
        <td class="text-center">직장명</td>
        <td>{{ $props.accountDetails.company }}</td>
        <td class="text-center"></td>
        <td></td>
        <td class="text-center"></td>
        <td></td>
      </tr>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.a-table {
  min-width: max-content;
  min-height: max-content;
}

.a-table td {
  padding: 1px map-get($space-xs, x);
  vertical-align: middle;
}

.a-table,
.a-table tr,
.a-table td {
  border: 1px solid $grey-5;
  border-collapse: collapse;
}

.a-table tr,
.a-table td {
  height: $line-height + 2;
}

.t-column {
  background-color: $grey-2;
}
</style>
