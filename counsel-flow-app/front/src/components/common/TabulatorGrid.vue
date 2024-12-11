<script setup>
import { ref, onMounted, watch } from "vue";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import * as luxon from "luxon";
import * as XLSX from "xlsx";

window.XLSX = XLSX;
window.luxon = luxon;

/****************************** [Props] ******************************
 * rows: Array - required
 *    - 표시할 row 데이터
 *    Examples) :rows="gridRows"
 *
 * columns: Array - required
 *    - column 정의 (객체 배열)
 *    Examples) :columns="gridColumns"
 *
 * height: String
 *    Examples) '300' '300px' '50em' ..
 *
 * minHeight: String
 *    Examples) '300' '300px' '50em' ..
 *
 * maxHeight: String
 *    Examples) '300' '300px' '50em' ..
 *
 * filters: Array
 *    - 검색 필터 정의 (객체 배열)
 *    - Props
 *      · field: 컬럼명
 *      · type: '=' '!=' 'like' '<=' '>=' '<' '>' 'in' ...
 *      · value: String, Integer, Array ...
 *    Examples) [{ field: "date", type: ">=", value: "2023-05-01" },
 *               { field: "date", type: "<=", value: "2024-05-01" },
 *               { field: "age", type:"<", value: 10 },
 *               { field: "name", type: "like", value: "Steve" }]
 *    참고) https://tabulator.info/docs/6.2/filter#search-data
 *
 * movableColumns: Boolean
 *    - column 좌우 이동
 *
 * movableRows: Boolean
 *    - row 상하 이동
 *
 * pagination: Boolean
 *    - pagination 사용 여부
 *
 * paginationSize: Number
 *    - pagination 사용할 경우, 한 페이지당 표시할 row 수
 *
 * footer: Boolean
 *    - pagination 사용하지 않으면서 table footer 표시하고 싶을 때 사용
 ***********************************************************************/

/****************************** [Events] ******************************
 * @rowClick : (e, row) => void
 *    - row 클릭했을 때 emit
 *    - Parameters
 *      · e   : Event   → JS event object
 *      · row : Object  → 클릭한 row
 *
 * @rowSelected : (selectedRows) => void
 *    - checkbox 선택/해제했을 때 emit
 *    - Parameters
 *      · selectedRows : Object[] → 체크박스가 선택된 모든 row의 배열
 *
 * @rowMoved : (e, row) => void
 *    - row 이동했을 때 emit
 *    - Parameters
 *      · e   : Event   → JS event object
 *      · row : Object  → 이동된 row
 *
 * @cellEdited : (cell) => void
 *    - cell 수정했을 때 emit
 *    - Parameters
 *      · cell : Object → 수정된 cell
 ***********************************************************************/

const props = defineProps({
  rows: { type: Array, required: true },
  columns: { type: Array, required: true },
  height: String, // string, px, %, ...
  minHeight: String,
  maxHeight: String,
  filters: Array,
  movableColumns: Boolean,
  movableRows: Boolean,
  placeholder: { type: String, default: "결과가 없습니다." },
  pagination: { type: Boolean, default: false },
  paginationSize: { type: Number, default: 100 },
  paginationButtonCount: { type: Number, default: 5 },
  ajaxUrl: { type: String },
  ajaxRequestFunc: { type: Function },
  footer: { type: Boolean, default: true },
  dataTree: { type: Boolean, default: false },
  dataTreeStartExpanded: { type: Boolean, default: false },
  dataTreeElementColumn: { type: String },
  selectableRows: { type: [Boolean, Number] },
  dataTreeChildField: { type: String, default: "children" },
  dataTreeSelectPropagate: { type: Boolean, default: false },
  headerVisible: { type: Boolean, default: true },
  dataTreeFilter: { type: Boolean, default: true },
  reactiveData: { type: Boolean, default: true },
  infiniteScroll: { type: Function },
  selectableRowsRangeMode: { type: [Boolean, String] },
  rowHeader: Object,
  rowContextMenu: { type: Array },
  placeholderColor: { type: String, default: "#ccc" },
  rowFormatter: {
    type: Function,
    default: function defaultRowFormatter(row) {
      const data = row.getData();
      if (data.isChanged) {
        row.getElement().style.backgroundColor = "#ffff99"; // Light yellow
      } else {
        row.getElement().style.backgroundColor = "";
      }
    },
  },
});

