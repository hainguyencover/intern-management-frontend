<template>
  <div class="base-data-table-container">
    <!-- Floating Bulk Action Bar -->
    <q-slide-transition>
      <div v-if="selectedRows.length > 0" class="q-mb-md q-pa-sm bg-primary text-white rounded-borders row items-center justify-between shadow-2">
        <div class="row items-center q-gutter-x-sm">
          <q-icon name="check_circle" size="sm" />
          <span class="text-bold">Đã chọn {{ selectedRows.length }} bản ghi</span>
        </div>
        <div class="row q-gutter-x-xs">
          <BaseButton
            v-for="action in bulkActions"
            :key="action.id"
            :icon="action.icon"
            :label="action.label"
            :color="action.color || 'white'"
            flat
            dense
            v-can="action.permission"
            @click="action.handler(selectedRows)"
          />
          <BaseButton
            flat
            dense
            label="Bỏ chọn"
            color="white"
            @click="selectedRows = []"
          />
        </div>
      </div>
    </q-slide-transition>

    <!-- Table Toolbar Header -->
    <div class="row items-center justify-between q-mb-sm">
      <div class="text-bold text-subtitle1">
        <slot name="title" />
      </div>
      <div class="row q-gutter-x-xs items-center">
        <!-- Column Visibility Dropdown -->
        <q-btn-dropdown flat dense icon="view_column" label="Cấu hình cột" color="grey-8">
          <q-list dense style="min-width: 200px">
            <q-item v-for="col in allColumns" :key="col.name" v-ripple tag="label">
              <q-item-section side top>
                <q-checkbox
                  v-model="columnVisibilityMap[col.name]"
                  :disable="col.required"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ col.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>

    <!-- Quasar q-table wrapper with WCAG 2.2 accessibility compliance -->
    <q-table
      v-model:selected="selectedRows"
      :rows="rows"
      :columns="visibleColumns"
      :loading="loading"
      :row-key="rowKey"
      :selection="selectable ? 'multiple' : 'none'"
      :rows-per-page-options="[5, 10, 20, 50]"
      :pagination="pagination"
      :pagination-label="(first, end, total) => `${first}-${end}/${total}`"
      flat
      bordered
      dense
      class="sticky-header-table"
      role="grid"
      tabindex="0"
      aria-label="Bảng dữ liệu nghiệp vụ"
      @request="onRequest"
      @keydown.up.prevent="navigateRow(-1)"
      @keydown.down.prevent="navigateRow(1)"
      @keydown.space.prevent="toggleCurrentRowSelection"
    >
      <!-- Dynamic slot passthrough -->
      <template v-for="(_, name) in $slots" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps || {}" />
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, computed, watch } from 'vue';
import BaseButton from './BaseButton.vue';
import type { DataTableColumn, BulkAction } from './table/tableTypes';

const props = withDefaults(
  defineProps<{
    rows: T[];
    columns: DataTableColumn<T>[];
    loading?: boolean;
    rowKey?: string;
    selectable?: boolean;
    bulkActions?: BulkAction<T>[];
    pagination?: any;
  }>(),
  {
    loading: false,
    rowKey: 'id',
    selectable: false,
    bulkActions: () => []
  }
);

const emit = defineEmits<{
  (e: 'request', requestProps: any): void;
}>();

function onRequest(requestProps: any) {
  emit('request', requestProps);
}

const selectedRows = ref<T[]>([]) as { value: T[] };
const allColumns = ref([...props.columns]);

// Map column visibility
const columnVisibilityMap = ref<Record<string, boolean>>(
  props.columns.reduce((acc, col) => {
    acc[col.name] = col.visible !== false;
    return acc;
  }, {} as Record<string, boolean>)
);

const visibleColumns = computed(() => {
  return props.columns.filter((col) => columnVisibilityMap.value[col.name] !== false);
});

watch(
  () => props.columns,
  (newCols) => {
    allColumns.value = [...newCols];
    newCols.forEach((c) => {
      if (columnVisibilityMap.value[c.name] === undefined) {
        columnVisibilityMap.value[c.name] = c.visible !== false;
      }
    });
  },
  { deep: true }
);

const activeRowIndex = ref(-1);

function navigateRow(direction: number) {
  if (props.rows.length === 0) return;
  let nextIdx = activeRowIndex.value + direction;
  if (nextIdx < 0) nextIdx = 0;
  if (nextIdx >= props.rows.length) nextIdx = props.rows.length - 1;
  activeRowIndex.value = nextIdx;
}

function toggleCurrentRowSelection() {
  if (activeRowIndex.value < 0 || activeRowIndex.value >= props.rows.length) return;
  const row = props.rows[activeRowIndex.value];
  const idx = selectedRows.value.findIndex((r) => r[props.rowKey] === row[props.rowKey]);
  if (idx > -1) {
    selectedRows.value.splice(idx, 1);
  } else {
    selectedRows.value.push(row);
  }
}
</script>

<style scoped>
.sticky-header-table :deep(thead tr:first-child th) {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #f5f5f5;
}

.sticky-header-table :deep(.q-table__bottom) {
  padding: 2px 8px;
  min-height: 34px;
  font-size: 12px;
}

.sticky-header-table :deep(.q-table__select) {
  min-width: 45px;
}

.sticky-header-table :deep(.q-field--auto-height .q-field__control) {
  min-height: 24px;
  height: 24px;
  padding: 0 2px;
}

/* Hide verbose 'Records per page:' text label to keep pagination ultra-compact */
.sticky-header-table :deep(.q-table__bottom .q-table__control:first-child > span:first-child) {
  display: none !important;
}
</style>
