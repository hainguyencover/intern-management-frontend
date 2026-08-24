<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 450px; max-width: 600px" class="q-pa-sm">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold text-negative">Hủy nhiệm vụ</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <div class="text-subtitle1 text-weight-bold q-mb-xs">{{ task?.title }}</div>
        <div class="text-caption text-grey-7 q-mb-md">
          Sau khi hủy, nhiệm vụ sẽ bị khóa và thực tập sinh không thể tiếp tục thực hiện.
        </div>

        <q-input
          v-model="reason"
          type="textarea"
          outlined
          rows="3"
          label="Lý do hủy nhiệm vụ *"
          placeholder="Ví dụ: Thay đổi yêu cầu dự án, công việc không còn cần thiết..."
          :rules="[val => !!val || 'Bắt buộc nhập lý do hủy nhiệm vụ']"
        />
      </q-card-section>

      <q-card-actions align="right" class="bg-grey-1">
        <q-btn flat label="Quay lại" color="grey-7" v-close-popup />
        <q-btn
          unelevated
          :loading="submitting"
          label="Xác nhận hủy nhiệm vụ"
          color="negative"
          @click="handleConfirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  task: {
    type: Object,
    default: () => null
  },
  submitting: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const reason = ref('');

watch(() => props.modelValue, (val) => {
  if (val) {
    reason.value = '';
  }
});

function handleConfirm() {
  if (!reason.value.trim()) return;
  emit('confirm', { taskId: props.task.id, reason: reason.value });
}
</script>