// Events
const emit = defineEmits([
  "rowClick",
  "rowSelected",
  "rowMoved",
  "cellEdited",
  "rowDeselected",
  "rowUpdated",
  "rowDblClick",
]);

const table = ref(null);
const tabulator = ref(null);

const totalRows = ref(props.rows.length);

const isLoading = ref(false);

onMounted(() => {
  tabulator.value = new Tabulator(table.value, {
    editTriggerEvent: "dblclick",
    rowHeader: props.rowHeader,
    layout: "fitColumns",
    data: props.pagination ? [] : [...props.rows], // 원격 페이징이면 초기 데이터 X
    dataTree: props.dataTree,
    dataTreeCollapseElement: "<span>&#9654;&nbsp;</span>",
    dataTreeExpandElement: "<span>&#9660;&nbsp;</span>",
    dataTreeStartExpanded: props.dataTreeStartExpanded,
    dataTreeElementColumn: props.dataTreeElementColumn,
    columns: props.columns,
    reactiveData: props.pagination ? false : props.reactiveData, // localData Only
    height: props.height,
    minHeight: props.minHeight,
    maxHeight: props.maxHeight,
    movableColumns: props.movableColumns,
    movableRows: props.movableRows,
    placeholder: props.placeholder,
    dataTreeChildIndent: 20,
    /// pagination
    pagination: props.pagination ? "remote" : false,
    paginationMode: props.pagination ? "remote" : undefined,
    paginationSize: props.paginationSize,
    paginationButtonCount: props.paginationButtonCount,
    paginationSizeSelector: [50, 100, 150, 200],
    ajaxURL: props.pagination ? props.ajaxUrl : undefined,
    ajaxRequestFunc: props.pagination ? props.ajaxRequestFunc : undefined,
    ///
    selectableRows: props.selectableRows,
    dataTreeChildField: props.dataTreeChildField,
    dataTreeSelectPropagate: props.dataTreeSelectPropagate,
    headerVisible: props.headerVisible,
    dataTreeFilter: false,
    clipboard: true,
    clipboardCopyRowRange: "selected",
    clipboardCopyConfig: {
      columnHeaders: false, //do not include column headers in clipboard output
      columnGroups: false, //do not include column groups in column headers for printed table
      rowHeaders: false, //do not include row headers in clipboard output
      rowGroups: false, //do not include row groups in clipboard output
    },
    selectableRowsRangeMode: props.selectableRowsRangeMode,
    paginationCounter: function (pageSize, currentRow, currentPage, totalRows, totalPages) {
      const lastRow = Math.min(currentRow + pageSize - 1, totalRows);
      return `${currentRow}-${lastRow} of ${totalRows}`;
    },

    // pagination 사용하지 않을 때, footer X
    footerElement: null,
    rowFormatter: props.rowFormatter,
    rowContextMenu: props.rowContextMenu,
  });

  tabulator.value.on("tableBuilt", () => {
    if (props.pagination && props.ajaxRequestFunc) {
      tabulator.value.setData();
    }
  });

  // event: row 클릭
  tabulator.value.on("rowClick", (e, row) => {
    emit("rowClick", row.getData());
  });

  // event: row double click
  tabulator.value.on("rowDblClick", (e, row) => {
    emit("rowDblClick", row.getData());
  });

  // event: checkbox 선택/해제
  tabulator.value.on("rowSelected", rowSelected);
  tabulator.value.on("rowDeselected", rowDeselected);

  // 무한 스크롤
  tabulator.value.on("scrollVertical", function () {
    // 버튼 페이지네이션 아닐 경우
    if (!props.pagination) {
      const scrollElement = tabulator.value.rowManager.element;
      const scrollTop = scrollElement.scrollTop;
      const scrollHeight = scrollElement.scrollHeight;
      const clientHeight = scrollElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 1 && props.infiniteScroll && !isLoading.value) {
        isLoading.value = true;

        const loader = document.createElement("div");
        loader.setAttribute("id", "loading-spinner");
        loader.classList.add("loading-spinner");
        loader.innerHTML = `<div class="spinner"></div>`;

        scrollElement.appendChild(loader);
        props.infiniteScroll().finally(() => {
          isLoading.value = false;
          const loaderElement = document.getElementById("loading-spinner");
          if (loaderElement) {
            loaderElement.remove();
          }
        });
      }
    }
  });

  // event: row 이동
  tabulator.value.on("rowMoved", (e, row) => {
    // "active" 속성을 넣으면 현재의 grid에 표시되는 형태대로 data 가져옴
    emit("rowMoved", tabulator.value.getData("active"));
  });

  tabulator.value.on("moveableRowsElementDrop", (e, element, row) => {
    // console.log("[moveableRowsElementDrop] firstParameter", e);
    // console.log("[moveableRowsElementDrop] secondParameter", element);
    // console.log("[moveableRowsElementDrop] thirdParameter", row);
  });

  // event: cell 수정
  tabulator.value.on("cellEdited", function (cell) {
    emit("cellEdited", cell);
  });
});

