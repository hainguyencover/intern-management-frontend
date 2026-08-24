<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 500px; max-width: 700px" class="q-pa-sm">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold text-primary">
          {{ isEditMode ? 'Chỉnh sửa nhiệm vụ' : 'Giao nhiệm vụ mới' }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
          <q-select
            v-if="!isEditMode"
            v-model="form.internIds"
            :options="internOptions"
            option-value="id"
            option-label="fullName"
            emit-value
            map-options
            multiple
            use-chips
            outlined
            label="Chọn Thực tập sinh *"
            :rules="[val => (val && val.length > 0) || 'Vui lòng chọn ít nhất 1 thực tập sinh']"
          />

          <div v-if="isEditMode && editTask?.assigneeName" class="q-mb-sm">
            <div class="text-caption text-grey-7">Người thực hiện</div>
            <q-chip icon="person" color="primary" text-color="white" dense>
              {{ editTask.assigneeName }}
            </q-chip>
          </div>

          <q-input
            v-model="form.title"
            outlined
            label="Tên nhiệm vụ *"
            placeholder="Ví dụ: Triển khai API đăng nhập OAuth2"
            :rules="[val => !!val || 'Tên nhiệm vụ không được để trống']"
          />

          <q-input
            v-model="form.description"
            type="textarea"
            outlined
            rows="3"
            label="Mô tả công việc"
            placeholder="Chi tiết yêu cầu, tiêu chí hoàn thành..."
          />

          <div class="row q-col-gutter-sm">
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.priority"
                :options="priorityOptions"
                emit-value
                map-options
                outlined
                label="Độ ưu tiên"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.weight"
                type="number"
                outlined
                label="Trọng số công việc (Weight)"
                hint="Dùng để tính tổng khối lượng công việc đánh giá"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-12 col-md-6">
              <q-input v-model="form.startDate" outlined type="date" label="Ngày bắt đầu" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.dueDate"
                outlined
                type="date"
                label="Hạn chót (Deadline) *"
                :rules="[val => !!val || 'Vui lòng chọn hạn chót']"
              />
            </div>
          </div>

          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn flat label="Hủy" color="grey-7" v-close-popup />
            <q-btn
              unelevated
              type="submit"
              :label="isEditMode ? 'Lưu thay đổi' : 'Giao nhiệm vụ'"
              color="primary"
              :loading="submitting"
            />
          </div>
        </q-form>
      </q-card-section>
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
  groupId: {
    type: Number,
    required: true
  },
  interns: {
    type: Array,
    default: () => []
  },
  submitting: {
    type: Boolean,
    default: false
  },
  editTask: {
    type: Object,
    default: () => null
  }
});

const emit = defineEmits(['update:modelValue', 'submit', 'update']);

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const isEditMode = computed(() => !!props.editTask);

const internOptions = computed(() => {
  return props.interns.map(i => ({
    id: i.internId || i.id || i.internProfileId,
    fullName: i.fullName || i.name || `TTS #${i.internId || i.id}`
  }));
});

const priorityOptions = [
  { label: 'Thấp (Low)', value: 'LOW' },
  { label: 'Trung bình (Medium)', value: 'MEDIUM' },
  { label: 'Cao (High)', value: 'HIGH' },
  { label: 'Khẩn cấp (Urgent)', value: 'URGENT' }
];

const form = ref(getDefaultForm());

function getDefaultForm() {
  return {
    internIds: [],
    title: '',
    description: '',
    priority: 'MEDIUM',
    startDate: new Date().toISOString().substring(0, 10),
    dueDate: '',
    weight: 1
  };
}

function formatDateForInput(dt) {
  if (!dt) return '';
  try {
    const d = new Date(dt);
    return d.toISOString().substring(0, 10);
  } catch {
    return '';
  }
}

watch(() => props.modelValue, (val) => {
  if (val) {
    if (props.editTask) {
      // Edit mode: pre-fill form
      form.value = {
        internIds: [],
        title: props.editTask.title || '',
        description: props.editTask.description || '',
        priority: props.editTask.priority || 'MEDIUM',
        startDate: formatDateForInput(props.editTask.startDate),
        dueDate: formatDateForInput(props.editTask.dueDate),
        weight: props.editTask.weight || 1
      };
    } else {
      // Create mode: reset form
      form.value = getDefaultForm();
    }
  }
});

function handleSubmit() {
  if (isEditMode.value) {
    emit('update', {
      taskId: props.editTask.id,
      groupId: props.groupId,
      internIds: props.editTask.assigneeInternId ? [props.editTask.assigneeInternId] : [],
      title: form.value.title,
      description: form.value.description,
      priority: form.value.priority,
      startDate: form.value.startDate ? `${form.value.startDate}T09:00:00` : null,
      dueDate: form.value.dueDate ? `${form.value.dueDate}T17:30:00` : null,
      weight: Number(form.value.weight) || 1
    });
  } else {
    emit('submit', {
      groupId: props.groupId,
      internIds: form.value.internIds,
      title: form.value.title,
      description: form.value.description,
      priority: form.value.priority,
      startDate: form.value.startDate ? `${form.value.startDate}T09:00:00` : null,
      dueDate: form.value.dueDate ? `${form.value.dueDate}T17:30:00` : null,
      weight: Number(form.value.weight) || 1
    });
  }
}
</script>
