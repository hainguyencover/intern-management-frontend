<template>
  <BaseDialog
    :model-value="modelValue"
    :title="`Lịch sử phân công - ${internName}`"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    @cancel="$emit('update:modelValue', false)"
  >
    <BaseAuditTimeline :items="mappedTimelineItems" />

    <template #actions>
      <BaseButton label="Đóng" color="secondary" @click="$emit('update:modelValue', false)" />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseDialog from '../../../shared/components/BaseDialog.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';
import BaseAuditTimeline, { type AuditTimelineItem } from '../../../shared/components/BaseAuditTimeline.vue';
import type { AssignmentHistory } from '../models/assignment';

const props = defineProps<{
  modelValue: boolean;
  internName: string;
  history: AssignmentHistory[];
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const mappedTimelineItems = computed<AuditTimelineItem[]>(() => {
  return props.history.map((h) => ({
    id: h.id,
    title: getActionTitle(h.action),
    timestamp: h.timestamp,
    description: h.newMentor ? `Mentor mới: ${h.newMentor}` : undefined,
    reason: h.reason,
    actor: h.performedBy,
    icon: getActionIcon(h.action),
    color: getActionColor(h.action)
  }));
});

function getActionTitle(action: string): string {
  if (action === 'ASSIGNED') return 'Phân công Mentor ban đầu';
  if (action === 'REASSIGNED') return 'Chuyển đổi Mentor phụ trách';
  if (action === 'UNASSIGNED') return 'Hủy gán Mentor';
  return 'Hoàn thành kỳ thực tập';
}

function getActionIcon(action: string): string {
  if (action === 'ASSIGNED') return 'person_add';
  if (action === 'REASSIGNED') return 'swap_horiz';
  if (action === 'UNASSIGNED') return 'person_remove';
  return 'task_alt';
}

function getActionColor(action: string): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' {
  if (action === 'ASSIGNED') return 'primary';
  if (action === 'REASSIGNED') return 'warning';
  if (action === 'UNASSIGNED') return 'danger';
  return 'success';
}
</script>
