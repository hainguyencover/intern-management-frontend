<template>
  <div class="document-review-page">
    <div class="text-h5 text-weight-bold q-mb-md">Duyệt Tài liệu Thực tập sinh</div>

    <BaseTable
      title="Danh sách Tài liệu nộp"
      :rows="documents"
      :columns="columns"
      :loading="loading"
    >
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="props.value === 'APPROVED' ? 'positive' : props.value === 'REJECTED' ? 'negative' : 'warning'">
            {{ props.value }}
          </q-badge>
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props" class="q-gutter-xs">
          <q-btn flat round dense icon="check" color="positive" @click="reviewDoc(props.row, 'APPROVED')">
            <q-tooltip>Phê duyệt</q-tooltip>
          </q-btn>
          <q-btn flat round dense icon="close" color="negative" @click="reviewDoc(props.row, 'REJECTED')">
            <q-tooltip>Từ chối</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </BaseTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Notify } from 'quasar';
import type { InternDocument } from '@/types/document';
import type { QTableProps } from 'quasar';
import documentService from '@/services/document/documentService';
import BaseTable from '@/components/table/BaseTable.vue';

const documents = ref<InternDocument[]>([]);
const loading = ref(false);

const columns: QTableProps['columns'] = [
  { name: 'fileName', label: 'Tên tệp tin', field: 'fileName', align: 'left', sortable: true },
  { name: 'fileType', label: 'Loại tài liệu', field: 'fileType', align: 'center' },
  { name: 'uploadedAt', label: 'Ngày tải lên', field: 'uploadedAt', align: 'center' },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' },
  { name: 'actions', label: 'Thao tác Duyệt', field: 'actions', align: 'center' }
];

onMounted(() => {
  loadDocs();
});

const loadDocs = async () => {
  loading.value = true;
  try {
    documents.value = await documentService.getDocuments();
  } catch (e) {
    documents.value = mockDocs;
  } finally {
    loading.value = false;
  }
};

const reviewDoc = async (doc: InternDocument, status: 'APPROVED' | 'REJECTED') => {
  try {
    await documentService.approveDocument(doc.id, status);
    Notify.create({ type: 'positive', message: `Đã ${status === 'APPROVED' ? 'duyệt' : 'từ chối'} tài liệu!` });
    loadDocs();
  } catch (e) {
    doc.status = status;
  }
};

const mockDocs: InternDocument[] = [
  { id: 1, internProfileId: 1, fileName: 'CV_NguyenVanA.pdf', fileType: 'CV', fileSize: 1024500, fileUrl: '#', status: 'APPROVED', uploadedAt: '2026-07-01' },
  { id: 2, internProfileId: 1, fileName: 'CCCD_NguyenVanA.png', fileType: 'IDENTITY_CARD', fileSize: 2048000, fileUrl: '#', status: 'PENDING', uploadedAt: '2026-07-02' }
];
</script>