// checkbox 선택된 모든 행의 데이터 가져오기
// checkbox 선택된 모든 행의 데이터 가져오기
function rowSelected() {
  emit("rowSelected", tabulator.value.getSelectedData());
}

function rowDeselected() {
  emit("rowDeselected", tabulator.value.getSelectedData());
}

defineExpose({
  selectRows,
  deselectAllRows,
  getSelectedData,
  getData,
  deleteRows,
  treeExpand,
  treeCollapse,
  searchAndHighlight,
  clearHighlights,
  replaceData,
  redraw,
  clearData,
  updateOrAddData,
  getRows,
  scrollToRow,
  getScrollPosition,
  scrollMove,
  addRow,
  excelDownload,
  selectRowByManually,
  setData,
});

function setData(param) {
  tabulator.value.setData(param);
}

function excelDownload(name) {
  const getFormattedDate = (date) => {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };
  const date = getFormattedDate(new Date());

  // 현재 표시된 컬럼명을 매핑하여 제목 가져오기
  const columnHeaders = {};
  tabulator.value.getColumns().forEach((col) => {
    const field = col.getField();
    const title = col.getDefinition().title;
    if (field && title) {
      columnHeaders[field] = title; // 필드명과 제목을 매핑
    }
  });

  // 포맷된 데이터에서 컬럼명을 매핑하여 제목으로 변환
  let formattedData = tabulator.value.getRows().map((row) => {
    let rowData = {};
    row.getCells().forEach((cell) => {
      const field = cell.getField();
      rowData[columnHeaders[field] || field] = cell.getElement().innerText; // 컬럼 제목으로 키 설정
    });
    return rowData;
  });

  // XLSX 작업을 통해 엑셀 파일 생성
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, name);

  // 셀 너비 자동 조정
  const colWidths = [];
  // 컬럼 제목 너비 계산
  Object.keys(columnHeaders).forEach((key, index) => {
    colWidths[index] = columnHeaders[key].length + 5; // 여유 공간 늘리기
  });

  // 셀 내용 너비 계산
  formattedData.forEach((row) => {
    Object.keys(row).forEach((key, index) => {
      const cellValue = row[key] || ""; // 셀 값
      const cellWidth = cellValue.length + 5; // 여유 공간 늘리기
      // 각 컬럼의 최대 너비를 설정
      colWidths[index] = Math.max(colWidths[index] || 0, cellWidth); // 최대 너비 계산
    });
  });

  // 엑셀 시트에 너비 설정
  worksheet["!cols"] = colWidths.map((width) => ({ wch: width }));

  // 엑셀 파일 다운로드
  XLSX.writeFile(workbook, `${name}_${date}.xlsx`);
}

function selectRows(param) {
  this.$nextTick(() => {
    tabulator.value.selectRow(param);
  });
}

