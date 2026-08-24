<template>
  <q-card flat bordered class="q-pa-md q-mb-md rounded-borders">
    <div class="row items-center justify-between q-mb-sm">
      <div class="text-h6 text-primary flex items-center gap-2">
        <q-icon name="work" size="24px" />
        <span>Kinh nghiệm làm việc</span>
      </div>
      <q-btn color="primary" icon="add" label="Thêm kinh nghiệm" dense unelevated @click="showAddDialog = true" />
    </div>

    <div v-if="experiences.length === 0" class="text-grey-6 text-italic q-py-sm">
      Chưa có thông tin kinh nghiệm làm việc.
    </div>

    <q-timeline color="primary" v-else class="q-mt-sm">
      <q-timeline-entry
        v-for="exp in experiences"
        :key="exp.id"
        :title="exp.position"
        :subtitle="formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)"
        icon="business"
      >
        <div class="row items-center justify-between">
          <div class="text-subtitle1 text-bold text-dark">{{ exp.companyName }}</div>
          <q-btn flat round dense icon="delete" color="negative" size="sm" @click="$emit('remove-experience', exp.id)" />
        </div>
        <div class="text-body2 text-grey-8 q-mt-xs">{{ exp.description }}</div>
      </q-timeline-entry>
    </q-timeline>

    <!-- Dialog Thêm Kinh nghiệm -->
    <q-dialog v-model="showAddDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">Thêm kinh nghiệm làm việc</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="form.companyName" label="Tên công ty / Tổ chức *" outlined dense class="q-mb-md" />
          <q-input v-model="form.position" label="Vị trí / Chức danh *" outlined dense class="q-mb-md" />
          
          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-6">
              <q-input v-model="form.startDate" type="date" label="Ngày bắt đầu *" outlined dense />
            </div>
            <div class="col-6">
              <q-input v-model="form.endDate" type="date" label="Ngày kết thúc" outlined dense :disable="form.isCurrent" />
            </div>
          </div>

          <q-checkbox v-model="form.isCurrent" label="Đang làm việc tại đây" class="q-mb-md" />

          <q-input v-model="form.description" type="textarea" label="Mô tả công việc" outlined dense rows="3" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="grey" v-close-popup />
          <q-btn label="Thêm" color="primary" :disable="!form.companyName || !form.position || !form.startDate" @click="handleSave" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { MentorExperience, MentorExperiencePayload } from '@/types/mentor';

defineProps<{
  experiences: MentorExperience[];
}>();

const emit = defineEmits<{
  (e: 'add-experience', payload: MentorExperiencePayload): void;
  (e: 'remove-experience', expId: number): void;
}>();

const showAddDialog = ref(false);

const form = reactive<MentorExperiencePayload>({
  companyName: '',
  position: '',
  startDate: '',
  endDate: '',
  description: '',
  isCurrent: false
});

function formatDateRange(start: string, end?: string, isCurrent?: boolean): string {
  if (isCurrent) {
    return `${start} - Hiện tại`;
  }
  return end ? `${start} - ${end}` : start;
}

function handleSave() {
  emit('add-experience', { ...form });
  showAddDialog.value = false;
  form.companyName = '';
  form.position = '';
  form.startDate = '';
  form.endDate = '';
  form.description = '';
  form.isCurrent = false;
}
</script>
