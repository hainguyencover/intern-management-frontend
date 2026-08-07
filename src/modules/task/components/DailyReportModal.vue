<template>
  <BaseDialog
    :model-value="modelValue"
    title="Nộp báo cáo công việc hằng ngày"
    :loading="loading"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    @cancel="$emit('update:modelValue', false)"
  >
    <form @submit.prevent="$emit('save')">
      <div class="q-gutter-y-md">
        <BaseInput
          :model-value="reportDate"
          label="Ngày báo cáo *"
          placeholder="YYYY-MM-DD"
          @update:model-value="$emit('update:reportDate', $event)"
        />

        <BaseTextarea
          :model-value="content"
          label="Nội dung công việc đã thực hiện *"
          placeholder="Mô tả chi tiết các đầu việc đã hoàn thành trong ngày..."
          :error="contentError"
          @update:model-value="$emit('update:content', $event)"
        />
      </div>
    </form>

    <template #actions>
      <BaseButton flat label="Hủy" color="secondary" @click="$emit('update:modelValue', false)" />
      <BaseButton label="Nộp báo cáo" color="primary" :loading="loading" @click="$emit('save')" />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '../../../shared/components/BaseDialog.vue';
import BaseInput from '../../../shared/components/BaseInput.vue';
import BaseTextarea from '../../../shared/components/BaseTextarea.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';

defineProps<{
  modelValue: boolean;
  reportDate: string;
  content: string;
  loading: boolean;
  contentError?: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'update:reportDate', value: string): void;
  (e: 'update:content', value: string): void;
  (e: 'save'): void;
}>();
</script>
