<script setup>
import { ref } from "vue";
import UserManageUserInfo from "components/users/UserManageUserInfo.vue";
import UserManagePasswordInfo from "components/users/UserManagePasswordInfo.vue";
import UserManageDetailInfo from "components/users/UserManageDetailInfo.vue";
import UserManageSearch from "components/users/UserManageSearch.vue";
import userApi from "src/js/api/userApi";
import { handleApiError } from "src/js/common/errorHandler";

const userData = ref({});

const showUserDetail = ref(false);

const usersInfo = ref(null);
const lastSelectedUserId = ref(null);

function handleActionCompleted() {
  usersInfo.value.loadInitialData();
  usersInfo.value.setData();
}

function search(searchConditions) {
  usersInfo.value.searchUsers(searchConditions);
}

function handleClick(userId) {
  if (lastSelectedUserId.value === userId) {
    showUserDetail.value = false;
    lastSelectedUserId.value = null;
  } else {
    userApi
      .getUser(userId)
      .then((response) => {
        if (response.status === 200) {
          userData.value = response.data;
          lastSelectedUserId.value = userId;
        }
      })
      .catch((error) => {
        handleApiError(error);
      });

    showUserDetail.value = true;
  }
}

function handleNewClick() {
  showUserDetail.value = true;
  userData.value = ref({});
}
</script>

<template>
  <div class="column no-wrap fit a-border q-pa-xs" style="min-height: 730px">
    <div class="col-auto q-mb-xs full-width">
      <UserManageSearch @search="search" />
    </div>
    <div class="row col no-wrap full-width">
      <div class="col column no-wrap full-height">
        <div class="col full-width a-border q-pa-xs">
          <UserManageUserInfo @rowClick="handleClick" @newClick="handleNewClick" ref="usersInfo" />
        </div>
        <div class="col-auto q-mt-xs a-border q-pa-xs" style="height: 220px">
          <UserManagePasswordInfo />
        </div>
      </div>
      <UserManageDetailInfo
        class="col-auto full-height"
        v-if="showUserDetail"
        :userData="userData"
        @close="showUserDetail = false"
        @fetchData="handleActionCompleted"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.b-border {
  border-right: 1px solid $grey-5;
  border-left: 1px solid $grey-5;
  border-bottom: 1px solid $grey-5;
}
</style>
