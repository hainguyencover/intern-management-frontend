<template>
  <BaseDialog
    :model-value="modelValue"
    :title="isEdit ? 'Cập nhật phòng ban' : 'Thêm mới phòng ban'"
    :loading="loading"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    @cancel="$emit('update:modelValue', false)"
  >
    <form @submit.prevent="$emit('save')">
      <div class="q-gutter-y-md">
        <BaseInput
          :model-value="code"
          label="Mã phòng ban"
          placeholder="VD: TECH, HR, QA..."
          :error="codeError"
          :disabled="isEdit"
          @update:model-value="$emit('update:code', $event)"
        />

        <BaseInput
          :model-value="name"
          label="Tên phòng ban"
          placeholder="VD: Phòng Phát triển Phần mềm"
          :error="nameError"
          @update:model-value="$emit('update:name', $event)"
        />

        <BaseTextarea
          :model-value="description"
          label="Mô tả chức năng"
          placeholder="Nhập mô tả nhiệm vụ của phòng ban..."
          @update:model-value="$emit('update:description', $event)"
        />

        <BaseSelect
          v-if="isEdit"
          :model-value="status"
          :options="statusOptions"
          label="Trạng thái hoạt động"
          @update:model-value="$emit('update:status', $event)"
        />
      </div>
    </form>

    <template #actions>
      <BaseButton flat label="Hủy" color="secondary" @click="$emit('update:modelValue', false)" />
      <BaseButton
        :label="isEdit ? 'Cập nhật' : 'Tạo mới'"
        color="primary"
        :loading="loading"
        @click="$emit('save')"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '../../../shared/components/BaseDialog.vue';
import BaseInput from '../../../shared/components/BaseInput.vue';
import BaseTextarea from '../../../shared/components/BaseTextarea.vue';
import BaseSelect from '../../../shared/components/BaseSelect.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';

defineProps<{
  modelValue: boolean;
  isEdit: boolean;
  code: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  loading: boolean;
  codeError?: string;
  nameError?: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'update:code', value: string): void;
  (e: 'update:name', value: string): void;
  (e: 'update:description', value: string): void;
  (e: 'update:status', value: 'ACTIVE' | 'INACTIVE'): void;
  (e: 'save'): void;
}>();

const statusOptions = [
  { label: 'Hoạt động', value: 'ACTIVE' },
  { label: 'Tạm ngưng', value: 'INACTIVE' }
];
</script>
