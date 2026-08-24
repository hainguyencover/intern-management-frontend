<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div class="row items-center">
        <q-btn flat round icon="arrow_back" color="primary" class="q-mr-sm" @click="router.back()" />
        <div>
          <h1 class="text-h5 text-weight-bold text-primary q-my-none">Lịch sử đồng bộ (Sync Jobs History)</h1>
          <div class="text-subtitle2 text-grey-7">Chi tiết tiến trình và thống kê các bản ghi đồng bộ</div>
        </div>
      </div>
      <q-btn flat color="primary" icon="refresh" label="Làm mới" @click="loadData" />
    </div>

    <!-- Table -->
    <q-card flat bordered>
      <q-table
        :rows="store.syncHistory"
        :columns="columns"
        row-key="id"
        flat
        bordered
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="getSyncBadgeColor(props.value)">
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-startedAt="props">
          <q-td :props="props">
            {{ props.value ? new Date(props.value).toLocaleString('vi-VN') : '-' }}
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useIntegrationStore } from '@/stores/integrationStore';

const route = useRoute();
const router = useRouter();
const store = useIntegrationStore();

const columns: any[] = [
  { name: 'id', label: 'Job ID', field: 'id', align: 'left' },
  { name: 'syncType', label: 'Loại Sync', field: 'syncType', align: 'left' },
  { name: 'direction', label: 'Hướng', field: 'direction', align: 'center' },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' },
  { name: 'totalRecords', label: 'Tổng số', field: 'totalRecords', align: 'right' },
  { name: 'successRecords', label: 'Thành công', field: 'successRecords', align: 'right' },
  { name: 'failedRecords', label: 'Thất bại', field: 'failedRecords', align: 'right' },
  { name: 'startedAt', label: 'Bắt đầu', field: 'startedAt', align: 'left' }
];

function getSyncBadgeColor(status: string) {
  if (status === 'SUCCESS') return 'positive';
  if (status === 'PARTIAL_SUCCESS') return 'warning';
  if (status === 'RUNNING') return 'info';
  if (status === 'FAILED') return 'negative';
  return 'grey';
}

function loadData() {
  const connectionId = Number(route.query.connectionId) || 1;
  store.fetchHistory(connectionId);
}

onMounted(() => {
  loadData();
});
</script>
