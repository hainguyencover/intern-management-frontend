<template>
  <div class="intern-profile-detail-page">
    <div class="row items-center justify-between q-mb-md">
      <div class="row items-center">
        <q-btn flat round icon="arrow_back" color="grey-8" to="/hr/interns" class="q-mr-sm" />
        <div>
          <div class="text-h5 text-weight-bold">Chi tiết Hồ sơ Thực tập sinh</div>
          <div class="text-caption text-grey-7">Mã TTS: {{ profile?.internCode || 'INT-2026-001' }}</div>
        </div>
      </div>

      <div class="q-gutter-sm">
        <q-btn
          color="indigo-9"
          icon="published_with_changes"
          label="Chuyển Trạng thái"
          unelevated
          @click="showTransitionDialog = true"
        />
      </div>
    </div>

    <!-- Main Profile Info -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-8">
        <q-card flat bordered class="fit">
          <q-card-section class="row items-center justify-between">
            <div class="text-h6 text-weight-bold">Thông tin Cá nhân & Học vấn</div>
            <q-badge color="positive" class="text-subtitle2 q-pa-xs">{{ profile?.status || 'INTERNING' }}</q-badge>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-gutter-y-sm">
            <div class="row"><div class="col-4 text-grey-7">Họ và Tên:</div><div class="col-8 text-weight-bold">{{ profile?.fullName || 'Nguyễn Văn A' }}</div></div>
            <div class="row"><div class="col-4 text-grey-7">Email:</div><div class="col-8">{{ profile?.email || 'nguyenvana@gmail.com' }}</div></div>
            <div class="row"><div class="col-4 text-grey-7">Số điện thoại:</div><div class="col-8">{{ profile?.phone || '0912345678' }}</div></div>
            <div class="row"><div class="col-4 text-grey-7">Trường ĐH:</div><div class="col-8">{{ profile?.university || 'Đại học Bách Khoa' }}</div></div>
            <div class="row"><div class="col-4 text-grey-7">Chuyên ngành:</div><div class="col-8">{{ profile?.major || 'Công nghệ thông tin' }}</div></div>
            <div class="row"><div class="col-4 text-grey-7">GPA:</div><div class="col-8 text-weight-bold color-primary">{{ profile?.gpa || 3.6 }} / 4.0</div></div>
            <div class="row"><div class="col-4 text-grey-7">Người liên hệ khẩn cấp:</div><div class="col-8">{{ profile?.emergencyContactName || 'Nguyễn Văn Bố' }} ({{ profile?.emergencyContactPhone || '0900112233' }})</div></div>
          </q-card-section>
        </q-card>
      </div>

      <!-- State Machine Timeline -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="fit">
          <q-card-section>
            <div class="text-h6 text-weight-bold">Tiến trình State Machine</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-timeline color="primary">
              <q-timeline-entry title="Tạo bản nháp (DRAFT)" subtitle="01/07/2026" icon="edit" color="grey-7" />
              <q-timeline-entry title="Đã nộp hồ sơ (SUBMITTED)" subtitle="02/07/2026" icon="send" color="blue-7" />
              <q-timeline-entry title="Đang xét duyệt (REVIEWING)" subtitle="05/07/2026" icon="rate_review" color="amber-9" />
              <q-timeline-entry title="Đã phê duyệt (APPROVED)" subtitle="10/07/2026" icon="thumb_up" color="teal-8" />
              <q-timeline-entry title="Đang thực tập (INTERNING)" subtitle="15/07/2026" icon="work" color="positive" active />
              <q-timeline-entry title="Hoàn thành (COMPLETED)" subtitle="Chờ tổng kết" icon="flag" color="grey-5" />
            </q-timeline>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Mentor Assignment & History Section -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-6">
        <MentorAssignmentCard
          :active-assignment="activeAssignment"
          :intern-name="profile?.fullName"
          @assign="showAssignDialog = true"
          @updated="loadMentorData"
        />
      </div>
      <div class="col-12 col-md-6">
        <MentorHistoryTimeline
          :history-list="mentorHistory"
          @refresh="loadMentorData"
        />
      </div>
    </div>

    <!-- Assign Mentor Dialog -->
    <AssignMentorDialog
      v-model="showAssignDialog"
      :intern-profile-id="profile?.id"
      @success="loadMentorData"
    />

    <!-- Status Transition Dialog -->
    <StatusTransitionDialog
      v-model="showTransitionDialog"
      :profile="profile"
      @success="loadProfile"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { InternProfile } from '@/types/internProfile';
import type { MentorAssignmentHistory } from '@/types/mentor';
import internProfileService from '@/services/intern/internProfileService';
import mentorAssignmentService from '@/services/mentor/mentorAssignmentService';
import StatusTransitionDialog from '@/components/intern/StatusTransitionDialog.vue';
import AssignMentorDialog from '@/components/mentor/AssignMentorDialog.vue';
import MentorAssignmentCard from '@/components/mentor/MentorAssignmentCard.vue';
import MentorHistoryTimeline from '@/components/mentor/MentorHistoryTimeline.vue';

const route = useRoute();
const profile = ref<InternProfile | null>(null);
const mentorHistory = ref<MentorAssignmentHistory[]>([]);
const showTransitionDialog = ref(false);
const showAssignDialog = ref(false);

const activeAssignment = computed(() => {
  return mentorHistory.value.find(item => item.status === 'ACTIVE') || null;
});

onMounted(() => {
  loadProfile();
  loadMentorData();
});

const loadProfile = async () => {
  const id = Number(route.params.id);
  if (id) {
    try {
      profile.value = await internProfileService.getInternProfileById(id);
    } catch (e) {
      // Fallback profile
      profile.value = {
        id: 1,
        internCode: 'INT-2026-001',
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@gmail.com',
        phone: '0912345678',
        university: 'Đại học Bách Khoa',
        major: 'Công nghệ thông tin',
        gpa: 3.6,
        status: 'INTERNING',
        mentorName: 'Lê Văn Mentor',
        emergencyContactName: 'Nguyễn Văn Bố',
        emergencyContactPhone: '0900112233',
        createdAt: '2026-07-01',
        updatedAt: '2026-08-01'
      };
    }
  }
};

const loadMentorData = async () => {
  const id = Number(route.params.id);
  if (!id) return;

  try {
    const history = await mentorAssignmentService.getInternAssignmentHistory(id);
    mentorHistory.value = history || [];
  } catch (e) {
    // Fallback history for visual testing
    mentorHistory.value = [
      {
        id: 101,
        internId: id,
        mentorId: 12,
        mentorName: profile.value?.mentorName || 'Lê Văn Mentor',
        mentorEmail: 'levanmentor@company.com',
        mentorDepartmentName: 'Bộ phận Backend',
        mentorEmployeeCode: 'MEN-001',
        assignmentType: 'PRIMARY',
        startDate: '2026-08-01',
        status: 'ACTIVE',
        assignedAt: '2026-08-01T08:00:00',
        assignedByName: 'HR Nguyễn Thị X',
        responsibility: 'Hướng dẫn Spring Boot và Microservices'
      }
    ];
  }
};
</script>