function deselectAllRows() {
  tabulator.value.deselectRow();
}

function getData() {
  return tabulator.value.getData();
}

function getSelectedData() {
  return tabulator.value.getSelectedData();
}

function deleteRow(row) {
  if (row) {
    if (row.getTreeChildren()) {
      const children = row.getTreeChildren(); // 하위 노드 가져오기
      children.forEach((child) => {
        deleteRow(child); // 재귀적으로 하위 노드 삭제
      });
    }

    // 현재 노드 삭제
    row.delete();
  } else {
    console.error("삭제할 행을 찾을 수 없습니다.");
  }
}

function deleteRows() {
  const selectedRows = tabulator.value.getSelectedRows(); // 선택된 Tabulator 행 객체 가져오기

  if (selectedRows.length > 0) {
    selectedRows.forEach((row) => {
      deleteRow(row); // 각 선택된 Tabulator 행 삭제
    });
  } else {
    console.error("삭제할 선택된 행이 없습니다.");
  }
}

function treeExpand() {
  const rows = tabulator.value.getRows();

  const stack = [...rows];

  while (stack.length > 0) {
    const row = stack.pop();

    // 현재 행을 확장
    row.treeExpand();

    // 자식 행들을 가져와 스택에 추가
    const children = row.getTreeChildren();
    if (children && children.length > 0) {
      stack.push(...children);
    }
  }
}

function treeCollapse() {
  const rows = tabulator.value.getRows();

  rows.forEach((row) => {
    const children = row.getTreeChildren();

    const stack = [...children];

    while (stack.length > 0) {
      const currentRow = stack.pop();

      // 현재 행을 접음
      currentRow.treeCollapse();

      // 자식 행들을 스택에 추가
      const childRows = currentRow.getTreeChildren();
      if (childRows && childRows.length > 0) {
        stack.push(...childRows);
      }
    }
  });
}
// rows 변경 감지

watch(
  () => props.rows,
  (newRows) => {
    // console.log("watch change");
    if (!props.pagination) {
      tabulator.value.replaceData([...newRows]);

      // footerElement는 자동으로 update 되지 않는다.
      if (props.footer) updateFooter();
    }

    // 페이지 설정
    // tabulator.value.setPage(tabulator.value.getPageMax());
  },
  { deep: true }
);

// 검색 filter
watch(
  () => props.filters,
  (newFilters) => {
    tabulator.value.setFilter(newFilters);
  }
);

function updateFooter() {
  const footer = document.querySelector(".grid-footer");
  if (footer) {
    totalRows.value = tabulator.value.getDataCount();
    footer.innerHTML = `1-${totalRows.value} of ${totalRows.value}`;
  }
}

///////////////////////
function clearHighlights() {
  // 전체 데이터를 가져옴
  const rows = tabulator.value.getRows();

  // 스택을 사용한 DFS
  const stack = [...rows]; // 스택 초기화

  while (stack.length > 0) {
    const row = stack.pop();

    // 행에서 하이라이트 제거
    row.getElement().classList.remove("highlight-row");

    // 자식 행들을 스택에 추가
    const children = row.getTreeChildren();
    if (children && children.length > 0) {
      children.forEach((child) => {
        stack.push(child); // 자식 행을 스택에 추가
      });
    }
  }
}

/*
* @param
  const fieldValues = {
    name : "NameSample",
    code : "CODE_TEST"
  }
*/
function highlightRows(fieldValues) {
  // 모든 데이터를 가져옴
  const rows = tabulator.value.getRows();
  const stack = [...rows]; // 스택 초기화

  while (stack.length > 0) {
    const row = stack.pop();
    const data = row.getData(); // 행 데이터 가져오기

    // 필드별 검색값을 기반으로 AND 조건으로 하이라이트 결정
    const shouldHighlight = Object.keys(fieldValues).every((field) => {
      const searchValue = fieldValues[field];
      const value = data[field];
      return (
        searchValue === undefined ||
        searchValue === "" ||
        (value && value.toString().toLowerCase().includes(searchValue.toLowerCase()))
      );
    });

    if (shouldHighlight) {
      row.getElement().classList.add("highlight-row"); // 행 전체에 하이라이트 스타일 적용
    } else {
      row.getElement().classList.remove("highlight-row"); // 검색어가 없으면 하이라이트 제거
    }

    // 자식 행들을 스택에 추가
    const children = row.getTreeChildren();
    if (children && children.length > 0) {
      children.forEach((child) => {
        stack.push(child); // 자식 행을 스택에 추가
      });
    }
  }
}

