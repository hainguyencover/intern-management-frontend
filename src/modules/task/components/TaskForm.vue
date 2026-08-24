<template>
  <form @submit.prevent="$emit('save')">
    <div class="q-gutter-y-md">
      <BaseInput
        :model-value="title"
        label="Tên nhiệm vụ *"
        placeholder="VD: Triển khai giao diện Dashboard"
        :error="titleError"
        @update:model-value="$emit('update:title', $event)"
      />

      <BaseTextarea
        :model-value="description"
        label="Mô tả chi tiết *"
        placeholder="Nhập yêu cầu chi tiết của nhiệm vụ..."
        :error="descError"
        @update:model-value="$emit('update:description', $event)"
      />

      <BaseSelect
        :model-value="assigneeId"
        :options="internOptions"
        label="Giao cho Thực tập sinh *"
        @update:model-value="$emit('update:assigneeId', $event)"
      />

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <BaseSelect
            :model-value="priority"
            :options="priorityOptions"
            label="Mức độ ưu tiên"
            @update:model-value="$emit('update:priority', $event)"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            outlined
            dense
            :model-value="dueDate"
            label="Hạn hoàn thành *"
            placeholder="YYYY-MM-DD"
            @update:model-value="$emit('update:dueDate', $event)"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    :model-value="dueDate"
                    mask="YYYY-MM-DD"
                    @update:model-value="(val) => { $emit('update:dueDate', val); }"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Đóng" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseInput from '../../../shared/components/BaseInput.vue';
import BaseTextarea from '../../../shared/components/BaseTextarea.vue';
import BaseSelect from '../../../shared/components/BaseSelect.vue';
import { apiClient as api } from '../../../shared/api/client';
import type { TaskPriority } from '../models/task';

const props = defineProps<{
  title: string;
  description: string;
  assigneeId: any;
  dueDate: string;
  priority: TaskPriority;
  titleError?: string;
  descError?: string;
}>();

const emit = defineEmits<{
  (e: 'update:title', value: string): void;
  (e: 'update:description', value: string): void;
  (e: 'update:assigneeId', value: any): void;
  (e: 'update:dueDate', value: string): void;
  (e: 'update:priority', value: TaskPriority): void;
  (e: 'save'): void;
}>();

const internOptions = ref<Array<{ label: string; value: any }>>([]);

const priorityOptions = [
  { label: 'Thấp (Low)', value: 'LOW' },
  { label: 'Trung bình (Medium)', value: 'MEDIUM' },
  { label: 'Cao (High)', value: 'HIGH' },
  { label: 'Khẩn cấp (Urgent)', value: 'URGENT' }
];

async function loadInterns() {
  try {
    const res = await api.get('/api/v1/mentors/assigned-interns').catch(() => api.get('/api/v1/interns'));
    if (res && res.data && res.data.data) {
      const list = res.data.data.content || res.data.data;
      if (Array.isArray(list) && list.length > 0) {
        internOptions.value = list.map((item: any) => ({
          label: `${item.fullName || item.user?.fullName || 'TTS'} (${item.studentCode || ('ID: ' + item.id)})`,
          value: item.id
        }));
        if (!props.assigneeId || !internOptions.value.some(opt => opt.value === props.assigneeId)) {
          emit('update:assigneeId', internOptions.value[0].value);
        }
      }
    }
  } catch (err) {
  }
}


onMounted(() => {
  loadInterns();
});
</script>
