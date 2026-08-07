<template>
  <div class="ims-table-wrapper">
    <q-table
      :rows="rows"
      :columns="columns"
      :row-key="rowKey"
      :selection="selection"
      :selected="selected"
      :loading="loading"
      :no-data-label="emptyText"
      flat
      bordered
      binary-state-sort
      class="ims-data-table"
      @update:selected="(val) => $emit('update:selected', val)"
      @request="(val) => $emit('request', val)"
    >
      <!-- Dynamic body cell slots -->
      <template v-for="col in columns" :key="col.name" v-slot:[`body-cell-${col.name}`]="props">
        <slot :name="`body-cell-${col.name}`" v-bind="props">
          <q-td :props="props">
            {{ props.value }}
          </q-td>
        </slot>
      </template>

      <!-- Empty state override -->
      <template v-slot:no-data>
        <div class="full-width row flex-center q-pa-lg text-grey-6">
          <slot name="empty">
            <q-icon name="warning" size="2rem" class="q-mr-sm" />
            <span>{{ emptyText }}</span>
          </slot>
        </div>
      </template>

      <!-- Loading override -->
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    rows: any[];
    columns: any[];
    loading?: boolean;
    rowKey?: string;
    emptyText?: string;
    selection?: 'single' | 'multiple' | 'none';
    selected?: any[];
  }>(),
  {
    loading: false,
    rowKey: 'id',
    emptyText: 'Không có dữ liệu hiển thị',
    selection: 'none',
    selected: () => []
  }
);

defineEmits<{
  (e: 'update:selected', value: any[]): void;
  (e: 'request', value: any): void;
}>();
</script>

<style scoped lang="sass">
.ims-table-wrapper :deep(.q-table__container)
  border-radius: 12px
</style>
