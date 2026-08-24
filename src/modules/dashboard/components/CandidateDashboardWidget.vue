<template>
  <div class="q-gutter-y-lg">
    <!-- Candidate Header Card -->
    <q-card flat bordered class="q-pa-lg bg-white shadow-3 rounded-borders-lg">
      <div class="row items-center justify-between">
        <div class="row items-center q-gutter-x-md">
          <q-avatar size="64px" color="primary" text-color="white" icon="badge" />
          <div>
            <div class="text-h5 text-bold flex items-center">
              Xin chào, {{ authStore.user?.fullName }}
              <q-chip color="orange-9" text-color="white" size="sm" class="q-ml-sm text-bold">
                TÀI KHOẢN ỨNG VIÊN
              </q-chip>
            </div>
            <div class="text-subtitle2 text-grey-7">
              {{ authStore.user?.email }}
            </div>
          </div>
        </div>

        <q-btn
          v-if="!hasSubmittedApp"
          color="primary"
          label="Nộp hồ sơ ứng tuyển ngay"
          icon="post_add"
          class="text-bold q-px-lg"
          unelevated
          to="/applications/new"
        />
      </div>
    </q-card>

    <!-- Application Status Banner (US-053 & US-050) -->
    <q-card flat bordered class="q-pa-md bg-white shadow-2 rounded-borders">
      <div class="text-subtitle1 text-bold q-mb-sm flex items-center">
        <q-icon name="how_to_vote" color="primary" class="q-mr-xs" size="24px" />
        Trạng thái Hồ sơ Ứng tuyển & Kết quả Xét duyệt (US-053)
      </div>

      <div v-if="hasSubmittedApp" class="q-pa-md bg-blue-1 rounded-borders border-blue">
        <div class="row items-center justify-between">
          <div>
            <div class="text-subtitle1 text-bold text-primary">
              Mã hồ sơ: APP-{{ currentApp?.id || latestResult?.applicationId || '2026' }}
            </div>
            <div class="text-caption text-grey-8 q-mt-xs">
              Chương trình: <strong>{{ latestResult?.programName || currentApp?.programName || 'Software Engineer Intern' }}</strong> | Vị trí: <strong>{{ latestResult?.position || currentApp?.position }}</strong>
            </div>
          </div>
          <q-chip :color="statusChipColor" text-color="white" class="text-bold">
            {{ currentAppStatus }}
          </q-chip>
        </div>

        <!-- US-009/US-010 Contract Sent Banner -->
        <q-banner v-if="currentAppStatus === 'CONTRACT_SENT'" class="bg-indigo-1 text-indigo-10 q-mt-md rounded-borders border-indigo">
          <template #avatar>
            <q-icon name="assignment_turned_in" color="indigo" size="28px" />
          </template>
          <div class="text-bold text-subtitle2">HR đã gửi Hợp đồng Thực tập!</div>
          <div>Bạn có 1 hợp đồng thực tập mới từ Bộ phận Nhân sự HR. Vui lòng nhấn vào bên dưới để xem file PDF và **Ký xác nhận online (BR-07)**.</div>
          <div class="q-mt-sm">
            <q-btn color="indigo" label="Xem & Ký hợp đồng online ngay" icon="draw" unelevated to="/documents?tab=contracts" />
          </div>
        </q-banner>

        <!-- US-050 Revision Alert Banner -->
        <q-banner v-else-if="currentAppStatus === 'NEEDS_REVISION'" class="bg-orange-2 text-orange-10 q-mt-md rounded-borders border-orange">
          <template #avatar>
            <q-icon name="warning" color="warning" size="28px" />
          </template>
          <div class="text-bold text-subtitle2">Ghi chú Yêu cầu Bổ sung từ HR:</div>
          <div>{{ latestResult?.reviewComment || currentApp?.note || 'Vui lòng bổ sung/cập nhật thông tin CV và bấm Nộp lại.' }}</div>
          <div class="q-mt-sm">
            <q-btn color="warning" label="Nộp lại hồ sơ (Resubmit)" icon="published_with_changes" unelevated :loading="resubmitting" @click="resubmitApplication" />
          </div>
        </q-banner>

        <!-- US-053 Detailed Result Step -->
        <q-banner v-else class="bg-white text-dark q-mt-md rounded-borders">
          <template #avatar>
            <q-icon :name="isApproved ? 'check_circle' : (currentAppStatus === 'REJECTED' ? 'cancel' : 'info')" :color="isApproved ? 'positive' : (currentAppStatus === 'REJECTED' ? 'negative' : 'info')" />
          </template>
          <div :class="isApproved ? 'text-bold text-positive' : (currentAppStatus === 'REJECTED' ? 'text-bold text-negative' : '')">
            {{ latestResult?.nextStep || (isApproved ? 'Chúc mừng! Hồ sơ ứng tuyển của bạn đã được HR phê duyệt thành công.' : 'Hệ thống đã ghi nhận hồ sơ của bạn. Bộ phận Tuyển dụng đang xét duyệt.') }}
          </div>
          <div v-if="latestResult?.reviewComment" class="text-caption text-grey-8 q-mt-xs bg-grey-2 q-pa-xs rounded-borders">
            <strong>Ghi chú từ HR / Người đánh giá:</strong> {{ latestResult.reviewComment }}
          </div>
        </q-banner>
      </div>

      <div v-else class="text-center q-pa-lg bg-grey-2 rounded-borders">
        <q-icon name="assignment_late" color="warning" size="48px" />
        <div class="text-subtitle1 text-bold q-mt-sm">Bạn chưa hoàn tất nộp hồ sơ ứng tuyển</div>
        <div class="text-caption text-grey-7 q-mb-md">Vui lòng chọn chương trình thực tập và đính kèm CV để tham gia đợt tuyển dụng mới nhất.</div>
        <q-btn color="primary" label="Nộp hồ sơ ngay" icon="add_circle" unelevated to="/applications/new" />
      </div>
    </q-card>

    <!-- Candidate Journey Progress Timeline -->
    <q-card flat bordered class="q-pa-md bg-white shadow-2 rounded-borders">
      <div class="text-subtitle1 text-bold q-mb-md">Lộ trình Tuyển dụng & Giai đoạn</div>

      <q-timeline color="primary" dense>
        <q-timeline-entry
          title="1. Đăng ký & Xác thực Email"
          subtitle="Tài khoản hệ thống"
          icon="verified_user"
          :color="isEmailVerified ? 'positive' : 'warning'"
        >
          <div>
            Trạng thái xác thực email:
            <q-badge :color="isEmailVerified ? 'positive' : 'warning'">
              {{ isEmailVerified ? 'ĐÃ XÁC THỰC' : 'CHƯA XÁC THỰC' }}
            </q-badge>
          </div>
        </q-timeline-entry>

        <q-timeline-entry
          title="2. Nộp hồ sơ ứng tuyển & CV"
          subtitle="Tài liệu hồ sơ"
          icon="upload_file"
          :color="hasSubmittedApp ? 'positive' : 'grey-5'"
        >
          <div>
            {{ hasSubmittedApp ? 'Hồ sơ & CV đã được gửi lên hệ thống' : 'Chờ hoàn tất nộp đơn' }}
          </div>
        </q-timeline-entry>

        <q-timeline-entry
          title="3. HR Xét duyệt & Phỏng vấn"
          subtitle="Đánh giá năng lực"
          icon="supervisor_account"
          :color="isApproved ? 'positive' : (isReviewing ? 'primary' : 'grey-5')"
        >
          <div>
            {{ isApproved ? 'Đã được HR xét duyệt & chấp nhận hồ sơ' : 'Chờ kết quả phản hồi từ bộ phận Nhân sự HR.' }}
          </div>
        </q-timeline-entry>

        <q-timeline-entry
          title="4. Chính thức làm Thực tập sinh (Onboarding)"
          subtitle="Bắt đầu thực tập"
          icon="card_membership"
          :color="isApproved ? 'positive' : 'grey-5'"
        >
          <div>
            {{ isApproved ? 'Chúc mừng bạn đã trúng tuyển! Hãy truy cập menu Hồ sơ cá nhân để hoàn thiện các thông tin tiếp nhận.' : 'Khi được HR chấp nhận, hệ thống sẽ cấp Mã Thực tập sinh (INT-code) và mở đầy đủ các tiện ích: Điểm danh, Nhiệm vụ, Báo cáo tuần, Phụ cấp & Hợp đồng.' }}
          </div>
        </q-timeline-entry>
      </q-timeline>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../../auth/store/authStore';
