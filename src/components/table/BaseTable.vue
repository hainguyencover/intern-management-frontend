<template>
  <div class="base-table-container">
    <q-table
      :title="title"
      :rows="rows"
      :columns="columns"
      :row-key="rowKey"
      :loading="loading"
      :pagination="pagination"
      flat
      bordered
    >
      <template v-for="(_, slot) in $slots" #[slot]="scope">
        <slot :name="slot" v-bind="scope || {}" />
      </template>

      <template #no-data>
        <div class="full-width row flex-center q-pa-md text-grey-7">
          <q-icon name="inbox" size="md" class="q-mr-sm" />
          <span>{{ emptyText || 'Không có dữ liệu hiển thị' }}</span>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import type { QTableProps } from 'quasar';

withDefaults(
  defineProps<{
    title?: string;
    rows: any[];
    columns: QTableProps['columns'];
    rowKey?: string;
    loading?: boolean;
    pagination?: QTableProps['pagination'];
    emptyText?: string;
  }>(),
  {
    rowKey: 'id',
    loading: false
  }
);
</script>
