<template>
  <div class="contract-list-page">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">Quản lý Hợp đồng Thực tập</div>
        <div class="text-caption text-grey-7">Tải lên và theo dõi trạng thái ký kết hợp đồng</div>
      </div>
    </div>

    <!-- Contracts Table -->
    <BaseTable
      title="Danh sách Hợp đồng"
      :rows="contracts"
      :columns="columns"
      :loading="loading"
    >
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-chip :color="props.value === 'CONFIRMED' ? 'positive' : 'warning'" text-color="white" dense class="text-weight-bold">
            {{ props.value === 'CONFIRMED' ? 'Đã ký xác nhận' : 'Chờ xác nhận' }}
          </q-chip>
        </q-td>
      </template>
    </BaseTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Contract } from '@/types/contract';
import type { QTableProps } from 'quasar';
import contractService from '@/services/contract/contractService';
import BaseTable from '@/components/table/BaseTable.vue';

const contracts = ref<Contract[]>([]);
const loading = ref(false);

const columns: QTableProps['columns'] = [
  { name: 'contractNumber', label: 'Số Hợp đồng', field: 'contractNumber', align: 'left', sortable: true },
  { name: 'internName', label: 'Thực tập sinh', field: 'internName', align: 'left', sortable: true },
  { name: 'startDate', label: 'Ngày bắt đầu', field: 'startDate', align: 'center' },
  { name: 'endDate', label: 'Ngày kết thúc', field: 'endDate', align: 'center' },
  { name: 'status', label: 'Trạng thái Ký', field: 'status', align: 'center' }
];

onMounted(() => {
  loadContracts();
});

const loadContracts = async () => {
  loading.value = true;
  try {
    contracts.value = await contractService.getContracts();
  } catch (error) {
    contracts.value = mockContracts;
  } finally {
    loading.value = false;
  }
};

const mockContracts: Contract[] = [
  { id: 1, contractNumber: 'HD-2026-001', internProfileId: 1, internName: 'Nguyễn Văn A', startDate: '2026-07-01', endDate: '2026-09-30', status: 'CONFIRMED', pdfUrl: '/files/contract1.pdf', confirmedAt: '2026-07-02', createdAt: '2026-07-01' },
  { id: 2, contractNumber: 'HD-2026-002', internProfileId: 2, internName: 'Trần Thị B', startDate: '2026-08-01', endDate: '2026-10-31', status: 'PENDING_CONFIRMATION', pdfUrl: '/files/contract2.pdf', createdAt: '2026-08-01' }
];
</script>