import { applicationService } from '../../applications/services/applicationService';
import { apiClient as api } from '../../../shared/api/client';
import type { ApplicationResponse } from '../../applications/types/application';

const $q = useQuasar();
const authStore = useAuthStore();
const currentApp = ref<ApplicationResponse | null>(null);
const latestResult = ref<any>(null);
const resubmitting = ref(false);

const currentAppStatus = computed(() => {
  return latestResult.value?.status || currentApp.value?.status || authStore.user?.applicationStatus || 'SUBMITTED';
});

const isApproved = computed(() => {
  return ['APPROVED', 'CONTRACT_SENT', 'CONTRACT_SIGNED', 'INTERNING', 'COMPLETED'].includes(currentAppStatus.value);
});

const isEmailVerified = computed(() => {
  return Boolean(authStore.user?.emailVerified || isApproved.value);
});

const hasSubmittedApp = computed(() => {
  return Boolean(currentApp.value || latestResult.value || authStore.user?.applicationStatus);
});

const isReviewing = computed(() => {
  return ['REVIEWING', 'SCREENING', 'INTERVIEWING'].includes(currentAppStatus.value);
});

const statusChipColor = computed(() => {
  switch (currentAppStatus.value) {
    case 'SUBMITTED': return 'primary';
    case 'REVIEWING': case 'SCREENING': case 'INTERVIEWING': return 'info';
    case 'NEEDS_REVISION': return 'warning';
    case 'APPROVED': return 'positive';
    case 'REJECTED': return 'negative';
    default: return 'grey';
  }
});

