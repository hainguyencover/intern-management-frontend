<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 600px; max-width: 800px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold">
          {{ isEdit ? 'Cập nhật thông tin Mentor' : 'Thêm mới Mentor' }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-form @submit="onSubmit" class="q-gutter-md">
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.fullName"
                label="Họ và tên *"
                outlined
                dense
                :rules="[val => !!val || 'Vui lòng nhập họ tên']"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.employeeCode"
                label="Mã nhân viên *"
                outlined
                dense
                :disabled="isEdit"
                :rules="[val => !!val || 'Vui lòng nhập mã nhân viên']"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.email"
                label="Email *"
                outlined
                dense
                type="email"
                :disabled="isEdit"
                :rules="[
                  val => !!val || 'Vui lòng nhập email',
                  val => /.+@.+\..+/.test(val) || 'Email không hợp lệ'
                ]"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.phone"
                label="Số điện thoại"
                outlined
                dense
                mask="###########"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.departmentId"
                label="Mã phòng ban (Department ID)"
                outlined
                dense
                type="number"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.position"
                label="Chức danh (Position)"
                outlined
                dense
                placeholder="VD: Senior Backend Developer"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.specialization"
                label="Chuyên môn (Specialization)"
                outlined
                dense
                placeholder="VD: Java, Spring Boot, Microservices"
              />
            </div>

            <div class="col-12 col-md-3">
              <q-input
                v-model.number="form.yearsOfExperience"
                label="Số năm kinh nghiệm"
                outlined
                dense
                type="number"
                step="0.5"
                min="0"
              />
            </div>

            <div class="col-12 col-md-3">
              <q-input
                v-model.number="form.capacity"
                label="Giới hạn TTS (Capacity) *"
                outlined
                dense
                type="number"
                min="0"
                :rules="[val => val >= 0 || 'Capacity không được âm']"
              />
            </div>

            <div class="col-12" v-if="isEdit">
              <q-select
                v-model="form.status"
                :options="statusOptions"
                label="Trạng thái"
                outlined
                dense
                emit-value
                map-options
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="form.bio"
                label="Giới thiệu (Bio)"
                outlined
                dense
                type="textarea"
                rows="3"
              />
            </div>
          </div>

          <div class="row justify-end q-gutter-sm">
            <q-btn label="Hủy" flat v-close-popup />
            <q-btn
              type="submit"
              :label="isEdit ? 'Lưu thay đổi' : 'Tạo Mentor'"
              color="primary"
              :loading="submitting"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { mentorApi } from '../api/mentorApi';
import type { Mentor, CreateMentorPayload, UpdateMentorPayload, MentorStatus } from '../types/mentor';

const $q = useQuasar();

const props = defineProps<{
  modelValue: boolean;
  mentorData?: Mentor | null;
}>();

const emit = defineEmits(['update:modelValue', 'saved']);

const isOpen = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
});

const isEdit = computed(() => !!props.mentorData?.id);
const submitting = ref(false);

const form = ref({
  fullName: '',
  email: '',
  phone: '',
  employeeCode: '',
  departmentId: undefined as number | undefined,
  position: '',
  title: '',
  specialization: '',
  yearsOfExperience: 3,
  capacity: 5,
  status: 'ACTIVE' as MentorStatus,
  bio: '',
});

const statusOptions = [
  { label: 'Đang hoạt động (ACTIVE)', value: 'ACTIVE' },
  { label: 'Ngưng hoạt động (INACTIVE)', value: 'INACTIVE' },
  { label: 'Đang nghỉ phép (ON_LEAVE)', value: 'ON_LEAVE' },
  { label: 'Tạm khóa (SUSPENDED)', value: 'SUSPENDED' },
];

watch(
  () => props.mentorData,
  val => {
    if (val) {
      form.value = {
        fullName: val.fullName || '',
        email: val.email || '',
        phone: val.phone || '',
        employeeCode: val.employeeCode || '',
        departmentId: val.departmentId,
        position: val.position || '',
        title: val.title || '',
        specialization: val.specialization || '',
        yearsOfExperience: val.yearsOfExperience || 0,
        capacity: val.capacity || 5,
        status: val.status || 'ACTIVE',
        bio: val.bio || '',
      };
    } else {
      form.value = {
        fullName: '',
        email: '',
        phone: '',
        employeeCode: `MTR-${Math.floor(10000 + Math.random() * 90000)}`,
        departmentId: undefined,
        position: '',
        title: '',
        specialization: '',
        yearsOfExperience: 3,
        capacity: 5,
        status: 'ACTIVE',
        bio: '',
      };
    }
  },
  { immediate: true }
);

async function onSubmit() {
  submitting.value = true;
  try {
    if (isEdit.value && props.mentorData) {
      const payload: UpdateMentorPayload = {
        fullName: form.value.fullName,
        phone: form.value.phone,
        departmentId: form.value.departmentId,
        position: form.value.position,
        specialization: form.value.specialization,
        yearsOfExperience: form.value.yearsOfExperience,
        capacity: form.value.capacity,
        status: form.value.status,
        bio: form.value.bio,
      };
      await mentorApi.updateMentor(props.mentorData.id, payload);
      $q.notify({ type: 'positive', message: 'Cập nhật Mentor thành công!' });
    } else {
      const payload: CreateMentorPayload = {
        fullName: form.value.fullName,
        email: form.value.email,
        phone: form.value.phone,
        employeeCode: form.value.employeeCode,
        departmentId: form.value.departmentId,
        position: form.value.position,
        specialization: form.value.specialization,
        yearsOfExperience: form.value.yearsOfExperience,
        capacity: form.value.capacity,
        bio: form.value.bio,
      };
      await mentorApi.createMentor(payload);
      $q.notify({ type: 'positive', message: 'Tạo Mentor thành công!' });
    }
    isOpen.value = false;
    emit('saved');
  } catch (err: any) {
    const errMsg = err?.response?.data?.message || err?.message || 'Có lỗi xảy ra!';
    $q.notify({ type: 'negative', message: errMsg });
  } finally {
    submitting.value = false;
  }
}
</script>
