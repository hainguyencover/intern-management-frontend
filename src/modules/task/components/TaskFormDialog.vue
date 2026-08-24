<template>
  <BaseDialog
    :model-value="modelValue"
    title="Giao nhiệm vụ mới"
    :loading="loading"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    @cancel="$emit('update:modelValue', false)"
  >
    <TaskForm
      :title="title"
      :description="description"
      :assignee-id="assigneeId"
      :due-date="dueDate"
      :priority="priority"
      :title-error="titleError"
      :desc-error="descError"
      @update:title="$emit('update:title', $event)"
      @update:description="$emit('update:description', $event)"
      @update:assignee-id="$emit('update:assigneeId', $event)"
      @update:due-date="$emit('update:dueDate', $event)"
      @update:priority="$emit('update:priority', $event)"
      @save="$emit('save')"
    />

    <template #actions>
      <BaseButton flat label="Hủy" color="secondary" @click="$emit('update:modelValue', false)" />
      <BaseButton label="Giao nhiệm vụ" color="primary" :loading="loading" @click="$emit('save')" />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '../../../shared/components/BaseDialog.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';
import TaskForm from './TaskForm.vue';
import type { TaskPriority } from '../models/task';

defineProps<{
  modelValue: boolean;
  title: string;
  description: string;
  assigneeId: string | number;
  dueDate: string;
  priority: TaskPriority;
  loading: boolean;
  titleError?: string;
  descError?: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'update:title', value: string): void;
  (e: 'update:description', value: string): void;
  (e: 'update:assigneeId', value: string | number): void;
  (e: 'update:dueDate', value: string): void;
  (e: 'update:priority', value: TaskPriority): void;
  (e: 'save'): void;
}>();

</script>
