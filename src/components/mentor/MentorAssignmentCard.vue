<template>
  <q-card flat bordered class="mentor-assignment-card fit">
    <q-card-section class="row items-center justify-between q-pb-xs">
      <div class="text-h6 text-weight-bold row items-center">
        <q-icon name="school" color="primary" class="q-mr-sm" size="24px" />
        Người hướng dẫn (Mentor)
      </div>
      <q-badge
        :color="activeAssignment ? 'positive' : 'warning'"
        class="text-subtitle2 q-px-sm q-py-xs"
      >
        ● {{ activeAssignment ? 'Đang phụ trách' : 'Chờ phân công' }}
      </q-badge>
    </q-card-section>

    <q-separator />

    <q-card-section v-if="activeAssignment">
      <div class="row items-center q-mb-sm">
        <q-avatar size="48px" color="indigo-1" text-color="indigo-9" class="q-mr-md text-weight-bold">
          {{ getInitials(activeAssignment.mentorName || 'M') }}
        </q-avatar>
        <div>
          <div class="text-subtitle1 text-weight-bold">{{ activeAssignment.mentorName || 'Nguyễn Văn Mentor' }}</div>
          <div class="text-caption text-grey-7">
            {{ activeAssignment.mentorDepartmentName || 'Bộ phận Công nghệ' }}
            <span v-if="activeAssignment.mentorEmployeeCode">• Mã NV: {{ activeAssignment.mentorEmployeeCode }}</span>
          </div>
          <div class="text-caption text-grey-6" v-if="activeAssignment.mentorEmail">
            <q-icon name="email" size="14px" class="q-mr-xs" />{{ activeAssignment.mentorEmail }}
          </div>
        </div>
      </div>

      <div class="bg-grey-1 q-pa-sm rounded-borders text-caption text-grey-8 q-mb-md">
        <div><strong>Ngày gán:</strong> {{ formatDate(activeAssignment.assignedAt || activeAssignment.startDate) }}</div>
        <div v-if="activeAssignment.assignedByName"><strong>Bởi HR:</strong> {{ activeAssignment.assignedByName }}</div>
        <div v-if="activeAssignment.responsibility"><strong>Nhiệm vụ:</strong> {{ activeAssignment.responsibility }}</div>
      </div>

      <div class="row justify-end q-gutter-sm">
        <q-btn
          outline
          color="negative"
          icon="person_remove"
          label="Gỡ mentor"
          size="sm"
          unelevated
          @click="showUnassignDialog = true"
        />
      </div>
    </q-card-section>

    <q-card-section v-else class="text-center q-py-lg">
      <q-icon name="person_off" size="48px" color="grey-5" class="q-mb-sm" />
      <div class="text-subtitle1 text-grey-7">Hiện tại thực tập sinh chưa có người hướng dẫn</div>
      <div class="text-caption text-grey-5 q-mb-md">Vui lòng phân công mentor để thực tập sinh nhận nhiệm vụ</div>
      <q-btn
        color="primary"
        icon="person_add"
        label="Phân công mentor"
        size="sm"
        unelevated
        @click="$emit('assign')"
      />
    </q-card-section>

    <!-- Unassign Dialog -->
    <UnassignMentorDialog
      v-model="showUnassignDialog"
      :assignment-id="activeAssignment?.id"
      :mentor-name="activeAssignment?.mentorName"
      :intern-name="internName"
      @success="$emit('updated')"
    />
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { MentorAssignmentHistory } from '@/types/mentor';
import UnassignMentorDialog from './UnassignMentorDialog.vue';

const props = defineProps<{
  activeAssignment?: MentorAssignmentHistory | null;
  internName?: string;
}>();

defineEmits<{
  (e: 'assign'): void;
  (e: 'updated'): void;
}>();

const showUnassignDialog = ref(false);

const getInitials = (name: string) => {
  if (!name) return 'M';
  const parts = name.trim().split(' ');
  return parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name[0].toUpperCase();
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
