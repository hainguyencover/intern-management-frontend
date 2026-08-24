<template>
  <q-dialog v-model="modelValue" persistent @show="onShow">
    <q-card style="min-width: 420px; max-width: 520px">
      <q-card-section class="row items-center bg-teal-8 text-white">
        <q-icon name="person_add" size="md" class="q-mr-sm" />
        <div class="text-h6 text-weight-bold">Gán Mentor Hướng dẫn</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <div class="q-mb-md">
          <div class="text-subtitle2 text-grey-7">Thực tập sinh:</div>
          <div class="text-h6 text-weight-bold text-teal-10">{{ internName }}</div>
        </div>

        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <div>
            <q-select
              v-model="selectedMentorId"
              v-bind="selectedMentorIdAttrs"
              :options="mentorOptions"
              label="Chọn Mentor phụ trách (*)"
              outlined
              dense
              emit-value
              map-options
              :error="!!errors.mentorId"
              :error-message="errors.mentorId"
            >
              <template #option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon name="person" color="teal" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label caption>Tải lượng: {{ scope.opt.activeCount }} / {{ scope.opt.maxCapacity }} TTS</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-badge :color="scope.opt.isFull ? 'negative' : 'positive'">
                      {{ scope.opt.isFull ? 'Đã đầy tải' : 'Có thể nhận' }}
                    </q-badge>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div>
            <q-input
              v-model="notes"
              v-bind="notesAttrs"
              label="Ghi chú phân công"
              outlined
              dense
              type="textarea"
              rows="2"
            />
          </div>

          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn label="Hủy" flat color="grey-7" v-close-popup />
            <q-btn
              type="submit"
              label="Xác nhận Gán Mentor"
              color="teal-8"
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
import type { Mentor } from '@/types/mentor';
import { mentorAssignSchema } from '@/schemas/mentor.schema';
import mentorService from '@/services/mentor/mentorService';

const props = defineProps<{
  modelValue: boolean;
  internProfileId: number | null;
  internName?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}>();

const modelValue = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
});

const mentors = ref<Mentor[]>([]);
const loading = ref(false);

const mentorOptions = computed(() =>
  mentors.value.map((m) => {
    const isFull = m.activeInternCount >= m.maxCapacity;
    return {
      label: `${m.fullName} (${m.department})`,
      value: m.id,
      activeCount: m.activeInternCount,
      maxCapacity: m.maxCapacity,
      isFull,
      disable: isFull
    };
  })
);

const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(mentorAssignSchema)
});

const [selectedMentorId, selectedMentorIdAttrs] = defineField('mentorId');
const [notes, notesAttrs] = defineField('notes');

const onShow = async () => {
  resetForm();
  try {
    mentors.value = await mentorService.getMentors();
  } catch (e) {
    mentors.value = mockMentors;
  }
};

const onSubmit = handleSubmit(async (values) => {
  if (!props.internProfileId) return;
  loading.value = true;
  try {
    await mentorService.assignIntern({
      internProfileId: props.internProfileId,
      mentorId: values.mentorId,
      notes: values.notes
    });
    Notify.create({ type: 'positive', message: 'Gán Mentor cho Thực tập sinh thành công!' });
    emit('update:modelValue', false);
    emit('success');
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Không thể gán Mentor!'
    });
  } finally {
    loading.value = false;
  }
});

const mockMentors: Mentor[] = [
  { id: 101, userId: 3, fullName: 'Lê Văn Mentor', email: 'mentor@holaho.com', department: 'Software Engineering', position: 'Senior Developer', maxCapacity: 5, activeInternCount: 4, status: 'ACTIVE', createdAt: '2026-01-01' },
  { id: 102, userId: 5, fullName: 'Nguyễn Văn Lead', email: 'lead@holaho.com', department: 'Software Engineering', position: 'Tech Lead', maxCapacity: 3, activeInternCount: 3, status: 'ACTIVE', createdAt: '2026-01-01' }
];
</script>
