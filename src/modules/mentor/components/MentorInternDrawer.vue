<template>
  <q-dialog v-model="isOpen" position="right" full-height style="min-width: 450px;">
    <q-card style="width: 550px; max-width: 90vw;" class="column full-height">
      <!-- Drawer Header -->
      <q-card-section class="bg-primary text-white row items-center q-pb-md">
        <div>
          <div class="text-h6 text-weight-bold">{{ mentor?.mentorName || 'Chi tiết Mentor' }}</div>
          <div class="text-caption text-blue-2">
            Mã: {{ mentor?.employeeCode }} | Phòng ban: {{ mentor?.departmentName || 'Chưa phân công' }}
          </div>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup text-color="white" />
      </q-card-section>

      <!-- Workload Capacity Bar Header -->
      <q-card-section class="bg-grey-2 border-bottom q-py-sm">
        <div class="row items-center justify-between text-caption q-mb-xs">
          <span>Tải công việc hiện tại:</span>
          <span class="text-weight-bold" :class="mentor?.utilizationPercent && mentor.utilizationPercent > 100 ? 'text-negative' : 'text-primary'">
            {{ mentor?.currentInternCount || 0 }} / {{ mentor?.maxInternCapacity || 10 }} TTS ({{ mentor?.utilizationPercent || 0 }}%)
          </span>
        </div>
        <q-linear-progress
          :value="Math.min((mentor?.utilizationPercent || 0) / 100, 1)"
          :color="progressColor"
          size="10px"
          rounded
        />
      </q-card-section>

      <!-- Content Section -->
      <q-card-section class="col scroll q-pa-md">
        <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-sm row items-center justify-between">
          <span>Danh sách Thực tập sinh đang quản lý ({{ interns.length }})</span>
          <q-btn
            icon="refresh"
            flat
            round
            dense
            size="sm"
            color="primary"
            :loading="loading"
            @click="loadInterns"
          />
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="row justify-center q-my-xl">
          <q-spinner color="primary" size="3em" />
        </div>

        <!-- Empty state -->
        <div v-else-if="interns.length === 0" class="text-center q-pa-xl text-grey-6">
          <q-icon name="person_off" size="48px" />
          <div class="q-mt-sm">Mentor này chưa được phân công thực tập sinh nào.</div>
        </div>

        <!-- Intern List -->
        <q-list v-else separator bordered class="rounded-borders">
          <q-item v-for="intern in interns" :key="intern.assignmentId" class="q-py-md">
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" icon="person" size="40px" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-bold text-primary">
                {{ intern.fullName }}
                <q-chip size="xs" color="grey-3" text-color="grey-9" class="q-ml-xs">
                  {{ intern.internCode }}
                </q-chip>
              </q-item-label>

              <q-item-label caption class="q-mt-xs">
                <div><q-icon name="school" size="14px" class="q-mr-xs" /> {{ intern.university || 'N/A' }}</div>
                <div><q-icon name="assignment" size="14px" class="q-mr-xs" /> Chương trình: {{ intern.programName || 'Chưa xếp' }}</div>
                <div v-if="intern.startDate"><q-icon name="event" size="14px" class="q-mr-xs" /> Từ {{ formatDate(intern.startDate) }}</div>
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-chip
                dense
                size="xs"
                :color="intern.assignmentType === 'PRIMARY' ? 'blue-1' : 'purple-1'"
                :text-color="intern.assignmentType === 'PRIMARY' ? 'blue-9' : 'purple-9'"
                class="text-weight-bold"
              >
                {{ intern.assignmentType === 'PRIMARY' ? 'Chính' : 'Phụ' }}
              </q-chip>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <!-- Footer Actions -->
      <q-card-actions align="right" class="bg-grey-1 border-top q-pa-sm">
        <q-btn label="Đóng" color="grey-7" flat v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { mentorWorkloadApi } from '../api/mentorWorkloadApi';
import type { MentorWorkload, MentorActiveIntern } from '../types/mentorWorkload';

const props = defineProps<{
  modelValue: boolean;
  mentor: MentorWorkload | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const interns = ref<MentorActiveIntern[]>([]);
const loading = ref(false);

const progressColor = computed(() => {
  const util = props.mentor?.utilizationPercent || 0;
  if (util > 100) return 'negative';
  if (util >= 81) return 'warning';
  if (util >= 61) return 'positive';
  return 'blue-7';
});

const loadInterns = async () => {
  if (!props.mentor?.mentorId) return;
  loading.value = true;
  try {
    const res = await mentorWorkloadApi.getMentorActiveInterns(props.mentor.mentorId);
    if (res.data?.success) {
      interns.value = res.data.data || [];
    }
  } catch (err) {
    console.error('Lỗi khi tải danh sách TTS của mentor:', err);
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.modelValue,
  (val) => {
    if (val && props.mentor?.mentorId) {
      loadInterns();
    }
  }
);

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN');
};
</script>
