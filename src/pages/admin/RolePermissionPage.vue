<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h5 text-weight-bold text-primary q-my-none">
          <q-icon name="security" class="q-mr-sm" />
          Quản lý Vai trò & Phân quyền (RBAC Matrix)
        </h1>
        <div class="text-subtitle2 text-grey-7">
          Cấu hình Ma trận Quyền hạn (Permissions Matrix) cho từng vai trò trong hệ thống
        </div>
      </div>
      <q-btn
        color="primary"
        icon="save"
        label="Lưu phân quyền"
        unelevated
        :loading="saving"
        @click="savePermissions"
      />
    </div>

    <div class="row q-col-gutter-md">
      <!-- Role List Side Panel -->
      <div class="col-12 col-md-3">
        <q-card flat bordered class="shadow-1">
          <q-card-section class="bg-primary text-white">
            <div class="text-subtitle1 text-weight-bold">Danh sách Vai trò</div>
          </q-card-section>
          <q-list separator>
            <q-item
              v-for="role in roles"
              :key="role.id"
              clickable
              :active="selectedRoleId === role.id"
              active-class="bg-blue-1 text-primary text-weight-bold"
              @click="selectRole(role)"
            >
              <q-item-section avatar>
                <q-icon :name="getRoleIcon(role.code)" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ role.name }}</q-item-label>
                <q-item-label caption>{{ role.code }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="grey-6">{{ role.permissions?.length || 0 }} quyền</q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- Permission Matrix Content Panel -->
      <div class="col-12 col-md-9">
        <q-card flat bordered class="shadow-1">
          <q-card-section class="row items-center justify-between bg-grey-2">
            <div>
              <div class="text-h6 text-primary text-weight-bold">
                Quyền hạn cho vai trò: {{ currentRole?.name }} ({{ currentRole?.code }})
              </div>
              <div class="text-caption text-grey-7">Đánh dấu chọn các quyền được phép thực thi</div>
            </div>
            <div>
              <q-btn flat dense label="Chọn tất cả" color="primary" class="q-mr-sm" @click="selectAll" />
              <q-btn flat dense label="Bỏ chọn tất cả" color="grey-7" @click="deselectAll" />
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-none">
            <q-table
              :rows="allPermissions"
              :columns="columns"
              row-key="id"
              flat
              bordered
              :pagination="{ rowsPerPage: 20 }"
            >
              <template v-slot:body-cell-granted="props">
                <q-td :props="props" class="text-center">
                  <q-checkbox
                    v-model="selectedPermissionIds"
                    :val="props.row.id"
                    color="primary"
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-code="props">
                <q-td :props="props">
                  <q-chip dense color="blue-1" text-color="primary" class="text-weight-bold">
                    {{ props.value }}
                  </q-chip>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import apiClient from '@/services/api/apiClient';

const $q = useQuasar();

const roles = ref<any[]>([]);
const allPermissions = ref<any[]>([]);
const selectedRoleId = ref<number | null>(null);
const currentRole = ref<any>(null);
const selectedPermissionIds = ref<number[]>([]);
const saving = ref(false);

const columns: any[] = [
  { name: 'granted', label: 'Cho phép', field: 'granted', align: 'center', style: 'width: 100px' },
  { name: 'code', label: 'Mã Quyền (Code)', field: 'code', align: 'left', style: 'width: 220px' },
  { name: 'name', label: 'Tên Quyền hạn', field: 'name', align: 'left' },
  { name: 'description', label: 'Mô tả', field: 'description', align: 'left' }
];

onMounted(async () => {
  await loadData();
});

async function loadData() {
  try {
    const [rolesRes, permsRes] = await Promise.all([
      apiClient.get('/admin/roles'),
      apiClient.get('/admin/permissions')
    ]);

    roles.value = rolesRes.data.data || rolesRes.data;
    allPermissions.value = permsRes.data.data || permsRes.data;

    if (roles.value.length > 0) {
      selectRole(roles.value[0]);
    }
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Lỗi tải dữ liệu RBAC Matrix' });
  }
}

async function selectRole(role: any) {
  selectedRoleId.value = role.id;
  currentRole.value = role;

  try {
    const res = await apiClient.get(`/admin/roles/${role.id}/permissions`);
    const roleDetails = res.data.data || res.data;
    const perms = roleDetails.permissions || [];
    selectedPermissionIds.value = perms.map((p: any) => p.id);
  } catch (err: any) {
    selectedPermissionIds.value = [];
  }
}

function getRoleIcon(code: string) {
  if (code === 'ADMIN') return 'admin_panel_settings';
  if (code === 'HR') return 'badge';
  if (code === 'MENTOR') return 'supervisor_account';
  return 'school';
}

function selectAll() {
  selectedPermissionIds.value = allPermissions.value.map(p => p.id);
}

function deselectAll() {
  selectedPermissionIds.value = [];
}

async function savePermissions() {
  if (!selectedRoleId.value) return;

  saving.value = true;
  try {
    await apiClient.put(`/admin/roles/${selectedRoleId.value}/permissions`, {
      permissionIds: selectedPermissionIds.value
    });
    $q.notify({ type: 'positive', message: 'Cập nhật phân quyền thành công' });
    await loadData();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Lỗi khi lưu phân quyền' });
  } finally {
    saving.value = false;
  }
}
</script>
