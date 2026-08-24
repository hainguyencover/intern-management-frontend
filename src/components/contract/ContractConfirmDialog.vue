<template>
  <q-dialog v-model="modelValue" persistent>
    <q-card style="min-width: 450px; max-width: 550px">
      <q-card-section class="row items-center bg-blue-9 text-white">
        <q-icon name="verified" size="md" class="q-mr-sm" />
        <div class="text-h6 text-weight-bold">Xác nhận Hợp đồng Thực tập</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <div class="text-body2 text-grey-8 q-mb-md">
          Vui lòng kiểm tra kỹ số hợp đồng và thời hạn thực tập bên dưới trước khi bấm xác nhận ký điện tử.
        </div>

        <q-card flat bordered class="bg-grey-2 q-pa-md q-mb-md">
          <div class="row q-mb-xs"><div class="col-5 text-grey-7">Số hợp đồng:</div><div class="col-7 text-weight-bold">{{ contract?.contractNumber }}</div></div>
          <div class="row q-mb-xs"><div class="col-5 text-grey-7">Ngày bắt đầu:</div><div class="col-7">{{ contract?.startDate }}</div></div>
          <div class="row q-mb-xs"><div class="col-5 text-grey-7">Ngày kết thúc:</div><div class="col-7">{{ contract?.endDate }}</div></div>
        </q-card>

        <q-checkbox v-model="agreed" label="Tôi đã đọc và đồng ý với các điều khoản trong Hợp đồng Thực tập" color="primary" class="q-mb-md" />

        <div class="row justify-end q-gutter-sm">
          <q-btn label="Đóng" flat color="grey-7" v-close-popup />
          <q-btn
            label="Xác nhận Ký Hợp đồng"
            color="positive"
            icon="task_alt"
            unelevated
            :disable="!agreed"
            :loading="loading"
            @click="onConfirm"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Notify } from 'quasar';
import type { Contract } from '@/types/contract';
import contractService from '@/services/contract/contractService';

const props = defineProps<{
  modelValue: boolean;
  contract: Contract | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}>();

const modelValue = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
});

const agreed = ref(false);
const loading = ref(false);

const onConfirm = async () => {
  if (!props.contract) return;
  loading.value = true;
  try {
    await contractService.confirmContract(props.contract.id);
    Notify.create({ type: 'positive', message: 'Ký xác nhận hợp đồng thành công!' });
    emit('update:modelValue', false);
    emit('success');
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Xác nhận hợp đồng thất bại!'
    });
  } finally {
    loading.value = false;
  }
};
</script>