async function loadLatestResult() {
  try {
    const res = await api.get('/api/v1/applications/me/latest-result');
    if (res.data && res.data.data) {
      latestResult.value = res.data.data;
    }
  } catch (e) {
    // Ignore if not yet applied
  }
}

async function resubmitApplication() {
  if (!currentApp.value && !latestResult.value) return;
  const appId = currentApp.value?.id || latestResult.value?.applicationId;
  resubmitting.value = true;
  try {
    await api.post(`/api/v1/applications/${appId}/resubmit`);
    $q.notify({ type: 'positive', message: 'Nộp lại đơn ứng tuyển thành công! Hồ sơ đã chuyển về trạng thái SUBMITTED' });
    await loadLatestResult();
    const apps = await applicationService.getMyApplications();
    if (apps && apps.length > 0) currentApp.value = apps[0];
  } catch (err: any) {
    $q.notify({ type: 'negative', message: err?.response?.data?.message || 'Không thể nộp lại hồ sơ' });
  } finally {
    resubmitting.value = false;
  }
}

onMounted(async () => {
  await loadLatestResult();
  try {
    const apps = await applicationService.getMyApplications();
    if (apps && apps.length > 0) {
      currentApp.value = apps[0];
    }
  } catch (e) {
    // Ignore error if no app yet
  }
});
</script>

<style scoped lang="sass">
.rounded-borders-lg
  border-radius: 16px

.border-blue
  border: 1px solid #90caf9
</style>
