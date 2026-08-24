<template>
  <q-page class="q-pa-md">
    <!-- Filter Toolbar -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-sm-3">
            <q-input v-model="filter.actorUsername" dense outlined label="Actor / Người dùng" clearable />
          </div>
          <div class="col-12 col-sm-2">
            <q-input v-model="filter.action" dense outlined label="Hành động (Action)" clearable />
          </div>
          <div class="col-12 col-sm-2">
            <q-input v-model="filter.resourceType" dense outlined label="Tài nguyên (Resource)" clearable />
          </div>
          <div class="col-12 col-sm-2">
            <q-select
              v-model="filter.result"
              dense
              outlined
              label="Kết quả (Result)"
              :options="['SUCCESS', 'FAILED', 'DENIED']"
              clearable
            />
          </div>
          <div class="col-12 col-sm-3 flex q-gutter-xs">
            <q-btn color="primary" icon="search" label="Tìm kiếm" @click="loadAuditLogs" />
            <q-btn outline color="secondary" icon="file_download" label="Xuất CSV" @click="onExport" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Activity Log Table -->
    <q-card flat bordered>
      <q-card-section class="row items-center justify-between">
        <div class="text-h6 text-bold">Nhật Ký Hoạt Động Hệ Thống (Audit Logs)</div>
        <div class="text-caption text-grey-7">Hiển thị các thao tác an ninh & quản trị (Immutable Audit Trail)</div>
      </q-card-section>

      <q-card-section class="q-pa-none">
        <q-table
          :rows="rows"
          :columns="columns"
          row-key="id"
          :loading="loading"
          flat
          square
        >
          <template v-slot:body-cell-result="props">
            <q-td :props="props">
              <q-chip
                :color="props.value === 'SUCCESS' ? 'positive' : 'negative'"
                text-color="white"
                size="sm"
                class="text-bold"
              >
                {{ props.value }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" align="center">
              <q-btn flat dense round color="primary" icon="visibility" @click="openDetail(props.row)">
                <q-tooltip>Xem chi tiết event</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Detail Drawer Dialog -->
    <q-dialog v-model="detailShow">
      <q-card style="width: 700px; max-width: 90vw;">
        <q-card-section class="row items-center justify-between bg-grey-2">
          <div class="text-h6 text-bold">Chi Tiết Nhật Ký Audit #{{ selectedItem?.id }}</div>
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-sm text-body2">
            <div class="col-6"><strong>Actor Username:</strong> {{ selectedItem?.actorUsername || 'SYSTEM' }}</div>
            <div class="col-6"><strong>Actor Role:</strong> {{ selectedItem?.actorRole || 'N/A' }}</div>
            <div class="col-6"><strong>Action:</strong> <q-badge color="blue">{{ selectedItem?.action }}</q-badge></div>
            <div class="col-6"><strong>Resource:</strong> {{ selectedItem?.resourceType }} (ID: {{ selectedItem?.resourceId }})</div>
            <div class="col-6"><strong>Kết quả:</strong> {{ selectedItem?.result }}</div>
            <div class="col-6"><strong>Thời gian:</strong> {{ selectedItem?.createdAt }}</div>
            <div class="col-6"><strong>IP Address:</strong> {{ selectedItem?.ipAddress }}</div>
            <div class="col-6"><strong>Request ID:</strong> <span class="text-mono">{{ selectedItem?.requestId }}</span></div>
            <div class="col-12 q-mt-xs"><strong>User Agent:</strong> {{ selectedItem?.userAgent }}</div>
            <div class="col-12 q-mt-xs"><strong>Message:</strong> {{ selectedItem?.message }}</div>
          </div>

          <q-separator class="q-my-md" />

          <!-- Payload Diffs -->
          <div v-if="selectedItem?.beforeJson" class="q-mb-md">
            <div class="text-subtitle2 text-bold text-grey-8">Dữ liệu Trước (Before State / Request Args):</div>
            <pre class="bg-grey-1 q-pa-sm rounded-borders text-caption text-mono overflow-auto" style="max-height: 150px;">{{ formatJson(selectedItem?.beforeJson) }}</pre>
          </div>

          <div v-if="selectedItem?.afterJson">
            <div class="text-subtitle2 text-bold text-grey-8">Dữ liệu Sau (After State / Response Result):</div>
            <pre class="bg-grey-1 q-pa-sm rounded-borders text-caption text-mono overflow-auto" style="max-height: 150px;">{{ formatJson(selectedItem?.afterJson) }}</pre>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useQuasar } from 'quasar';
import type { AuditLogItem, AuditLogFilter } from '@/types/auditLog';
import { getAuditLogs, exportAuditLogs } from '@/services/auditLogService';

const $q = useQuasar();
const rows = ref<AuditLogItem[]>([]);
const loading = ref(false);
const detailShow = ref(false);
const selectedItem = ref<AuditLogItem | null>(null);

const filter = reactive<AuditLogFilter>({
  actorUsername: '',
  action: '',
  resourceType: '',
  result: ''
});

const columns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'createdAt', label: 'Thời Gian', field: 'createdAt', sortable: true },
  { name: 'actorUsername', label: 'Actor', field: 'actorUsername' },
  { name: 'actorRole', label: 'Vai Trò', field: 'actorRole' },
  { name: 'action', label: 'Hành Động', field: 'action' },
  { name: 'resourceType', label: 'Resource', field: 'resourceType' },
  { name: 'result', label: 'Kết Quả', field: 'result' },
  { name: 'ipAddress', label: 'IP Address', field: 'ipAddress' },
  { name: 'actions', label: 'Chi Tiết', field: 'actions' }
];

const loadAuditLogs = async () => {
  loading.value = true;
  try {
    const res = await getAuditLogs({ ...filter, page: 0, size: 50 });
    rows.value = res.content || [];
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Tải nhật ký audit thất bại' });
  } finally {
    loading.value = false;
  }
};

const onExport = async () => {
  try {
    const blob = await exportAuditLogs(filter);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_export.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    $q.notify({ type: 'positive', message: 'Xuất CSV audit log thành công' });
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Xuất CSV thất bại' });
  }
};

const openDetail = (item: AuditLogItem) => {
  selectedItem.value = item;
  detailShow.value = true;
};

const formatJson = (jsonStr?: string) => {
  if (!jsonStr) return '-';
  try {
    return JSON.stringify(JSON.parse(jsonStr), null, 2);
  } catch (e) {
    return jsonStr;
  }
};

onMounted(loadAuditLogs);
</script>

<style scoped>
.text-mono { font-family: monospace; }
</style>
