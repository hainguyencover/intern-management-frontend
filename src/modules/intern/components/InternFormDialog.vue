<template>
  <BaseDialog
    :model-value="modelValue"
    :title="isEdit ? 'Cập nhật hồ sơ thực tập sinh' : 'Tạo mới hồ sơ thực tập sinh'"
    :loading="loading"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    @cancel="$emit('update:modelValue', false)"
  >
    <form @submit.prevent="$emit('save')">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <BaseInput
            :model-value="fullName"
            label="Họ và tên *"
            placeholder="VD: Nguyễn Văn A"
            :error="nameError"
            @update:model-value="$emit('update:fullName', $event)"
          />
        </div>
        <div class="col-12 col-md-6">
          <BaseInput
            :model-value="email"
            label="Email công ty *"
            placeholder="VD: anv@holaho.vn"
            type="email"
            :error="emailError"
            @update:model-value="$emit('update:email', $event)"
          />
        </div>

        <div class="col-12 col-md-6">
          <BaseInput
            :model-value="phone"
            label="Số điện thoại *"
            placeholder="VD: 0901234567"
            :error="phoneError"
            @update:model-value="$emit('update:phone', $event)"
          />
        </div>
        <div class="col-12 col-md-6">
          <BaseInput
            :model-value="university"
            label="Trường Đại học *"
            placeholder="VD: Đại học Bách Khoa Hà Nội"
            @update:model-value="$emit('update:university', $event)"
          />
        </div>

        <div class="col-12 col-md-6">
          <BaseInput
            :model-value="major"
            label="Chuyên ngành *"
            placeholder="VD: Khoa học Máy tính"
            @update:model-value="$emit('update:major', $event)"
          />
        </div>
        <div class="col-12 col-md-6">
          <BaseInput
            :model-value="gpa ? String(gpa) : ''"
            label="Điểm GPA"
            placeholder="VD: 3.6"
            @update:model-value="$emit('update:gpa', $event ? Number($event) : undefined)"
          />
        </div>

        <div class="col-12 col-md-6">
          <BaseInput
            :model-value="startDate"
            label="Ngày bắt đầu *"
            placeholder="YYYY-MM-DD"
            @update:model-value="$emit('update:startDate', $event)"
          />
        </div>
        <div class="col-12 col-md-6">
          <BaseInput
            :model-value="endDate"
            label="Ngày kết thúc *"
            placeholder="YYYY-MM-DD"
            @update:model-value="$emit('update:endDate', $event)"
          />
        </div>

        <div v-if="isEdit" class="col-12">
          <BaseSelect
            :model-value="status"
            :options="statusOptions"
            label="Trạng thái thực tập"
            @update:model-value="$emit('update:status', $event)"
          />
        </div>
      </div>
    </form>

    <template #actions>
      <BaseButton flat label="Hủy" color="secondary" @click="$emit('update:modelValue', false)" />
      <BaseButton
        :label="isEdit ? 'Cập nhật' : 'Tạo hồ sơ'"
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
import BaseSelect from '../../../shared/components/BaseSelect.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';

defineProps<{
  modelValue: boolean;
  isEdit: boolean;
  fullName: string;
  email: string;
  phone: string;
  university: string;
  major: string;
  gpa?: number;
  status: 'APPLIED' | 'INTERNING' | 'COMPLETED' | 'TERMINATED';
  startDate: string;
  endDate: string;
  loading: boolean;
  nameError?: string;
  emailError?: string;
  phoneError?: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'update:fullName', value: string): void;
  (e: 'update:email', value: string): void;
  (e: 'update:phone', value: string): void;
  (e: 'update:university', value: string): void;
  (e: 'update:major', value: string): void;
  (e: 'update:gpa', value?: number): void;
  (e: 'update:status', value: 'APPLIED' | 'INTERNING' | 'COMPLETED' | 'TERMINATED'): void;
  (e: 'update:startDate', value: string): void;
  (e: 'update:endDate', value: string): void;
  (e: 'save'): void;
}>();

const statusOptions = [
  { label: 'Ứng tuyển', value: 'APPLIED' },
  { label: 'Đang thực tập', value: 'INTERNING' },
  { label: 'Tốt nghiệp', value: 'COMPLETED' },
  { label: 'Đã nghỉ', value: 'TERMINATED' }
];
</script>
