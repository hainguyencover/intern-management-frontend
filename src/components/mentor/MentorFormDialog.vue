<template>
  <q-dialog v-model="modelValue" persistent @show="onShow">
    <q-card style="min-width: 420px; max-width: 520px">
      <q-card-section class="row items-center bg-teal-8 text-white">
        <q-icon :name="isEdit ? 'edit' : 'person_add'" size="md" class="q-mr-sm" />
        <div class="text-h6 text-weight-bold">{{ isEdit ? 'Sửa thông tin Mentor' : 'Thêm mới Mentor' }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <div>
            <q-input
              v-model="fullName"
              v-bind="fullNameAttrs"
              label="Họ và Tên Mentor (*)"
              outlined
              dense
              :error="!!errors.fullName"
              :error-message="errors.fullName"
            />
          </div>

          <div>
            <q-input
              v-model="email"
              v-bind="emailAttrs"
              label="Email (*)"
              outlined
              dense
              type="email"
              :error="!!errors.email"
              :error-message="errors.email"
            />
          </div>

          <div>
            <q-input
              v-model="phone"
              v-bind="phoneAttrs"
              label="Số điện thoại"
              outlined
              dense
            />
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input
                v-model="department"
                v-bind="departmentAttrs"
                label="Phòng ban (*)"
                outlined
                dense
                :error="!!errors.department"
                :error-message="errors.department"
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="position"
                v-bind="positionAttrs"
                label="Vị trí công tác (*)"
                outlined
                dense
                :error="!!errors.position"
                :error-message="errors.position"
              />
            </div>
          </div>

          <div>
            <q-input
              v-model.number="maxCapacity"
              v-bind="maxCapacityAttrs"
              label="Sức chứa tối đa (Số lượng TTS hướng dẫn)"
              outlined
              dense
              type="number"
              :error="!!errors.maxCapacity"
              :error-message="errors.maxCapacity"
            />
          </div>

          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn label="Hủy" flat color="grey-7" v-close-popup />
            <q-btn
              type="submit"
              :label="isEdit ? 'Cập nhật' : 'Tạo mới'"
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
import { mentorSchema } from '@/schemas/mentor.schema';
import mentorService from '@/services/mentor/mentorService';

const props = defineProps<{
  modelValue: boolean;
  mentorToEdit?: Mentor | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}>();

const modelValue = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
});

const isEdit = computed(() => !!props.mentorToEdit);
const loading = ref(false);

const { errors, defineField, handleSubmit, setValues, resetForm } = useForm({
  validationSchema: toTypedSchema(mentorSchema)
});

const [fullName, fullNameAttrs] = defineField('fullName');
const [email, emailAttrs] = defineField('email');
const [phone, phoneAttrs] = defineField('phone');
const [department, departmentAttrs] = defineField('department');
const [position, positionAttrs] = defineField('position');
const [maxCapacity, maxCapacityAttrs] = defineField('maxCapacity');

const onShow = () => {
  if (props.mentorToEdit) {
    setValues({
      fullName: props.mentorToEdit.fullName,
      email: props.mentorToEdit.email,
      phone: props.mentorToEdit.phone || '',
      department: props.mentorToEdit.department,
      position: props.mentorToEdit.position,
      maxCapacity: props.mentorToEdit.maxCapacity
    });
  } else {
    resetForm();
    setValues({ maxCapacity: 5 });
  }
};

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  try {
    if (isEdit.value && props.mentorToEdit) {
      await mentorService.updateMentor(props.mentorToEdit.id, values as any);
      Notify.create({ type: 'positive', message: 'Cập nhật Mentor thành công!' });
    } else {
      await mentorService.createMentor(values as any);
      Notify.create({ type: 'positive', message: 'Tạo mới Mentor thành công!' });
    }
    emit('update:modelValue', false);
    emit('success');
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Không thể lưu thông tin Mentor!'
    });
  } finally {
    loading.value = false;
  }
});
</script>
