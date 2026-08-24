<template>
  <q-dialog v-model="modelValue" persistent @show="onShow">
    <q-card style="min-width: 450px; max-width: 550px">
      <q-card-section class="row items-center bg-teal-8 text-white">
        <q-icon :name="isEdit ? 'edit' : 'add_business'" size="md" class="q-mr-sm" />
        <div class="text-h6 text-weight-bold">{{ isEdit ? 'Sửa Chương trình Thực tập' : 'Tạo mới Chương trình Thực tập' }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <div>
            <q-input
              v-model="code"
              v-bind="codeAttrs"
              label="Mã chương trình"
              outlined
              dense
              placeholder="INT-2026-Q3"
              :disable="isEdit"
              :error="!!errors.code"
              :error-message="errors.code"
            />
          </div>

          <div>
            <q-input
              v-model="name"
              v-bind="nameAttrs"
              label="Tên chương trình tuyển dụng"
              outlined
              dense
              placeholder="Chương trình Thực tập Mùa Thu 2026"
              :error="!!errors.name"
              :error-message="errors.name"
            />
          </div>

          <div>
            <q-input
              v-model="description"
              v-bind="descriptionAttrs"
              label="Mô tả chi tiết"
              outlined
              dense
              type="textarea"
              rows="2"
            />
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input
                v-model="startDate"
                v-bind="startDateAttrs"
                label="Ngày bắt đầu"
                outlined
                dense
                type="date"
                stack-label
                :error="!!errors.startDate"
                :error-message="errors.startDate"
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="endDate"
                v-bind="endDateAttrs"
                label="Ngày kết thúc"
                outlined
                dense
                type="date"
                stack-label
                :error="!!errors.endDate"
                :error-message="errors.endDate"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input
                v-model.number="maxCapacity"
                v-bind="maxCapacityAttrs"
                label="Số lượng chỉ tiêu"
                outlined
                dense
                type="number"
                :error="!!errors.maxCapacity"
                :error-message="errors.maxCapacity"
              />
            </div>
            <div class="col-6">
              <q-select
                v-model="status"
                v-bind="statusAttrs"
                :options="statusOptions"
                label="Trạng thái"
                outlined
                dense
                emit-value
                map-options
                :error="!!errors.status"
                :error-message="errors.status"
              />
            </div>
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
import type { Program } from '@/types/program';
import { programSchema } from '@/schemas/program.schema';
import programService from '@/services/program/programService';

const props = defineProps<{
  modelValue: boolean;
  programToEdit?: Program | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}>();

const modelValue = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
});

const isEdit = computed(() => !!props.programToEdit);
const loading = ref(false);

const statusOptions = [
  { label: 'Hoạt động (ACTIVE)', value: 'ACTIVE' },
  { label: 'Đóng (CLOSED)', value: 'CLOSED' },
  { label: 'Bản nháp (DRAFT)', value: 'DRAFT' }
];

const { errors, defineField, handleSubmit, setValues, resetForm } = useForm({
  validationSchema: toTypedSchema(programSchema)
});

const [code, codeAttrs] = defineField('code');
const [name, nameAttrs] = defineField('name');
const [description, descriptionAttrs] = defineField('description');
const [startDate, startDateAttrs] = defineField('startDate');
const [endDate, endDateAttrs] = defineField('endDate');
const [maxCapacity, maxCapacityAttrs] = defineField('maxCapacity');
const [status, statusAttrs] = defineField('status');

const onShow = () => {
  if (props.programToEdit) {
    setValues({
      code: props.programToEdit.code,
      name: props.programToEdit.name,
      description: props.programToEdit.description || '',
      startDate: props.programToEdit.startDate,
      endDate: props.programToEdit.endDate,
      maxCapacity: props.programToEdit.maxCapacity,
      status: props.programToEdit.status
    });
  } else {
    resetForm();
    setValues({
      maxCapacity: 30,
      status: 'ACTIVE'
    });
  }
};

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  try {
    if (isEdit.value && props.programToEdit) {
      await programService.updateProgram(props.programToEdit.id, values as any);
      Notify.create({ type: 'positive', message: 'Cập nhật chương trình thành công!' });
    } else {
      await programService.createProgram(values as any);
      Notify.create({ type: 'positive', message: 'Tạo mới chương trình thành công!' });
    }
    emit('update:modelValue', false);
    emit('success');
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin chương trình!'
    });
  } finally {
    loading.value = false;
  }
});
</script>
