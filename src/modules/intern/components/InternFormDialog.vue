<template>
  <BaseDialog
    :model-value="modelValue"
    :title="isEdit ? 'Cập nhật hồ sơ thực tập sinh' : 'Tạo mới hồ sơ thực tập sinh'"
    :loading="loading"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    @cancel="handleCancel"
  >
    <div v-if="isEdit && status === 'COMPLETED'" class="q-mb-md">
      <q-banner dense inline-actions class="bg-warning text-dark rounded-borders">
        <template #avatar>
          <q-icon name="lock" color="dark" />
        </template>
        Hồ sơ ở trạng thái <strong>Hoàn thành (COMPLETED)</strong> đã bị khóa và không thể chỉnh sửa.
      </q-banner>
    </div>

    <form @submit.prevent="onFormSubmit">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <BaseInput
            :model-value="fullName"
            label="Họ và tên *"
            placeholder="VD: Nguyễn Văn A"
            :error="nameError"
            :disabled="isEdit && status === 'COMPLETED'"
            @update:model-value="$emit('update:fullName', $event)"
          />
        </div>
        <div class="col-12 col-md-6">
          <BaseInput
            :model-value="email"
            label="Email *"
            placeholder="VD: anv@holaho.vn"
            type="email"
            :error="emailError"
            :disabled="isEdit"
            @update:model-value="$emit('update:email', $event)"
          />
        </div>

        <div class="col-12 col-md-6">
          <BaseInput
            :model-value="phone"
            label="Số điện thoại"
            placeholder="VD: 0901234567"
            :error="phoneError"
            :disabled="isEdit && status === 'COMPLETED'"
            @update:model-value="$emit('update:phone', $event)"
          />
        </div>
        <div class="col-12 col-md-6">
          <BaseInput
            :model-value="university"
            label="Trường Đại học *"
            placeholder="VD: Đại học Bách Khoa Hà Nội"
            :disabled="isEdit && status === 'COMPLETED'"
            @update:model-value="$emit('update:university', $event)"
          />
        </div>

        <div class="col-12 col-md-6">
          <BaseInput
            :model-value="major"
            label="Chuyên ngành *"
            placeholder="VD: Khoa học Máy tính"
            :disabled="isEdit && status === 'COMPLETED'"
            @update:model-value="$emit('update:major', $event)"
          />
        </div>
        <div class="col-12 col-md-6">
          <BaseInput
            :model-value="gpa ? String(gpa) : ''"
            label="Điểm GPA"
            placeholder="VD: 3.6"
            :disabled="isEdit && status === 'COMPLETED'"
            @update:model-value="$emit('update:gpa', $event ? Number($event) : undefined)"
          />
        </div>

        <div class="col-12 col-md-6">
          <BaseInput
            :model-value="startDate"
            label="Ngày bắt đầu"
            placeholder="YYYY-MM-DD"
            :disabled="isEdit && status === 'COMPLETED'"
            @update:model-value="$emit('update:startDate', $event)"
          />
        </div>
        <div class="col-12 col-md-6">
          <BaseInput
            :model-value="endDate"
            label="Ngày kết thúc"
            placeholder="YYYY-MM-DD"
            :disabled="isEdit && status === 'COMPLETED'"
            @update:model-value="$emit('update:endDate', $event)"
          />
        </div>

        <div v-if="isEdit" class="col-12">
          <BaseSelect
            :model-value="status"
            :options="statusOptions"
            label="Trạng thái thực tập"
            :disabled="status === 'COMPLETED'"
            @update:model-value="$emit('update:status', $event)"
          />
        </div>
      </div>
    </form>

    <template #actions>
      <BaseButton flat label="Hủy" color="secondary" @click="handleCancel" />
      <BaseButton
        :label="isEdit ? 'Lưu thay đổi' : 'Tạo hồ sơ'"
        color="primary"
        :loading="loading"
        :disabled="isEdit && status === 'COMPLETED'"
        @click="onFormSubmit"
      />
    </template>
  </BaseDialog>

  <!-- Confirmation Dialog for US-002 -->
  <BaseDialog
    v-model="showConfirmDialog"
    title="Xác nhận lưu thay đổi"
    :loading="loading"
    @cancel="showConfirmDialog = false"
  >
    <div class="q-py-md">
      Bạn có chắc chắn muốn lưu thông tin đã chỉnh sửa cho thực tập sinh <strong>{{ fullName }}</strong>?
    </div>
    <template #actions>
      <BaseButton flat label="Hủy" color="secondary" @click="showConfirmDialog = false" />
      <BaseButton label="Xác nhận" color="primary" :loading="loading" @click="confirmSave" />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseDialog from '../../../shared/components/BaseDialog.vue';
import BaseInput from '../../../shared/components/BaseInput.vue';
import BaseSelect from '../../../shared/components/BaseSelect.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';

const props = defineProps<{
  modelValue: boolean;
  isEdit: boolean;
  fullName: string;
  email: string;
  phone?: string;
  university: string;
  major: string;
  gpa?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  loading: boolean;
  nameError?: string;
  emailError?: string;
  phoneError?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'update:fullName', value: string): void;
  (e: 'update:email', value: string): void;
  (e: 'update:phone', value: string): void;
  (e: 'update:university', value: string): void;
  (e: 'update:major', value: string): void;
  (e: 'update:gpa', value?: number): void;
  (e: 'update:status', value: string): void;
  (e: 'update:startDate', value: string): void;
  (e: 'update:endDate', value: string): void;
  (e: 'save'): void;
}>();

const showConfirmDialog = ref(false);

const statusOptions = [
  { label: 'Bản nháp (DRAFT)', value: 'DRAFT' },
  { label: 'Đã nộp (SUBMITTED)', value: 'SUBMITTED' },
  { label: 'Đang xét duyệt (REVIEWING)', value: 'REVIEWING' },
  { label: 'Đã duyệt (APPROVED)', value: 'APPROVED' },
  { label: 'Đang thực tập (INTERNING)', value: 'INTERNING' },
  { label: 'Hoàn thành (COMPLETED)', value: 'COMPLETED' },
  { label: 'Bị từ chối (REJECTED)', value: 'REJECTED' }
];

function onFormSubmit() {
  if (props.isEdit) {
    showConfirmDialog.value = true;
  } else {
    emit('save');
  }
}

function confirmSave() {
  showConfirmDialog.value = false;
  emit('save');
}

function handleCancel() {
  showConfirmDialog.value = false;
  emit('update:modelValue', false);
}
</script>
