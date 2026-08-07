<template>
  <form @submit.prevent="$emit('save')">
    <div class="q-gutter-y-md">
      <BaseInput
        :model-value="title"
        label="Tên nhiệm vụ *"
        placeholder="VD: Triển khai giao diện Dashboard"
        :error="titleError"
        @update:model-value="$emit('update:title', $event)"
      />

      <BaseTextarea
        :model-value="description"
        label="Mô tả chi tiết *"
        placeholder="Nhập yêu cầu chi tiết của nhiệm vụ..."
        :error="descError"
        @update:model-value="$emit('update:description', $event)"
      />

      <BaseSelect
        :model-value="assigneeId"
        :options="internOptions"
        label="Giao cho Thực tập sinh *"
        @update:model-value="$emit('update:assigneeId', $event)"
      />

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <BaseSelect
            :model-value="priority"
            :options="priorityOptions"
            label="Mức độ ưu tiên"
            @update:model-value="$emit('update:priority', $event)"
          />
        </div>
        <div class="col-12 col-md-6">
          <BaseInput
            :model-value="dueDate"
            label="Hạn hoàn thành *"
            placeholder="YYYY-MM-DD"
            @update:model-value="$emit('update:dueDate', $event)"
          />
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import BaseInput from '../../../shared/components/BaseInput.vue';
import BaseTextarea from '../../../shared/components/BaseTextarea.vue';
import BaseSelect from '../../../shared/components/BaseSelect.vue';
import type { TaskPriority } from '../models/task';

defineProps<{
  title: string;
  description: string;
  assigneeId: string;
  dueDate: string;
  priority: TaskPriority;
  titleError?: string;
  descError?: string;
}>();

defineEmits<{
  (e: 'update:title', value: string): void;
  (e: 'update:description', value: string): void;
  (e: 'update:assigneeId', value: string): void;
  (e: 'update:dueDate', value: string): void;
  (e: 'update:priority', value: TaskPriority): void;
  (e: 'save'): void;
}>();

const internOptions = [
  { label: 'Nguyễn Văn A (TTS2026-001)', value: 'intern-1' },
  { label: 'Trần Thị B (TTS2026-002)', value: 'intern-2' }
];

const priorityOptions = [
  { label: 'Thấp (Low)', value: 'LOW' },
  { label: 'Trung bình (Medium)', value: 'MEDIUM' },
  { label: 'Cao (High)', value: 'HIGH' },
  { label: 'Khẩn cấp (Urgent)', value: 'URGENT' }
];
</script>
