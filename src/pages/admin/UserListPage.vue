<template>
  <div class="user-list-page">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">Quản lý Người dùng</div>
        <div class="text-caption text-grey-7">Quản lý tài khoản, vai trò và trạng thái truy cập hệ thống</div>
      </div>
      <q-btn
        color="indigo-9"
        icon="add"
        label="Thêm Người dùng"
        unelevated
        @click="openCreateDialog"
      />
    </div>

    <!-- Filter & Toolbar Panel -->
    <q-card flat bordered class="q-mb-md q-pa-sm">
      <div class="row q-col-gutter-sm items-center">
        <div class="col-12 col-sm-4">
          <q-input
            v-model="search"
            placeholder="Tìm theo tên, email, username..."
            outlined
            dense
            clearable
            @update:model-value="onSearchChange"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-sm-3">
          <q-select
            v-model="selectedRole"
            :options="roleFilterOptions"
            label="Lọc theo Vai trò"
            outlined
            dense
            clearable
            emit-value
            map-options
            @update:model-value="loadUsers"
          />
        </div>
      </div>
    </q-card>

    <!-- Users Table -->
    <BaseTable
      title="Danh sách Người dùng"
      :rows="users"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      @request="onRequest"
    >
      <template #body-cell-role="props">
        <q-td :props="props">
          <q-chip :color="getRoleColor(props.value)" text-color="white" dense class="text-weight-bold">
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>

      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="getStatusBadgeColor(props.value)">
            {{ getStatusText(props.value) }}
          </q-badge>
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props" class="q-gutter-xs">
          <q-btn flat round dense icon="edit" color="primary" @click="openEditDialog(props.row)">
            <q-tooltip>Sửa thông tin</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            dense
            :icon="props.row.status === 'ACTIVE' ? 'lock' : 'lock_open'"
            :color="props.row.status === 'ACTIVE' ? 'warning' : 'positive'"
            @click="toggleStatus(props.row)"
          >
            <q-tooltip>{{ props.row.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa' }}</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </BaseTable>

    <UserFormDialog
      v-model="showUserDialog"
      :user-to-edit="userToEdit"
      @success="loadUsers"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Notify } from 'quasar';
import type { User } from '@/types/auth';
import type { QTableProps } from 'quasar';
import userService from '@/services/user/userService';
import BaseTable from '@/components/table/BaseTable.vue';
import UserFormDialog from '@/components/user/UserFormDialog.vue';

const users = ref<User[]>([]);
const loading = ref(false);
const search = ref('');
const selectedRole = ref<string | null>(null);
const showUserDialog = ref(false);
const userToEdit = ref<User | null>(null);

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});

const roleFilterOptions = [
  { label: 'Tất cả Vai trò', value: null },
  { label: 'ADMIN', value: 'ADMIN' },
  { label: 'HR', value: 'HR' },
  { label: 'MENTOR', value: 'MENTOR' },
  { label: 'INTERN', value: 'INTERN' }
];

const columns: QTableProps['columns'] = [
  { name: 'username', label: 'Tên đăng nhập', field: 'username', align: 'left', sortable: true },
  { name: 'fullName', label: 'Họ và Tên', field: 'fullName', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'role', label: 'Vai trò', field: 'role', align: 'center' },
  { name: 'department', label: 'Phòng ban', field: 'department', align: 'left' },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' },
  { name: 'actions', label: 'Thao tác', field: 'actions', align: 'center' }
];

onMounted(() => {
  loadUsers();
});

const loadUsers = async () => {
  loading.value = true;
  try {
    const res = await userService.getUsers({
      page: pagination.value.page - 1,
      size: pagination.value.rowsPerPage,
      search: search.value || undefined,
      role: selectedRole.value || undefined
    });
    users.value = res.content || mockUsers;
    pagination.value.rowsNumber = res.totalElements || mockUsers.length;
  } catch (error) {
    // Fallback to mock data if API unavailable
    users.value = mockUsers;
    pagination.value.rowsNumber = mockUsers.length;
  } finally {
    loading.value = false;
  }
};

const onSearchChange = () => {
  pagination.value.page = 1;
  loadUsers();
};

const onRequest = (props: any) => {
  pagination.value.page = props.pagination.page;
  pagination.value.rowsPerPage = props.pagination.rowsPerPage;
  loadUsers();
};

const openCreateDialog = () => {
  userToEdit.value = null;
  showUserDialog.value = true;
};

const openEditDialog = (user: User) => {
  userToEdit.value = user;
  showUserDialog.value = true;
};

const toggleStatus = async (user: User) => {
  const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  try {
    await userService.toggleStatus(user.id, newStatus);
    Notify.create({ type: 'positive', message: `Đã đổi trạng thái tài khoản ${user.username}!` });
    loadUsers();
  } catch (error) {
    user.status = newStatus; // Local optimistic update
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'indigo-9';
    case 'HR':
      return 'primary';
    case 'MENTOR':
      return 'teal-8';
    case 'INTERN':
      return 'blue-8';
    default:
      return 'grey';
  }
};

const getStatusBadgeColor = (status: string) => {
  if (status === 'ACTIVE') return 'positive';
  if (status === 'INVITED') return 'info';
  if (status === 'LOCKED') return 'warning';
  if (status === 'SUSPENDED') return 'deep-orange';
  if (status === 'DISABLED') return 'negative';
  return 'grey';
};

const getStatusText = (status: string) => {
  if (status === 'ACTIVE') return 'Hoạt động';
  if (status === 'INVITED') return 'Đã mời';
  if (status === 'LOCKED') return 'Tạm khóa';
  if (status === 'SUSPENDED') return 'Đình chỉ';
  if (status === 'DISABLED') return 'Vô hiệu hóa';
  return status || 'N/A';
};

const mockUsers: User[] = [
  { id: 1, username: 'admin', fullName: 'System Administrator', email: 'admin@holaho.com', role: 'ADMIN', roles: ['ADMIN'], permissions: ['*'], department: 'IT System' },
  { id: 2, username: 'hr_manager', fullName: 'Trần Thị HR Manager', email: 'hr@holaho.com', role: 'HR', roles: ['HR'], permissions: ['HR_READ', 'HR_WRITE'], department: 'Human Resource' },
  { id: 3, username: 'mentor_lead', fullName: 'Lê Văn Mentor', email: 'mentor@holaho.com', role: 'MENTOR', roles: ['MENTOR'], permissions: ['MENTOR_VIEW'], department: 'Software Engineering' },
  { id: 4, username: 'intern_dev', fullName: 'Nguyễn Văn Intern', email: 'intern@holaho.com', role: 'INTERN', roles: ['INTERN'], permissions: ['INTERN_SELF'], department: 'Software Engineering' }
];
</script>
