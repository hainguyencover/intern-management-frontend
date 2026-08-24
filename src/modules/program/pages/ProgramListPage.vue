<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h1 class="text-h5 text-bold q-my-none text-primary">Chương trình Thực tập</h1>
        <p class="text-caption text-grey-7 q-mb-none">Quản lý và lập kế hoạch các đợt thực tập doanh nghiệp</p>
      </div>
      <q-btn color="primary" icon="add" label="Tạo chương trình" @click="openCreateDialog" />
    </div>

    <!-- Filter Card -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section class="row q-col-gutter-md items-center">
        <div class="col-12 col-md-4">
          <q-input v-model="keyword" dense outlined placeholder="Tìm kiếm chương trình..." @keyup.enter="loadPrograms">
            <template #append>
              <q-icon name="search" class="cursor-pointer" @click="loadPrograms" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-3">
          <q-select
            v-model="statusFilter"
            dense
            outlined
            emit-value
            map-options
            :options="statusOptions"
            label="Trạng thái"
            @update:model-value="loadPrograms"
          />
        </div>
        <div class="col-12 col-md-2">
          <q-btn outline color="primary" label="Làm mới" icon="refresh" class="full-width" @click="loadPrograms" />
        </div>
      </q-card-section>
    </q-card>

    <!-- Table Card -->
    <q-card flat bordered>
      <q-table
        :rows="programs"
        :columns="columns"
        row-key="id"
        :loading="loading"
        flat
        bordered
      >
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-chip
              dense
              :color="getStatusColor(props.value)"
              text-color="white"
              size="sm"
            >
              {{ props.value }}
            </q-chip>
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn flat round dense icon="edit" color="primary" @click="openEditDialog(props.row)" />
            <q-btn flat round dense icon="delete" color="negative" @click="deleteProgram(props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Create/Edit Dialog -->
    <q-dialog v-model="showDialog">
      <q-card style="min-width: 450px">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ isEdit ? 'Cập nhật' : 'Tạo mới' }} Chương trình</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="saveProgram" class="q-gutter-md">
            <q-input v-model="form.name" label="Tên chương trình *" outlined dense :rules="[val => !!val || 'Bắt đầu bắt buộc']" />
            <q-input v-model="form.description" label="Mô tả" type="textarea" outlined dense rows="3" />
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <q-input v-model="form.startDate" label="Ngày bắt đầu *" type="date" outlined dense stack-label />
              </div>
              <div class="col-6">
                <q-input v-model="form.endDate" label="Ngày kết thúc *" type="date" outlined dense stack-label />
              </div>
            </div>
            <div class="row justify-end q-mt-md">
              <q-btn label="Hủy" flat v-close-popup class="q-mr-sm" />
              <q-btn label="Lưu" color="primary" type="submit" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { apiClient as api } from '../../../shared/api/client';

const $q = useQuasar();
const loading = ref(false);
const saving = ref(false);
const showDialog = ref(false);
const isEdit = ref(false);
const editId = ref<number | null>(null);

const keyword = ref('');
const statusFilter = ref('');
const programs = ref([]);

const statusOptions = [
  { label: 'Tất cả', value: '' },
  { label: 'ACTIVE', value: 'ACTIVE' },
  { label: 'DRAFT', value: 'DRAFT' },
  { label: 'CLOSED', value: 'CLOSED' }
];

const columns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'name', label: 'Tên Chương trình', field: 'name', align: 'left', sortable: true },
  { name: 'departmentName', label: 'Phòng ban', field: 'departmentName', align: 'left' },
  { name: 'startDate', label: 'Bắt đầu', field: 'startDate', align: 'center' },
  { name: 'endDate', label: 'Kết thúc', field: 'endDate', align: 'center' },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' },
  { name: 'actions', label: 'Thao tác', field: 'actions', align: 'right' }
];

const form = ref({
  name: '',
  departmentId: 1,
  description: '',
  startDate: '',
  endDate: ''
});

function getStatusColor(status: string) {
  switch (status) {
    case 'ACTIVE': return 'positive';
    case 'DRAFT': return 'warning';
    case 'CLOSED': return 'grey';
    default: return 'primary';
  }
}

async function loadPrograms() {
  loading.value = true;
  try {
    const res = await api.get('/api/v1/programs', {
      params: { keyword: keyword.value, status: statusFilter.value || undefined }
    });
    if (res.data && res.data.data) {
      programs.value = res.data.data.content || res.data.data;
    }
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Không thể tải danh sách chương trình' });
  } finally {
    loading.value = false;
  }
}

function openCreateDialog() {
  isEdit.value = false;
  editId.value = null;
  form.value = { name: '', departmentId: 1, description: '', startDate: '', endDate: '' };
  showDialog.value = true;
}

function openEditDialog(row: any) {
  isEdit.value = true;
  editId.value = row.id;
  form.value = {
    name: row.name,
    departmentId: row.departmentId || 1,
    description: row.description || '',
    startDate: row.startDate || '',
    endDate: row.endDate || ''
  };
  showDialog.value = true;
}

async function saveProgram() {
  saving.value = true;
  try {
    if (isEdit.value && editId.value) {
      await api.put(`/api/v1/programs/${editId.value}`, form.value);
    } else {
      await api.post('/api/v1/programs', form.value);
    }
    $q.notify({ type: 'positive', message: 'Lưu chương trình thành công' });
    showDialog.value = false;
    await loadPrograms();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: err?.response?.data?.error?.message || 'Thao tác thất bại' });
  } finally {
    saving.value = false;
  }
}

async function deleteProgram(id: number) {
  $q.dialog({
    title: 'Xác nhận xóa',
    message: 'Bạn có chắc chắn muốn xóa chương trình này?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/api/v1/programs/${id}`);
      $q.notify({ type: 'positive', message: 'Xóa thành công' });
      await loadPrograms();
    } catch (err: any) {
      $q.notify({ type: 'negative', message: 'Không thể xóa chương trình' });
    }
  });
}

onMounted(() => {
  loadPrograms();
});
</script>
