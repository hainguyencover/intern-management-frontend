<template>
  <BaseDialog
    :model-value="modelValue"
    :title="`Phân công Mentor - ${internName}`"
    :loading="loading"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    @cancel="$emit('update:modelValue', false)"
  >
    <form @submit.prevent="$emit('save')">
      <div class="q-gutter-y-md">
        <!-- Mentor Selection -->
        <BaseSelect
          :model-value="mentorId"
          :options="mentorOptions"
          label="Chọn Mentor phụ trách *"
          :error="mentorError"
          @update:model-value="$emit('update:mentorId', $event)"
        />

        <!-- Mentor Capacity Badge Indicator -->
        <div v-if="capacityInfo" class="q-px-xs">
          <BaseBadge
            :label="`Sức chứa Mentor: ${capacityInfo.currentCount}/${capacityInfo.maxCapacity} thực tập sinh`"
            :color="capacityInfo.available ? 'success' : 'danger'"
          />
        </div>

        <!-- Department Selection -->
        <BaseSelect
          :model-value="departmentId"
          :options="departmentOptions"
          label="Phòng ban thực tập *"
          :error="departmentError"
          @update:model-value="$emit('update:departmentId', $event)"
        />

        <!-- Date Range -->
        <div class="row q-col-gutter-md">
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
        </div>

        <!-- General Error Banner -->
        <q-banner v-if="generalError" dense class="bg-negative text-white rounded-borders q-mt-sm">
          {{ generalError }}
        </q-banner>
      </div>
    </form>

    <template #actions>
      <BaseButton flat label="Hủy" color="secondary" @click="$emit('update:modelValue', false)" />
      <BaseButton
        label="Xác nhận phân công"
        color="primary"
        :loading="loading"
        @click="$emit('save')"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '../../../shared/components/BaseDialog.vue';
import BaseSelect from '../../../shared/components/BaseSelect.vue';
import BaseInput from '../../../shared/components/BaseInput.vue';
import BaseBadge from '../../../shared/components/BaseBadge.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';
import type { MentorCapacityInfo } from '../models/assignment';

defineProps<{
  modelValue: boolean;
  internName: string;
  mentorId: string;
  departmentId: string;
  startDate: string;
  endDate: string;
  capacityInfo?: MentorCapacityInfo | null;
  loading: boolean;
  mentorError?: string;
  departmentError?: string;
  generalError?: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'update:mentorId', value: string): void;
  (e: 'update:departmentId', value: string): void;
  (e: 'update:startDate', value: string): void;
  (e: 'update:endDate', value: string): void;
  (e: 'save'): void;
}>();

const mentorOptions = [
  { label: 'Trần Văn Mentor (Phòng Tech - 3/5)', value: 'mentor-1' },
  { label: 'Lê Thị Mentor Mới (Phòng Tech - 1/5)', value: 'mentor-2' },
  { label: 'Pham Văn Senior (Phòng QA - 5/5 Full)', value: 'mentor-3' }
];

const departmentOptions = [
  { label: 'Phòng Phát triển Phần mềm (Tech)', value: 'dept-1' },
  { label: 'Phòng Kiểm thử Chất lượng (QA)', value: 'dept-2' }
];
</script>
