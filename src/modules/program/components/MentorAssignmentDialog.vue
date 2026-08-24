<template>
  <q-dialog v-model="dialogModel" persistent>
    <q-card style="min-width: 480px; max-width: 600px" class="q-pa-sm">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-primary font-weight-bold">
          Phân công Mentor
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md" v-if="intern">
        <div class="q-mb-md q-pa-sm bg-grey-2 rounded-borders">
          <div class="text-subtitle2 text-weight-bold">{{ intern.fullName || intern.name }}</div>
          <div class="text-caption text-grey-8">{{ intern.email }} • Mã TTS: {{ intern.studentCode || intern.id }}</div>
        </div>

        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-select
            v-model="selectedMentorId"
            :options="mentorOptions"
            option-value="id"
            option-label="label"
            emit-value
            map-options
            label="Chọn Mentor hướng dẫn *"
            outlined
            dense
            :rules="[val => !!val || 'Vui lòng chọn Mentor']"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" :disable="scope.opt.isFull">
                <q-item-section>
                  <q-item-label class="text-weight-medium">{{ scope.opt.fullName }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.email }} • {{ scope.opt.departmentName || 'Chưa chọn phòng ban' }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <MentorCapacityIndicator :count="scope.opt.activeCount" :maxCapacity="5" />
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-input
            v-model="reason"
            type="textarea"
            label="Ghi chú / Lý do phân công"
            outlined
            dense
            rows="2"
          />

          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn label="Hủy" color="grey" flat v-close-popup />
            <q-btn label="Xác nhận phân công" color="primary" type="submit" :loading="submitting" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import MentorCapacityIndicator from './MentorCapacityIndicator.vue'

const props = defineProps<{
  modelValue: boolean
  intern: any
  mentors: any[]
}>()

const emit = defineEmits(['update:modelValue', 'assigned'])

const dialogModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const selectedMentorId = ref<number | null>(null)
const reason = ref('')
const submitting = ref(false)

watch(() => props.intern, (newVal) => {
  if (newVal && newVal.mentorId) {
    selectedMentorId.value = newVal.mentorId
  } else {
    selectedMentorId.value = null
  }
}, { immediate: true })

const mentorOptions = computed(() => {
  return (props.mentors || []).map(m => {
    const activeCount = m.activeInternCount || m.activeCount || 0
    const isFull = activeCount >= 5
    return {
      id: m.id,
      fullName: m.fullName || (m.user ? m.user.fullName : `Mentor #${m.id}`),
      email: m.email || (m.user ? m.user.email : ''),
      departmentName: m.departmentName || (m.department ? m.department.name : ''),
      label: `${m.fullName || (m.user ? m.user.fullName : `Mentor #${m.id}`)} (${activeCount}/5 TTS)`,
      activeCount,
      isFull
    }
  })
})

const onSubmit = async () => {
  if (!selectedMentorId.value || !props.intern) return
  submitting.value = true
  try {
    emit('assigned', {
      internId: props.intern.id,
      mentorId: selectedMentorId.value,
      reason: reason.value
    })
    dialogModel.value = false
  } finally {
    submitting.value = false
  }
}
</script>
