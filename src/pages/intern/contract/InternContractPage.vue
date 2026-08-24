<template>
  <div class="intern-contract-page">
    <div class="text-h5 text-weight-bold q-mb-md">Hợp đồng Thực tập của tôi</div>

    <q-card flat bordered style="max-width: 700px">
      <q-card-section class="row items-center justify-between">
        <div>
          <div class="text-h6 text-weight-bold">Hợp đồng Thực tập sinh</div>
          <div class="text-caption text-grey-7">Số: {{ contract?.contractNumber || 'HD-2026-001' }}</div>
        </div>
        <q-chip :color="contract?.status === 'CONFIRMED' ? 'positive' : 'warning'" text-color="white" class="text-weight-bold">
          {{ contract?.status === 'CONFIRMED' ? 'Đã ký xác nhận' : 'Chờ xác nhận' }}
        </q-chip>
      </q-card-section>
      <q-separator />

      <q-card-section class="q-gutter-y-sm">
        <div class="row"><div class="col-4 text-grey-7">Ngày bắt đầu:</div><div class="col-8 text-weight-medium">{{ contract?.startDate || '2026-07-01' }}</div></div>
        <div class="row"><div class="col-4 text-grey-7">Ngày kết thúc:</div><div class="col-8 text-weight-medium">{{ contract?.endDate || '2026-09-30' }}</div></div>
        <div class="row" v-if="contract?.confirmedAt"><div class="col-4 text-grey-7">Ngày ký xác nhận:</div><div class="col-8 text-positive text-weight-bold">{{ contract.confirmedAt }}</div></div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md bg-grey-1">
        <q-btn outline color="primary" icon="download" label="Tải File PDF Hợp đồng" />
        <q-btn
          v-if="contract?.status !== 'CONFIRMED'"
          color="positive"
          icon="verified"
          label="Xác nhận Ký Hợp đồng"
          unelevated
          @click="showConfirmDialog = true"
        />
      </q-card-actions>
    </q-card>

    <ContractConfirmDialog
      v-model="showConfirmDialog"
      :contract="contract"
      @success="loadContract"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Contract } from '@/types/contract';
import contractService from '@/services/contract/contractService';
import ContractConfirmDialog from '@/components/contract/ContractConfirmDialog.vue';

const contract = ref<Contract | null>(null);
const showConfirmDialog = ref(false);

onMounted(() => {
  loadContract();
});

const loadContract = async () => {
  try {
    const contracts = await contractService.getContracts();
    contract.value = contracts[0] || mockContract;
  } catch (error) {
    contract.value = mockContract;
  }
};

const mockContract: Contract = {
  id: 1,
  contractNumber: 'HD-2026-001',
  internProfileId: 1,
  internName: 'Nguyễn Văn A',
  startDate: '2026-07-01',
  endDate: '2026-09-30',
  status: 'PENDING_CONFIRMATION',
  pdfUrl: '#',
  createdAt: '2026-07-01'
};
</script>
