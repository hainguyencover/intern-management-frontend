<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h5 text-weight-bold text-primary q-my-none">
          <q-icon name="hub" class="q-mr-sm" />
          Tích hợp hệ thống (Integration Hub)
        </h1>
        <div class="text-subtitle2 text-grey-7">
          Quản lý các kết nối HRM bên ngoài và thiết bị chấm công QR / Thẻ
        </div>
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="Thêm tích hợp"
        unelevated
        @click="openConfigModal()"
      />
    </div>

    <!-- Status Loading State -->
    <div v-if="store.loading" class="row justify-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <!-- Integration Cards Grid -->
    <div v-else class="row q-col-gutter-md">
      <div
        v-for="conn in store.connections"
        :key="conn.id"
        class="col-12 col-md-6 col-lg-4"
      >
        <q-card flat bordered class="integration-card shadow-1 hover-shadow">
          <q-card-section class="row items-center justify-between">
            <div class="row items-center">
              <q-avatar
                size="42px"
                :color="getIconBgColor(conn.integrationType)"
                text-color="white"
                class="q-mr-md"
              >
                <q-icon :name="getIconName(conn.integrationType)" />
              </q-avatar>
              <div>
                <div class="text-weight-bold text-subtitle1">{{ conn.name }}</div>
                <div class="text-caption text-grey-7">{{ conn.provider }} • {{ conn.code }}</div>
              </div>
            </div>
            <q-badge
              :color="getStatusColor(conn.status)"
              class="q-px-sm q-py-xs text-weight-medium"
            >
              {{ conn.status }}
            </q-badge>
          </q-card-section>

          <q-separator />

          <q-card-section class="text-body2 text-grey-8">
            <div class="row justify-between q-mb-xs">
              <span>URL máy chủ:</span>
              <span class="text-weight-bold text-primary">{{ conn.baseUrl || 'N/A' }}</span>
            </div>
            <div class="row justify-between q-mb-xs">
              <span>Đồng bộ gần nhất:</span>
              <span>{{ conn.lastSyncAt ? formatDate(conn.lastSyncAt) : 'Chưa đồng bộ' }}</span>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="between" class="q-px-md q-py-sm bg-grey-2">
            <q-btn
              flat
              dense
              color="primary"
              icon="sync"
              label="Đồng bộ ngay"
              :loading="syncingId === conn.id"
              @click="handleManualSync(conn)"
            />
            <div>
              <q-btn
                flat
                round
                dense
                icon="network_check"
                color="secondary"
                @click="handleTestConnection(conn.id)"
              >
                <q-tooltip>Kiểm tra kết nối</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                icon="history"
                color="amber-9"
                @click="viewHistory(conn.id)"
              >
                <q-tooltip>Xem lịch sử Sync</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                icon="edit"
                color="grey-8"
                @click="openConfigModal(conn)"
              >
                <q-tooltip>Chỉnh sửa cấu hình</q-tooltip>
              </q-btn>
            </div>
          </q-card-actions>
        </q-card>
      </div>

      <!-- Empty State -->
      <div v-if="store.connections.length === 0" class="col-12 text-center q-pa-xl">
        <q-icon name="cloud_off" size="64px" color="grey-5" />
        <div class="text-h6 text-grey-6 q-mt-md">Chưa có kết nối tích hợp nào</div>
        <div class="text-caption text-grey-5">Nhấn "Thêm tích hợp" để bắt đầu kết nối HRM hoặc thiết bị chấm công</div>
      </div>
    </div>

    <!-- Create/Edit Modal Dialog -->
    <q-dialog v-model="showModal">
      <q-card style="width: 500px; max-width: 90vw;">
        <q-card-section class="row items-center justify-between bg-primary text-white">
          <div class="text-h6">{{ isEdit ? 'Cấu hình tích hợp' : 'Thêm tích hợp mới' }}</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="form.code" label="Mã kết nối *" :disable="isEdit" outlined dense />
          <q-input v-model="form.name" label="Tên kết nối *" outlined dense />
          <q-select
            v-model="form.integrationType"
            :options="['HRM', 'ATTENDANCE_QR', 'ATTENDANCE_CARD']"
            label="Loại tích hợp *"
            outlined
            dense
          />
          <q-input v-model="form.provider" label="Nhà cung cấp (Provider) *" outlined dense />
          <q-input v-model="form.baseUrl" label="Base URL Endpoint" outlined dense />
          <q-input v-model="form.apiKey" label="API Key / Bearer Token" type="password" outlined dense />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Hủy" color="grey" v-close-popup />
          <q-btn color="primary" label="Lưu kết nối" unelevated @click="saveConnection" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useIntegrationStore } from '@/stores/integrationStore';