function searchAndHighlight(fieldValues) {
  // 모든 행의 하이라이트를 제거
  clearHighlights();

  // 새로운 하이라이트 적용
  if (Object.keys(fieldValues).length > 0) {
    highlightRows(fieldValues);
  }
}

function replaceData(row) {
  tabulator.value.replaceData(row);
}

function redraw() {
  tabulator.value.redraw(true);
}

function clearData() {
  tabulator.value.clearData();
}

function updateOrAddData(row) {
  tabulator.value.updateOrAddData(row);
}

function getRows() {
  return tabulator.value.getRows();
}

function scrollToRow(entity, location) {
  tabulator.value.scrollToRow(entity, location, false);
}

function getScrollPosition() {
  return tabulator.value.rowManager.scrollTop;
}

function addRow(row, state) {
  tabulator.value.addRow(row, state);
}

function scrollMove(value) {
  tabulator.value.rowManager.element.scrollTop = value;
}

function selectRowByManually(id) {
  // ID에 해당하는 row를 찾기
  const targetRow = findRowById(id);

  if (targetRow) {
    // row가 존재하면 해당 row를 선택
    targetRow.select();
  } else {
    console.log("Row not found");
  }
}
function findRowById(targetId) {
  const rows = tabulator.value.getRows(); // 최상위 row 가져오기

  // 트리 구조 탐색
  for (let row of rows) {
    const targetRow = recursiveFindRow(row, targetId);
    if (targetRow) return targetRow; // 찾은 row 반환
  }
  return null; // 해당 ID를 가진 row를 찾지 못한 경우
}
function recursiveFindRow(row, targetId) {
  if (row.getData().id === targetId) {
    return row; // 대상 row를 찾음
  }

  // children row 탐색
  const children = row.getTreeChildren();
  for (let child of children) {
    const found = recursiveFindRow(child, targetId);
    if (found) return found;
  }

  return null; // children에서 못 찾음
}
</script>

<template>
  <div ref="table"></div>
</template>

<style>
@import "~/tabulator-tables/dist/css/tabulator.min.css";
</style>

<style lang="scss">
.tabulator .tabulator-header .tabulator-col.tabulator-sortable .tabulator-col-title {
  padding-right: 17px;
}

.grid-footer {
  font-weight: normal;
}

.highlight-row {
  background-color: $blue-3 !important;
  /* 원하는 하이라이트 색상 */
}

.toggle-button {
  width: 70px;
  height: 25px;
  border-radius: 15px;
  background-color: grey;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  box-sizing: border-box;
}

.toggle-button.on {
  padding-right: 10%;
  background-color: green;
}

.toggle-button.off {
  padding-left: 10%;
  background-color: red;
}

.toggle-button .toggle-knob {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: left 0.3s;
}

.toggle-button.on .toggle-knob {
  left: calc(100% - 23px);
  /* on 상태에서 오른쪽으로 이동 */
}

.toggle-button.off .toggle-knob {
  left: 1px;
  /* off 상태에서 왼쪽에 위치 */
}

.row-modified {
  background-color: #ffcccb !important;
  /* 행의 배경색을 연한 빨간색으로 변경 */
}

.edited-row {
  background-color: #ffffe0 !important;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #09f;
  animation: spin 1s ease infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-spinner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.tabulator .tabulator-tableholder .tabulator-placeholder .tabulator-placeholder-contents {
  color: v-bind(placeholderColor) !important;
}

.tabulator-hover-clickable:hover {
  cursor: pointer;
}
</style>
