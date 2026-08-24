<template>
  <div class="q-col-gutter-md row">
    <!-- Row 1: System Admin Operational Stat Cards -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="q-pa-sm bg-indigo-1 border-indigo">
        <q-card-section class="q-pa-sm">
          <div class="text-caption text-grey-8 text-bold">Tổng Người dùng Hệ thống</div>
          <div class="row items-center justify-between q-mt-xs">
            <div class="text-h4 text-bold text-indigo">{{ adminStats.totalUsers }}</div>
            <q-btn color="indigo" label="Quản lý Users" size="sm" to="/users" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="q-pa-sm bg-purple-1 border-purple">
        <q-card-section class="q-pa-sm">
          <div class="text-caption text-grey-8 text-bold">Phân quyền System Roles</div>
          <div class="row items-center justify-between q-mt-xs">
            <div class="text-h4 text-bold text-purple">{{ adminStats.totalRoles }} Roles</div>
            <q-btn color="purple" label="Roles & Perms" size="sm" to="/users" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="q-pa-sm bg-positive-1 border-positive">
        <q-card-section class="q-pa-sm">
          <div class="text-caption text-grey-8 text-bold">Trạng thái Hệ thống (System Health)</div>
          <div class="row items-center justify-between q-mt-xs">
            <q-chip color="positive" text-color="white" class="text-bold" size="md">
              <q-icon name="check_circle" class="q-mr-xs" /> HEALTHY
            </q-chip>
            <q-btn color="positive" label="Cấu hình" size="sm" to="/administration" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="q-pa-sm bg-blue-grey-1 border-blue-grey">
        <q-card-section class="q-pa-sm">
          <div class="text-caption text-grey-8 text-bold">Nhật ký Audit Security</div>
          <div class="row items-center justify-between q-mt-xs">
            <div class="text-h4 text-bold text-blue-grey-9">{{ adminStats.auditEventsCount }}</div>
            <q-btn color="blue-grey-9" label="Audit Logs" size="sm" to="/audit" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Row 2: User Role Distribution & System Health Details -->
    <div class="col-12 col-md-6">
      <q-card flat bordered class="full-height">
        <q-card-section>
          <div class="text-subtitle1 text-bold text-indigo flex items-center justify-between">
            <span>👥 Cơ cấu Tài khoản người dùng (User & Role Distribution)</span>
            <q-btn flat round dense icon="refresh" color="primary" @click="loadAdminStats" />
          </div>
          <q-separator class="q-my-sm" />

          <q-list separator class="text-body2">
            <q-item>
              <q-item-section avatar><q-icon name="admin_panel_settings" color="negative" /></q-item-section>
              <q-item-section>
                <q-item-label class="text-bold">System Administrators (ADMIN)</q-item-label>
                <q-item-label caption>Quản trị hệ thống, tài khoản, phân quyền RBAC & an ninh</q-item-label>
              </q-item-section>
              <q-item-section side><q-badge color="negative" class="text-bold">2 Users</q-badge></q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="business_center" color="primary" /></q-item-section>
              <q-item-section>
                <q-item-label class="text-bold">HR Managers (HR)</q-item-label>
                <q-item-label caption>Quản lý tuyển dụng, duyệt đơn, hợp đồng, phụ cấp & báo cáo</q-item-label>
              </q-item-section>
              <q-item-section side><q-badge color="primary" class="text-bold">5 Users</q-badge></q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="school" color="teal" /></q-item-section>
              <q-item-section>
                <q-item-label class="text-bold">Mentors (MENTOR)</q-item-label>
                <q-item-label caption>Hướng dẫn nhóm (Quota $\le 5$), giao task, review báo cáo, chấm điểm</q-item-label>
              </q-item-section>
              <q-item-section side><q-badge color="teal" class="text-bold">8 Users</q-badge></q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="face" color="amber-10" /></q-item-section>
              <q-item-section>
                <q-item-label class="text-bold">Interns / Candidates (INTERN)</q-item-label>
                <q-item-label caption>Thực tập sinh, ứng viên nộp đơn, check-in, nộp báo cáo tuần</q-item-label>
              </q-item-section>
              <q-item-section side><q-badge color="amber-10" class="text-bold">35 Users</q-badge></q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>

    <!-- Row 3: Recent Security & Administrative Audit Events -->
    <div class="col-12 col-md-6">
      <q-card flat bordered class="full-height">
        <q-card-section>
          <div class="text-subtitle1 text-bold text-blue-grey-9 flex items-center justify-between">
            <span>🛡️ Nhật ký An ninh & Thao tác Quản trị (Read-Only Audit)</span>
            <q-btn flat round dense icon="arrow_forward" color="primary" to="/audit" />
          </div>
          <q-separator class="q-my-sm" />

          <q-timeline color="indigo" dense class="q-px-sm">
            <q-timeline-entry title="Gán Role MENTOR cho User #USER-89" subtitle="Hôm nay 11:20" icon="security">
              <div>Admin vừa cập nhật vai trò phân quyền cho tài khoản mentor2@company.com.</div>
            </q-timeline-entry>
            <q-timeline-entry title="Thay đổi Cấu hình Email SMTP" subtitle="Hôm nay 09:15" icon="settings" color="purple">
              <div>Thay đổi thông số cấu hình cổng kết nối email thông báo hệ thống.</div>
            </q-timeline-entry>
            <q-timeline-entry title="Đăng nhập thành công Admin Console" subtitle="Hôm nay 08:30" icon="verified_user" color="positive">
              <div>Session đăng nhập của System Administrator được xác thực thành công.</div>
            </q-timeline-entry>
          </q-timeline>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiClient as api } from '../../../shared/api/client';

const adminStats = ref({
  totalUsers: 50,
  totalRoles: 4,
  auditEventsCount: 142
});

async function loadAdminStats() {
  try {
    const usersRes = await api.get('/api/v1/admin/users').catch(() => null);
    if (usersRes && usersRes.data && usersRes.data.data) {
      const list = usersRes.data.data.content || usersRes.data.data;
      if (Array.isArray(list)) adminStats.value.totalUsers = list.length;
    }

    const auditRes = await api.get('/api/v1/admin/audit-logs').catch(() => null);
    if (auditRes && auditRes.data && auditRes.data.data) {
      const list = auditRes.data.data.content || auditRes.data.data;
      if (Array.isArray(list)) adminStats.value.auditEventsCount = list.length;
    }
  } catch (err) {
  }
}

onMounted(() => {
  loadAdminStats();
});
</script>

<style scoped>
.border-indigo { border-left: 4px solid #3F51B5; }
.border-purple { border-left: 4px solid #9C27B0; }
.border-positive { border-left: 4px solid #2E7D32; }
.border-blue-grey { border-left: 4px solid #607D8B; }
</style>
