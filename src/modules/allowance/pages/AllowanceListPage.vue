<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h1 class="text-h5 text-bold q-my-none text-primary">Quản lý Phụ cấp (Allowances)</h1>
        <p class="text-caption text-grey-7 q-mb-none">Gán, theo dõi và xác nhận chi trả trợ cấp cho Thực tập sinh</p>
      </div>
      <q-btn v-if="!isIntern" color="primary" icon="add" label="Gán phụ cấp" @click="openCreateDialog" />
    </div>

    <!-- Data Table -->
    <q-card flat bordered>
      <q-table
        :rows="allowances"
        :columns="columns"
        row-key="id"
        :loading="loading"
        flat
        bordered
      >
        <template #body-cell-amount="props">
          <q-td :props="props" class="text-bold text-positive">
            {{ formatCurrency(props.value) }}
          </q-td>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <q-chip dense :color="props.value === 'PAID' ? 'positive' : 'warning'" text-color="white" size="sm">
              {{ props.value === 'PAID' ? 'Đã chi trả' : 'Chưa chi trả' }}
            </q-chip>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn v-if="!isIntern && props.row.status !== 'PAID'" flat round dense icon="monetization_on" color="positive" @click="markAsPaid(props.row.id)">
              <q-tooltip>Xác nhận Đã chuyển khoản (Mark Paid)</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Create Allowance Dialog (HR/Admin) -->
    <q-dialog v-model="showCreateDialog">
      <q-card style="min-width: 450px">
        <q-card-section class="row items-center">
          <div class="text-h6 text-bold">Gán Phụ cấp cho TTS</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="saveAllowance" class="q-gutter-md">
            <q-input v-model.number="form.internId" label="ID Thực tập sinh *" type="number" outlined dense :rules="[val => !!val || 'Bắt buộc']" />
            <q-input v-model.number="form.amount" label="Số tiền phụ cấp (VNĐ) *" type="number" outlined dense prefix="₫" :rules="[val => val > 0 || 'Số tiền phải > 0']" />
            <q-input v-model="form.allowanceMonth" label="Tháng áp dụng *" type="date" outlined dense stack-label :rules="[val => !!val || 'Bắt buộc']" />
            <q-input v-model="form.notes" label="Ghi chú" type="textarea" outlined dense rows="2" />
            <div class="row justify-end q-mt-md">
              <q-btn label="Hủy" flat v-close-popup class="q-mr-sm" />
              <q-btn label="Lưu phụ cấp" color="primary" type="submit" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { apiClient as api } from '../../../shared/api/client';
import { useAuthStore } from '../../auth/store/authStore';

const $q = useQuasar();
const authStore = useAuthStore();

const isIntern = computed(() => authStore.roles.includes('ROLE_INTERN') || authStore.roles.includes('INTERN'));
const loading = ref(false);
const saving = ref(false);
const showCreateDialog = ref(false);
const allowances = ref([]);

const form = ref({
  internId: 1,
  amount: 3000000,
  allowanceMonth: new Date().toISOString().substring(0, 10),
  notes: 'Trợ cấp thực tập hàng tháng'
});

const columns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'internName', label: 'Họ tên TTS', field: 'internName', align: 'left' },
  { name: 'allowanceMonth', label: 'Tháng', field: 'allowanceMonth', align: 'center' },
  { name: 'amount', label: 'Số tiền', field: 'amount', align: 'right', sortable: true },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' },
  { name: 'notes', label: 'Ghi chú', field: 'notes', align: 'left' },
  { name: 'actions', label: 'Thao tác', field: 'actions', align: 'right' }
];

function formatCurrency(val: number) {
  if (!val) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
}

async function loadAllowances() {
  loading.value = true;
  try {
    const endpoint = isIntern.value ? '/api/v1/allowances/me' : '/api/v1/allowances';
    const res = await api.get(endpoint);
    if (res.data && res.data.data) {
      allowances.value = res.data.data.content || res.data.data;
    }
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Không thể tải lịch sử phụ cấp' });
  } finally {
    loading.value = false;
  }
}

function openCreateDialog() {
  form.value = {
    internId: 1,
    amount: 3000000,
    allowanceMonth: new Date().toISOString().substring(0, 10),
    notes: 'Trợ cấp thực tập hàng tháng'
  };
  showCreateDialog.value = true;
}

async function saveAllowance() {
  saving.value = true;
  try {
    await api.post('/api/v1/allowances', form.value);
    $q.notify({ type: 'positive', message: 'Tạo phụ cấp thành công' });
    showCreateDialog.value = false;
    await loadAllowances();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Tạo phụ cấp thất bại' });
  } finally {
    saving.value = false;
  }
}

async function markAsPaid(id: number) {
  try {
    await api.put(`/api/v1/allowances/${id}/mark-paid`);
    $q.notify({ type: 'positive', message: 'Đã cập nhật trạng thái Đã chi trả' });
    await loadAllowances();
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Cập nhật thất bại' });
  }
}

onMounted(() => {
  loadAllowances();
});
</script>
