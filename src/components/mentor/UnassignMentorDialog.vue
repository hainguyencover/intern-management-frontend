<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
    <q-card style="min-width: 450px; max-width: 600px" class="q-pa-sm rounded-borders">
      <q-card-section class="row items-center justify-between q-pb-none">
        <div class="text-h6 text-weight-bold text-negative">
          <q-icon name="person_remove" class="q-mr-xs" />
          Gỡ người hướng dẫn (Mentor)
        </div>
        <q-btn icon="close" flat round dense v-close-popup :disable="submitting" />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <p class="text-body2 text-grey-8">
          Bạn có chắc chắn muốn gỡ mentor <strong>{{ mentorName || 'hiện tại' }}</strong> khỏi thực tập sinh <strong>{{ internName || '' }}</strong>?
        </p>

        <q-banner dense class="bg-amber-1 text-amber-10 rounded-borders q-mb-md">
          <template v-slot:avatar>
            <q-icon name="warning" color="amber-9" />
          </template>
          Thao tác này sẽ chuyển trạng thái phân công thành <strong>Đã gỡ (UNASSIGNED)</strong>. Lịch sử công việc và báo cáo cũ vẫn được giữ nguyên.
        </q-banner>

        <q-form @submit.prevent="handleConfirm" ref="formRef">
          <div class="text-subtitle2 text-weight-bold q-mb-xs">
            Lý do gỡ mentor <span class="text-negative">*</span>
          </div>
          <q-input
            v-model="reason"
            type="textarea"
            outlined
            dense
            rows="3"
            placeholder="Nhập lý do thay đổi người hướng dẫn (tối thiểu 1 ký tự, tối đa 500 ký tự)..."
            :rules="[
              val => (val && val.trim().length > 0) || 'Vui lòng nhập lý do gỡ mentor',
              val => (val && val.trim().length <= 500) || 'Lý do không được vượt quá 500 ký tự'
            ]"
            :disable="submitting"
            maxlength="500"
            counter
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="q-pt-none">
        <q-btn flat label="Hủy" color="grey-7" v-close-popup :disable="submitting" />
        <q-btn
          color="negative"
          label="Xác nhận gỡ"
          icon="check"
          unelevated
          :loading="submitting"
          :disable="submitting || !reason.trim()"
          @click="handleConfirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import mentorAssignmentService from '@/services/mentor/mentorAssignmentService';

const props = defineProps<{
  modelValue: boolean;
  assignmentId?: number | null;
  mentorName?: string;
  internName?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}>();

const $q = useQuasar();
const formRef = ref<any>(null);
const reason = ref('');
const submitting = ref(false);

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    reason.value = '';
    submitting.value = false;
  }
});

const handleConfirm = async () => {
  if (!props.assignmentId) {
    $q.notify({ type: 'negative', message: 'Không tìm thấy thông tin phân công mentor' });
    return;
  }

  const valid = formRef.value ? await formRef.value.validate() : true;
  if (!valid) return;

  submitting.value = true;
  try {
    await mentorAssignmentService.unassignMentor(props.assignmentId, {
      reason: reason.value.trim()
    });

    $q.notify({
      type: 'positive',
      message: 'Gỡ mentor thành công',
      icon: 'check_circle'
    });

    emit('success');
    emit('update:modelValue', false);
  } catch (error: any) {
    const statusCode = error?.response?.status;
    const msg = error?.response?.data?.message || 'Có lỗi xảy ra khi gỡ mentor';

    if (statusCode === 409) {
      $q.notify({
        type: 'warning',
        message: 'Mentor này đã được gỡ trước đó. Đang tải lại dữ liệu...',
        icon: 'info'
      });
      emit('success');
      emit('update:modelValue', false);
    } else if (statusCode === 403) {
      $q.notify({
        type: 'negative',
        message: 'Bạn không có quyền thực hiện thao tác này',
        icon: 'lock'
      });
    } else {
      $q.notify({
        type: 'negative',
        message: msg,
        icon: 'error'
      });
    }
  } finally {
    submitting.value = false;
  }
};
</script>