import type { IntegrationConnection, IntegrationType } from '@/types/integration';

const $q = useQuasar();
const router = useRouter();
const store = useIntegrationStore();

const syncingId = ref<number | null>(null);
const showModal = ref(false);
const isEdit = ref(false);
const currentId = ref<number | null>(null);

const form = ref({
  code: '',
  name: '',
  integrationType: 'HRM' as IntegrationType,
  provider: 'MISA',
  baseUrl: '',
  apiKey: ''
});

onMounted(() => {
  store.fetchConnections();
});

function getIconName(type: IntegrationType) {
  if (type === 'HRM') return 'people_alt';
  if (type === 'ATTENDANCE_QR') return 'qr_code_scanner';
  return 'badge';
}

function getIconBgColor(type: IntegrationType) {
  if (type === 'HRM') return 'indigo-7';
  if (type === 'ATTENDANCE_QR') return 'teal-7';
  return 'deep-orange-7';
}

function getStatusColor(status: string) {
  if (status === 'ACTIVE') return 'positive';
  if (status === 'ERROR') return 'negative';
  return 'grey-7';
}

function formatDate(dtStr: string) {
  if (!dtStr) return 'N/A';
  return new Date(dtStr).toLocaleString('vi-VN');
}

async function handleManualSync(conn: IntegrationConnection) {
  syncingId.value = conn.id;
  try {
    const job = await store.triggerSync(conn.id);
    $q.notify({
      type: 'positive',
      message: `Đã khởi tạo Sync Job #${job.id} cho ${conn.name}`
    });
    store.fetchConnections();
  } catch (err: any) {
    $q.notify({
      type: 'negative',
      message: err.message || 'Lỗi khi khởi tạo đồng bộ'
    });
  } finally {
    syncingId.value = null;
  }
}

async function handleTestConnection(id: number) {
  $q.loading.show({ message: 'Đang kiểm tra kết nối...' });
  try {
    const res = await store.testConnection(id);
    if (res.success) {
      $q.notify({
        type: 'positive',
        message: `${res.message} (${res.latencyMs}ms)`
      });
    } else {
      $q.notify({
        type: 'warning',
        message: res.message
      });
    }
    store.fetchConnections();
  } catch (err: any) {
    $q.notify({
      type: 'negative',
      message: 'Không thể kiểm tra kết nối'
    });
  } finally {
    $q.loading.hide();
  }
}

function viewHistory(connectionId: number) {
  router.push({ name: 'SyncHistoryPage', query: { connectionId: String(connectionId) } });
}

function openConfigModal(conn?: IntegrationConnection) {
  if (conn) {
    isEdit.value = true;
    currentId.value = conn.id;
    form.value = {
      code: conn.code,
      name: conn.name,
      integrationType: conn.integrationType,
      provider: conn.provider,
      baseUrl: conn.baseUrl || '',
      apiKey: ''
    };
  } else {
    isEdit.value = false;
    currentId.value = null;
    form.value = {
      code: 'HRM_' + Math.floor(1000 + Math.random() * 9000),
      name: '',
      integrationType: 'HRM',
      provider: 'MISA',
      baseUrl: 'https://api.hrm-provider.com/v1',
      apiKey: ''
    };
  }
  showModal.value = true;
}

async function saveConnection() {
  if (!form.value.name || !form.value.provider) {
    $q.notify({ type: 'warning', message: 'Vui lòng điền đủ thông tin bắt buộc' });
    return;
  }
  try {
    if (isEdit.value && currentId.value) {
      await store.updateConnection(currentId.value, {
        name: form.value.name,
        baseUrl: form.value.baseUrl,
        credentials: form.value.apiKey ? { apiKey: form.value.apiKey } : undefined
      });
      $q.notify({ type: 'positive', message: 'Cập nhật kết nối thành công' });
    } else {
      await store.createConnection({
        code: form.value.code,
        name: form.value.name,
        integrationType: form.value.integrationType,
        provider: form.value.provider,
        baseUrl: form.value.baseUrl,
        credentials: form.value.apiKey ? { apiKey: form.value.apiKey } : undefined
      });
      $q.notify({ type: 'positive', message: 'Tạo kết nối mới thành công' });
    }
    showModal.value = false;
    store.fetchConnections();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: err.message || 'Lỗi lưu cấu hình' });
  }
}
</script>

<style scoped>
.integration-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.integration-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
}
</style>
