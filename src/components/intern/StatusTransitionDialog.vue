<template>
  <q-dialog v-model="modelValue" persistent @show="onShow">
    <q-card style="min-width: 420px; max-width: 520px">
      <q-card-section class="row items-center bg-blue-9 text-white">
        <q-icon name="published_with_changes" size="md" class="q-mr-sm" />
        <div class="text-h6 text-weight-bold">Chuyển Trạng thái Hồ sơ</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <div class="q-mb-md">
          <div class="text-subtitle2 text-grey-7">Thực tập sinh:</div>
          <div class="text-h6 text-weight-bold text-primary">{{ profile?.fullName }}</div>
          <div class="row items-center q-mt-xs">
            <span class="text-caption text-grey-7 q-mr-xs">Trạng thái hiện tại:</span>
            <q-badge color="blue-9">{{ profile?.status }}</q-badge>
          </div>
        </div>

        <q-separator class="q-mb-md" />

        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <div>
            <q-select
              v-model="targetStatus"
              v-bind="targetStatusAttrs"
              :options="allowedTargetOptions"
              label="Trạng thái đích"
              outlined
              dense
              emit-value
              map-options
              :error="!!errors.targetStatus"
              :error-message="errors.targetStatus"
            />
          </div>

          <div>
            <q-input
              v-model="reason"
              v-bind="reasonAttrs"
              label="Ghi chú / Lý do chuyển trạng thái"
              outlined
              dense
              type="textarea"
              rows="3"
              placeholder="Nhập chi tiết ghi chú..."
              :error="!!errors.reason"
              :error-message="errors.reason"
            />
          </div>

          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn label="Hủy" flat color="grey-7" v-close-popup />
            <q-btn
              type="submit"
              label="Xác nhận Chuyển"
              color="blue-9"
              unelevated
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { Notify } from 'quasar';
import type { InternProfile, InternStatus } from '@/types/internProfile';
import { statusTransitionSchema } from '@/schemas/internProfile.schema';
import internProfileService from '@/services/intern/internProfileService';

const props = defineProps<{
  modelValue: boolean;
  profile: InternProfile | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}>();

const modelValue = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
});

const loading = ref(false);

const allStatusOptions: { label: string; value: InternStatus }[] = [
  { label: 'DRAFT (Bản nháp)', value: 'DRAFT' },
  { label: 'SUBMITTED (Đã nộp)', value: 'SUBMITTED' },
  { label: 'REVIEWING (Đang xét duyệt)', value: 'REVIEWING' },
  { label: 'APPROVED (Đã phê duyệt)', value: 'APPROVED' },
  { label: 'REJECTED (Từ chối)', value: 'REJECTED' },
  { label: 'INTERNING (Đang thực tập)', value: 'INTERNING' },
  { label: 'COMPLETED (Đã hoàn thành)', value: 'COMPLETED' }
];

const allowedTargetOptions = computed(() => {
  if (!props.profile) return allStatusOptions;
  const current = props.profile.status;

  switch (current) {
    case 'DRAFT':
      return allStatusOptions.filter((o) => ['SUBMITTED'].includes(o.value));
    case 'SUBMITTED':
      return allStatusOptions.filter((o) => ['REVIEWING', 'REJECTED'].includes(o.value));
    case 'REVIEWING':
      return allStatusOptions.filter((o) => ['APPROVED', 'REJECTED'].includes(o.value));
    case 'APPROVED':
      return allStatusOptions.filter((o) => ['INTERNING', 'REJECTED'].includes(o.value));
    case 'INTERNING':
      return allStatusOptions.filter((o) => ['COMPLETED'].includes(o.value));
    default:
      return allStatusOptions;
  }
});

const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(statusTransitionSchema)
});

const [targetStatus, targetStatusAttrs] = defineField('targetStatus');
const [reason, reasonAttrs] = defineField('reason');

const onShow = () => {
  resetForm();
};

const onSubmit = handleSubmit(async (values) => {
  if (!props.profile) return;
  loading.value = true;
  try {
    await internProfileService.transitionStatus(props.profile.id, {
      targetStatus: values.targetStatus as InternStatus,
      reason: values.reason
    });
    Notify.create({
      type: 'positive',
      message: `Đã chuyển trạng thái hồ sơ sang ${values.targetStatus}!`
    });
    emit('update:modelValue', false);
    emit('success');
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Không thể chuyển trạng thái hồ sơ!'
    });
  } finally {
    loading.value = false;
  }
});
</script>
