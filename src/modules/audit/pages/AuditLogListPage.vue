<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h1 class="text-h5 text-bold q-my-none text-primary">Nhật ký Audit Logs Hệ thống</h1>
        <p class="text-caption text-grey-7 q-mb-none">Theo dõi mọi tác vụ thay đổi dữ liệu và truy cập hệ thống theo thời gian thực</p>
      </div>
      <q-btn outline color="primary" icon="refresh" label="Làm mới" @click="loadLogs" />
    </div>

    <q-card flat bordered>
      <q-table
        :rows="auditLogs"
        :columns="columns"
        row-key="id"
        :loading="loading"
        flat
      >
        <template #body-cell-action="props">
          <q-td :props="props">
            <q-chip dense color="deep-purple" text-color="white" size="sm">
              {{ props.value }}
            </q-chip>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { apiClient as api } from '../../../shared/api/client';

const $q = useQuasar();
const loading = ref(false);
const auditLogs = ref([]);

const columns = [
  { name: 'id', label: 'ID Log', field: 'id', sortable: true },
  { name: 'action', label: 'Hành động', field: 'action', align: 'left' },
  { name: 'performedBy', label: 'Người thực hiện', field: 'performedBy', align: 'left' },
  { name: 'entityName', label: 'Đối tượng tác động', field: 'entityName', align: 'left' },
  { name: 'timestamp', label: 'Thời gian', field: 'timestamp', align: 'center', sortable: true }
];

async function loadLogs() {
  loading.value = true;
  try {
    const res = await api.get('/api/v1/audit-logs');
    if (res.data && res.data.data) {
      auditLogs.value = res.data.data.content || res.data.data;
    }
  } catch (err: any) {
    $q.notify({ type: 'warning', message: 'Không thể tải nhật ký audit logs' });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadLogs();
});
</script>
