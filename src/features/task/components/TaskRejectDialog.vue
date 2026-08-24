<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 450px; max-width: 600px" class="q-pa-sm">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold text-deep-orange-9">Yêu cầu làm lại nhiệm vụ</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <div class="text-subtitle1 text-weight-bold q-mb-xs">{{ task?.title }}</div>
        <div class="text-caption text-grey-7 q-mb-md" v-if="task?.assigneeName">
          Thực tập sinh: {{ task.assigneeName }}
        </div>

        <q-input
          v-model="reason"
          type="textarea"
          outlined
          rows="4"
          label="Lý do yêu cầu làm lại / Ghi chú phản hồi *"
          placeholder="Ví dụ: Thiếu Unit Test cho phần AuthService, vui lòng bổ sung trước khi nộp lại..."
          :rules="[val => !!val || 'Vui lòng nhập lý do phản hồi cho thực tập sinh']"
        />
      </q-card-section>

      <q-card-actions align="right" class="bg-grey-1">
        <q-btn flat label="Hủy" color="grey-7" v-close-popup />
        <q-btn
          unelevated
          :loading="submitting"
          label="Gửi yêu cầu làm lại"
          color="deep-orange-8"
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
