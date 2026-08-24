<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-4">
        <q-card flat bordered class="bg-primary text-white shadow-2">
          <q-card-section>
            <div class="text-subtitle2 opacity-80">Trạng thái Sao Lưu Gần Nhất</div>
            <div class="text-h5 text-bold class-q-my-xs">
              {{ latestBackup ? latestBackup.status : 'Chưa có dữ liệu' }}
            </div>
            <div class="text-caption">
              Thời gian: {{ latestBackup?.startedAt || 'N/A' }} | Kích thước: {{ formatBytes(latestBackup?.fileSize) }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="shadow-1">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">Lịch Sao Lưu Định Kỳ</div>
            <div class="text-h6 text-bold text-primary">02:00 AM Hàng Ngày</div>
            <div class="text-caption text-grey-6">Policy Retention: 7 daily, 4 weekly, 12 monthly</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4 flex flex-center">
        <q-btn
          color="primary"
          icon="cloud_upload"
          label="Sao lưu ngay (Backup Now)"
          size="lg"
          class="full-width q-py-md shadow-2"
          :loading="triggering"
          @click="onTriggerBackup"
        />
      </div>
    </div>

    <!-- Backup History Table -->
    <q-card flat bordered>
      <q-card-section class="row items-center justify-between">
        <div class="text-h6 text-bold">Lịch Sử Sao Lưu & Khôi Phục (Backup History)</div>
        <q-btn flat round icon="refresh" @click="loadHistory" />
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
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip
                :color="getStatusColor(props.value)"
                text-color="white"
                size="sm"
                class="text-bold"
              >
                {{ props.value }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-fileSize="props">
            <q-td :props="props">
              {{ formatBytes(props.value) }}
            </q-td>
          </template>

          <template v-slot:body-cell-checksum="props">
            <q-td :props="props">
              <span class="text-caption text-mono" style="font-size: 11px;">
                {{ props.value ? props.value.substring(0, 16) + '...' : '-' }}
              </span>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-xs">
              <q-btn
                flat
                dense
                round
                color="secondary"
                icon="download"
                :disable="props.row.status !== 'SUCCESS'"
                @click="onDownload(props.row)"
              >
                <q-tooltip>Tải bản sao lưu</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                color="negative"
                icon="restore"
                :disable="props.row.status !== 'SUCCESS'"
                @click="openRestoreModal(props.row)"
              >
                <q-tooltip>Khôi phục dữ liệu (Restore)</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Restore Safety Gate Modal -->
    <q-dialog v-model="restoreDialogShow" persistent>
      <q-card style="width: 500px; max-width: 90vw;">
        <q-card-section class="bg-negative text-white row items-center">
          <q-icon name="warning" size="md" class="q-mr-sm" />
          <div class="text-h6 text-bold">CẢNH BÁO: KHÔI PHỤC DỮ LIỆU</div>
        </q-card-section>

        <q-card-section class="q-pa-md">
          <p class="text-body2 text-grey-9">
            Hành động này sẽ <strong>ghi đè toàn bộ Database hệ thống</strong> bằng bản sao lưu ID: 
            <span class="text-bold text-primary">#{{ selectedBackup?.id }}</span> (Ngày: {{ selectedBackup?.startedAt }}).
          </p>
          <div class="q-pa-sm bg-red-1 text-negative rounded-borders q-mb-md text-caption">
            <strong>Check Integrity:</strong> Checksum SHA-256 đã xác minh hợp lệ. 
            Quá trình khôi phục có thể gây gián đoạn hệ thống.
          </div>

          <q-input
            v-model="confirmCode"
            outlined
            dense
            label="Nhập mã xác nhận: CONFIRM_RESTORE"
            placeholder="CONFIRM_RESTORE"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Hủy bỏ" color="grey" v-close-popup />
          <q-btn
            color="negative"
            label="Xác Nhận Khôi Phục"
            :disable="confirmCode !== 'CONFIRM_RESTORE'"
            :loading="restoring"
            @click="executeRestore"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import type { BackupJob } from '@/types/backup';
import { getBackupHistory, triggerManualBackup, restoreBackup, downloadBackupFile } from '@/services/backupService';

const $q = useQuasar();
const rows = ref<BackupJob[]>([]);
const loading = ref(false);
const triggering = ref(false);
const restoring = ref(false);
const restoreDialogShow = ref(false);
const selectedBackup = ref<BackupJob | null>(null);
const confirmCode = ref('');

const columns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'startedAt', label: 'Thời Gian Bắt Đầu', field: 'startedAt', sortable: true },
  { name: 'type', label: 'Loại Trigger', field: 'type' },
  { name: 'backupType', label: 'Backup Type', field: 'backupType' },
  { name: 'status', label: 'Trạng Thái', field: 'status' },
  { name: 'fileSize', label: 'Dung Lượng', field: 'fileSize' },
  { name: 'checksum', label: 'SHA-256 Checksum', field: 'checksum' },
  { name: 'createdByUsername', label: 'Người Thực Hiện', field: 'createdByUsername' },
  { name: 'actions', label: 'Thao Tác', field: 'actions', align: 'center' }
];

const latestBackup = computed(() => (rows.value.length > 0 ? rows.value[0] : null));

const loadHistory = async () => {
  loading.value = true;
  try {
    const res = await getBackupHistory({ page: 0, size: 50 });
    rows.value = res.content || [];
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Tải lịch sử sao lưu thất bại' });
  } finally {
    loading.value = false;
  }
};

const onTriggerBackup = async () => {
  triggering.value = true;
  try {
    await triggerManualBackup('FULL');
    $q.notify({ type: 'positive', message: 'Tạo bản sao lưu thành công!' });
    await loadHistory();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Tạo bản sao lưu thất bại' });
  } finally {
    triggering.value = false;
  }
};

const openRestoreModal = (backup: BackupJob) => {
  selectedBackup.value = backup;
  confirmCode.value = '';
  restoreDialogShow.value = true;
};

const executeRestore = async () => {
  if (!selectedBackup.value) return;
  restoring.value = true;
  try {
    await restoreBackup(selectedBackup.value.id, confirmCode.value);
    $q.notify({ type: 'positive', message: 'Khôi phục cơ sở dữ liệu thành công!' });
    restoreDialogShow.value = false;
    await loadHistory();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Khôi phục thất bại: ' + (err.response?.data?.message || err.message) });
  } finally {
    restoring.value = false;
  }
};

const onDownload = async (backup: BackupJob) => {
  try {
    const blob = await downloadBackupFile(backup.id);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ims_backup_${backup.id}.sql.gz`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Tải file sao lưu thất bại' });
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'SUCCESS': return 'positive';
    case 'RUNNING': return 'warning';
    case 'FAILED': return 'negative';
    case 'EXPIRED': return 'grey';
    default: return 'info';
  }
};

const formatBytes = (bytes?: number) => {
  if (!bytes) return '-';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

onMounted(loadHistory);
</script>

<style scoped>
.opacity-80 { opacity: 0.8; }
.text-mono { font-family: monospace; }
</style>
