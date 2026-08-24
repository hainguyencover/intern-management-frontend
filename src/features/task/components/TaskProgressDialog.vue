<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 450px; max-width: 600px" class="q-pa-sm">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold text-primary">Cập nhật tiến độ nhiệm vụ</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <div class="text-subtitle1 text-weight-bold q-mb-xs">{{ task?.title }}</div>
        <div class="text-caption text-grey-7 q-mb-md" v-if="task?.dueDate">
          Hạn chót: {{ formatDate(task.dueDate) }}
        </div>

        <div class="q-mb-lg">
          <div class="row justify-between items-center q-mb-xs">
            <span class="text-weight-medium">Phần trăm hoàn thành:</span>
            <span class="text-h6 text-weight-bold text-primary">{{ progress }}%</span>
          </div>

          <q-slider
            v-model="progress"
            :min="0"
            :max="100"
            :step="5"
            label
            label-always
            color="primary"
            class="q-mt-md"
          />
          <div class="row justify-between text-caption text-grey-6 q-mt-xs">
            <span>0% (Chưa bắt đầu)</span>
            <span>50% (Đang làm)</span>
            <span>100% (Hoàn thành)</span>
          </div>
        </div>

        <q-input
          v-model="note"
          type="textarea"
          outlined
          rows="3"
          label="Ghi chú / Báo cáo tiến độ"
          placeholder="Mô tả công việc đã làm hoặc khó khăn gặp phải..."
        />

        <div class="q-mt-md">
          <q-checkbox v-model="isSubmittingTask" label="Nộp nhiệm vụ này để Mentor phê duyệt" color="purple" />
        </div>
      </q-card-section>

      <q-card-actions align="right" class="bg-grey-1 text-teal">
        <q-btn flat label="Hủy" color="grey-7" v-close-popup />
        <q-btn
          unelevated
          :loading="submitting"
          label="Lưu cập nhật"
          color="primary"
          @click="handleSave"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

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

const emit = defineEmits(['update:modelValue', 'save', 'submit']);

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const progress = ref(0);
const note = ref('');
const isSubmittingTask = ref(false);

watch(() => props.task, (newTask) => {
  if (newTask) {
    progress.value = newTask.progressPercent || 0;
    note.value = '';
    isSubmittingTask.value = newTask.progressPercent === 100;
  }
}, { immediate: true });

function formatDate(dt) {
  if (!dt) return '';
  return new Date(dt).toLocaleDateString('vi-VN');
}

function handleSave() {
  if (isSubmittingTask.value || progress.value >= 100) {
    emit('submit', { taskId: props.task.id, note: note.value });
  } else {
    emit('save', {
      taskId: props.task.id,
      progressPercent: progress.value,
      content: note.value
    });
  }
}
</script>
