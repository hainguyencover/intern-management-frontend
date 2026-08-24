<template>
  <q-card flat bordered class="mentor-history-timeline fit">
    <q-card-section class="row items-center justify-between q-pb-xs">
      <div class="text-h6 text-weight-bold row items-center">
        <q-icon name="history" color="primary" class="q-mr-sm" size="24px" />
        Lịch sử Người hướng dẫn
      </div>
      <q-btn flat round icon="refresh" color="grey-7" size="sm" @click="$emit('refresh')" />
    </q-card-section>

    <q-separator />

    <q-card-section v-if="historyList && historyList.length > 0">
      <q-timeline color="primary" class="q-px-sm">
        <q-timeline-entry
          v-for="item in historyList"
          :key="item.id"
          :title="item.mentorName || 'Mentor'"
          :subtitle="formatSubtitle(item)"
          :icon="getStatusIcon(item.status)"
          :color="getStatusColor(item.status)"
        >
          <div>
            <div class="row items-center q-gutter-xs q-mb-xs">
              <q-chip
                dense
                size="sm"
                :color="getStatusColor(item.status)"
                text-color="white"
                class="text-weight-bold"
              >
                {{ getStatusLabel(item.status) }}
              </q-chip>
              <span class="text-caption text-grey-7" v-if="item.mentorDepartmentName">
                ({{ item.mentorDepartmentName }})
              </span>
            </div>

            <div class="text-caption text-grey-8" v-if="item.assignedByName">
              <q-icon name="person" size="14px" /> Phân công bởi: {{ item.assignedByName }}
            </div>

            <div class="text-caption text-grey-8" v-if="item.unassignedByName">
              <q-icon name="person_off" size="14px" /> Gỡ bởi: {{ item.unassignedByName }}
            </div>

            <div
              v-if="item.unassignReason"
              class="bg-amber-1 text-amber-10 q-pa-xs rounded-borders text-caption q-mt-xs"
            >
              <strong>Lý do gỡ:</strong> {{ item.unassignReason }}
            </div>
            <div
              v-else-if="item.reason"
              class="bg-grey-2 text-grey-9 q-pa-xs rounded-borders text-caption q-mt-xs"
            >
              <strong>Ghi chú:</strong> {{ item.reason }}
            </div>
          </div>
        </q-timeline-entry>
      </q-timeline>
    </q-card-section>

    <q-card-section v-else class="text-center q-py-md text-grey-6">
      <q-icon name="history_toggle_off" size="36px" class="q-mb-xs" />
      <div>Chưa có lịch sử phân công mentor</div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { MentorAssignmentHistory, MentorAssignmentStatusType } from '@/types/mentor';

defineProps<{
  historyList?: MentorAssignmentHistory[];
}>();

defineEmits<{
  (e: 'refresh'): void;
}>();

const getStatusLabel = (status: MentorAssignmentStatusType) => {
  switch (status) {
    case 'ACTIVE': return 'Đang phụ trách';
    case 'UNASSIGNED': return 'Đã gỡ';
    case 'REASSIGNED': return 'Đã thay mentor';
    case 'COMPLETED': return 'Đã hoàn thành';
    case 'CANCELLED': return 'Đã hủy';
    default: return status;
  }
};

const getStatusColor = (status: MentorAssignmentStatusType) => {
  switch (status) {
    case 'ACTIVE': return 'positive';
    case 'UNASSIGNED': return 'negative';
    case 'REASSIGNED': return 'orange-8';
    case 'COMPLETED': return 'teal-8';
    case 'CANCELLED': return 'grey-7';
    default: return 'blue-7';
  }
};

const getStatusIcon = (status: MentorAssignmentStatusType) => {
  switch (status) {
    case 'ACTIVE': return 'check_circle';
    case 'UNASSIGNED': return 'person_remove';
    case 'REASSIGNED': return 'swap_horiz';
    case 'COMPLETED': return 'verified';
    case 'CANCELLED': return 'cancel';
    default: return 'event';
  }
};

const formatSubtitle = (item: MentorAssignmentHistory) => {
  const start = formatDate(item.assignedAt || item.startDate);
  if (item.status === 'ACTIVE') {
    return `Từ ${start} - Hiệu lực`;
  }
  const end = formatDate(item.unassignedAt || item.endedAt || item.endDate);
  return `${start} → ${end}`;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN');
  } catch {
    return dateStr;
  }
};
</script>
