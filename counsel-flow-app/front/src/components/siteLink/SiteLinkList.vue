<script setup>
defineProps(["links"]);
const model = defineModel();

function handleLinkClick(url) {
  model.value = false;
  window.open(url, "_blank", "noopener noreferrer");
}
</script>

<template>
  <q-menu anchor="bottom middle" self="top middle" v-model="model" no-parent-event @hide="model = false">
    <div class="menu-size a-border q-pa-sm column no-wrap">
      <!-- links가 없는 경우 -->
      <div v-if="links.length === 0" class="no-link-message col fit row flex-center text-center">
        <span>등록된 링크가 없습니다. <br />사이트링크 메뉴에서 등록하시기 바랍니다.</span>
      </div>

      <!-- links가 있는 경우 -->
      <div
        v-else
        v-for="link in links"
        :key="link.id"
        class="col-auto row full-width fixed-height container align-center"
      >
        <img v-if="link.iconUrl" :src="link.iconUrl" alt="icon" class="icon-image col-auto" />
        <img v-else src="~src/assets/globe.svg" alt="기본 아이콘" class="icon-image col-auto" />
        <span class="col-auto name-span q-ml-sm">
          {{ link.name || "이름 없음" }}
        </span>
        <div class="col link-div">
          <a
            v-if="link.linkUrl"
            :href="link.linkUrl"
            target="_blank"
            rel="noopener noreferrer"
            @click.prevent="handleLinkClick(link.linkUrl)"
          >
            {{ link.linkUrl }}
          </a>
        </div>
      </div>
    </div>
  </q-menu>
</template>

<style lang="scss" scoped>
.menu-size {
  height: 250px;
  width: 500px;
  overflow: auto;
}

.container {
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 0;
}

.icon-image {
  width: 30px;
  height: 30px;
}

.name-span {
  width: 150px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: bold;
  color: #424242;
}

.link-div {
  width: 250px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.link-div a {
  color: #1e88e5;
  text-decoration: none;
}

.link-div a:hover {
  text-decoration: underline;
}

.fixed-height {
  height: 60px;
}

.align-center {
  align-items: center;
}

/* 링크가 없을 때의 메시지 스타일 */
.no-link-message {
  text-align: center;
  font-size: 16px;
  color: #9e9e9e;
  font-style: italic;
  padding: 20px 0;
}
</style>
