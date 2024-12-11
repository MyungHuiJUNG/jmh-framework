<script setup>
import { ref, watch, watchEffect } from "vue";
import { ElementTiptap } from "element-tiptap-vue3-fixed";
import {
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  TextAlign,
  Italic,
  Link,
  BulletList,
  Strike,
  Table,
  History,
  FontFamily,
  Image,
  OrderedList,
  Color,
  FontSize,
  Gapcursor,
  HorizontalRule,
  Dropcursor,
} from "element-tiptap-vue3-fixed";

// ElementTipTap은 설명은 v-model처럼 되어있으나
// 한번 그려진 후 content값이 변화해도 editor에 반영되지 않음
// 실제로 editor에 content 값이 외부에서 들어와 변화된 것을 반영하려면 setContent()를 사용해야함
// 그런데 이 컴포넌트를 v-model로 양방향 바인딩할 경우 내부 내용이 변화할 때마다 setContent()가 실행되어서
// 새로 내용이 렌더링 되면서 포커싱이 내용 가장 밑쪽으로 계속 이동하는 문제가 있음.
// 그래서 사용할 때 들어오는 내용과 입력해서 저장,수정할 내용의 필드를 구분해야해서
// props, emit으로 값을 구분해서 사용
// 따라서 사용하는 쪽에서도 필드를 2개를 가지고 contentInput과 contentOutput을 구분하고 있어야 함

const props = defineProps({
  contentInput: {
    type: String,
  },
  useToolbar: {
    type: Boolean,
    default: true,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
}); // 새로 들어오는 값
const emit = defineEmits(["contentOutput"]); // 수정된 값 반영
defineExpose({ clearContent }); // content값 비우기

const content = ref(props.contentInput); // 초기 받은 값

const editorRef = ref(null);
const extensions = [
  Doc,
  Paragraph,
  Text,
  History,
  FontFamily,
  FontSize,
  Heading.configure({ level: 5 }),
  Bold,
  OrderedList,
  BulletList,
  Underline,
  TextAlign,
  Italic,
  Strike,
  Link,
  Dropcursor,
  HorizontalRule,
  Table.configure({
    resizable: true,
    allowTableNodeSelection: true,
  }),
  Image.configure({
    defaultWidth: null,
    draggable: true,
  }),
  Color.configure({
    colors: [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4caf50",
      "#8bc34a",
      "#cddc39",
      "#ffeb3b",
      "#ffc107",
      "#ff9800",
      "#ff5722",
      "#000000",
    ],
  }),
  Gapcursor, // 테이블 아래 빈 공간에 커서를 찍으면 커서가 찍히도록 하는 설정
];

watch(
  () => props.contentInput,
  (newVal) => {
    content.value = newVal;
  }
);

watch(content, (newVal) => {
  editorRef.value.setContent(newVal); // 새로 들어온 값 editor에 반영
});

function handleUpdate(updatedContent) {
  emit("contentOutput", updatedContent);
}

function clearContent() {
  content.value = null;
  editorRef.value.setContent(null);
  emit("contentOutput", null);
}
</script>

<template>
  <ElementTiptap
    :content="content"
    :extensions="extensions"
    lang="ko"
    :enable-char-count="false"
    width="100%"
    height="100%"
    spellcheck
    ref="editorRef"
    @onUpdate="handleUpdate"
    :readonly="readOnly"
    :class="{ 'readonly-toolbar': readOnly }"
  />
</template>

<style>
@import "element-tiptap-vue3-fixed/lib/style.css";

.el-popper {
  z-index: 9999 !important;
}
.el-overlay {
  z-index: 9999 !important;
}

.readonly-toolbar .el-tiptap-editor__menu-bar {
  display: none;
}

.readonly-toolbar .el-tiptap-editor__content {
  border: 1px solid #ebeef5 !important;
  border-top-right-radius: 8px !important;
  border-top-left-radius: 8px !important;
}
</style>
