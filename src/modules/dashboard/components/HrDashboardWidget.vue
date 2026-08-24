<template>
  <div class="q-col-gutter-md row">
    <!-- Row 1: HR Operational Stat Cards -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="q-pa-sm bg-blue-1 border-blue">
        <q-card-section class="q-pa-sm">
          <div class="text-caption text-grey-8 text-bold">Đơn ứng tuyển chờ duyệt</div>
          <div class="row items-center justify-between q-mt-xs">
            <div class="text-h4 text-bold text-primary">{{ hrStats.pendingApplications }}</div>
            <q-btn color="primary" label="Xét duyệt" size="sm" to="/applications" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="q-pa-sm bg-purple-1 border-purple">
        <q-card-section class="q-pa-sm">
          <div class="text-caption text-grey-8 text-bold">Hợp đồng chờ HR xác nhận</div>
          <div class="row items-center justify-between q-mt-xs">
            <div class="text-h4 text-bold text-purple">{{ hrStats.pendingContracts }}</div>
            <q-btn color="purple" label="Xác nhận" size="sm" to="/documents" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="q-pa-sm bg-teal-1 border-teal">
        <q-card-section class="q-pa-sm">
          <div class="text-caption text-grey-8 text-bold">Chương trình đang mở</div>
          <div class="row items-center justify-between q-mt-xs">
            <div class="text-h4 text-bold text-teal">{{ hrStats.activePrograms }}</div>
            <q-btn color="teal" label="Quản lý" size="sm" to="/programs" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="q-pa-sm bg-amber-1 border-amber">
        <q-card-section class="q-pa-sm">
          <div class="text-caption text-grey-8 text-bold">Thực tập sinh đang hoạt động</div>
          <div class="row items-center justify-between q-mt-xs">
            <div class="text-h4 text-bold text-amber-10">{{ hrStats.activeInterns }}</div>
            <q-btn color="amber-10" label="Hồ sơ" size="sm" to="/interns" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Row 2: Pending HR Actions Workspace -->
    <div class="col-12 col-md-7">
      <q-card flat bordered class="full-height">
        <q-card-section>
          <div class="text-subtitle1 text-bold text-primary flex items-center justify-between">
            <span>⚡ Việc cần HR Xử lý ngay (Pending HR Actions)</span>
            <q-badge color="negative" class="text-bold">{{ pendingActions.length }} Việc cần làm</q-badge>
          </div>
          <q-separator class="q-my-sm" />

          <q-list separator v-if="pendingActions.length">
            <q-item v-for="action in pendingActions" :key="action.id" class="q-py-xs">
              <q-item-section avatar>
                <q-icon :name="action.icon" :color="action.color" size="sm" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-bold">{{ action.title }}</q-item-label>
                <q-item-label caption>{{ action.subtitle }} • <span class="text-grey-6">{{ action.time }}</span></q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn dense size="sm" :color="action.color" :label="action.btnLabel" :to="action.to" />
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-caption text-grey-7 text-center q-pa-md">Không có công việc đọng chờ xử lý.</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Row 3: Recent Activity Stream & Quick Operations -->
    <div class="col-12 col-md-5">
      <q-card flat bordered class="full-height">
        <q-card-section>
          <div class="text-subtitle1 text-bold text-grey-9 flex items-center justify-between">
            <span>📋 Hoạt động Tuyển dụng & Thực tập</span>
            <q-btn flat round dense icon="refresh" color="primary" @click="loadHrStats" />
          </div>
          <q-separator class="q-my-sm" />

          <q-timeline color="primary" dense class="q-px-sm">
            <q-timeline-entry title="Ứng viên nộp đơn mới" subtitle="10 phút trước" icon="how_to_vote">
              <div>Ứng viên Nguyễn Văn A vừa nộp đơn vị trí Software Engineer Intern.</div>
            </q-timeline-entry>
            <q-timeline-entry title="Hợp đồng thực tập được gửi" subtitle="1 giờ trước" icon="description" color="secondary">
              <div>HR vừa tải lên hợp đồng cho ứng viên Trần Thị B.</div>
            </q-timeline-entry>
            <q-timeline-entry title="Nộp báo cáo tuần đúng hạn" subtitle="2 giờ trước" icon="task" color="positive">
              <div>Thực tập sinh Lê Văn C vừa hoàn thành báo cáo tuần 4.</div>
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

const hrStats = ref({
  pendingApplications: 5,
  pendingContracts: 2,
  activePrograms: 4,
  activeInterns: 28
});

const pendingActions = ref([
  { id: 1, title: 'Đơn ứng tuyển #APP-1024 cần xét duyệt', subtitle: 'Vị trí: Software Engineer Intern', time: 'Mới gửi', icon: 'how_to_vote', color: 'primary', btnLabel: 'Xét duyệt', to: '/applications' },
  { id: 2, title: 'Đơn ứng tuyển #APP-1025 cần xét duyệt', subtitle: 'Vị trí: Frontend Vue.js Intern', time: '15 phút trước', icon: 'how_to_vote', color: 'primary', btnLabel: 'Xét duyệt', to: '/applications' },
  { id: 3, title: 'Hợp đồng #CTR-0081 chờ HR xác nhận', subtitle: 'Ứng viên: Lê Thị D', time: '1 giờ trước', icon: 'description', color: 'purple', btnLabel: 'Xác nhận', to: '/documents' },
  { id: 4, title: 'Ticket hỗ trợ #TCK-0012 cần phản hồi', subtitle: 'Danh mục: Giấy xác nhận thực tập', time: '2 giờ trước', icon: 'headset_mic', color: 'orange-9', btnLabel: 'Trả lời', to: '/tickets' }
]);

async function loadHrStats() {
  try {
    const appsRes = await api.get('/api/v1/applications', { params: { status: 'SUBMITTED' } }).catch(() => null);
    if (appsRes && appsRes.data && appsRes.data.data) {
      const list = appsRes.data.data.content || appsRes.data.data;
      if (Array.isArray(list)) hrStats.value.pendingApplications = list.length;
    }

    const progsRes = await api.get('/api/v1/programs').catch(() => null);
    if (progsRes && progsRes.data && progsRes.data.data) {
      const list = progsRes.data.data.content || progsRes.data.data;
      if (Array.isArray(list)) hrStats.value.activePrograms = list.length;
    }
  } catch (err) {
  }
}

onMounted(() => {
  loadHrStats();
});
</script>

<style scoped>
.border-blue { border-left: 4px solid #1976D2; }
.border-purple { border-left: 4px solid #9C27B0; }
.border-teal { border-left: 4px solid #009688; }
.border-amber { border-left: 4px solid #FFC107; }
</style>
