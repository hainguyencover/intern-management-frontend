<template>
  <div class="intern-document-page">
    <div class="text-h5 text-weight-bold q-mb-md">Quản lý Tài liệu cá nhân</div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-5">
        <DocumentUploader @success="loadDocuments" />
      </div>

      <div class="col-12 col-md-7">
        <BaseTable
          title="Tài liệu đã Tải lên"
          :rows="documents"
          :columns="columns"
          :loading="loading"
        >
          <template #body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="props.value === 'APPROVED' ? 'positive' : props.value === 'REJECTED' ? 'negative' : 'warning'">
                {{ props.value === 'APPROVED' ? 'Đã duyệt' : props.value === 'REJECTED' ? 'Từ chối' : 'Chờ duyệt' }}
              </q-badge>
            </q-td>
          </template>

          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat round dense icon="delete" color="negative" @click="deleteDoc(props.row.id)">
                <q-tooltip>Xóa tài liệu</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </BaseTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Notify } from 'quasar';
import type { InternDocument } from '@/types/document';
import type { QTableProps } from 'quasar';
import documentService from '@/services/document/documentService';
import DocumentUploader from '@/components/document/DocumentUploader.vue';
import BaseTable from '@/components/table/BaseTable.vue';

const documents = ref<InternDocument[]>([]);
const loading = ref(false);

const columns: QTableProps['columns'] = [
  { name: 'fileName', label: 'Tên tệp tin', field: 'fileName', align: 'left', sortable: true },
  { name: 'fileType', label: 'Loại tài liệu', field: 'fileType', align: 'center' },
  { name: 'uploadedAt', label: 'Ngày tải lên', field: 'uploadedAt', align: 'center' },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' },
  { name: 'actions', label: 'Thao tác', field: 'actions', align: 'center' }
];

onMounted(() => {
  loadDocuments();
});

const loadDocuments = async () => {
  loading.value = true;
  try {
    documents.value = await documentService.getDocuments();
  } catch (error) {
    documents.value = mockDocs;
  } finally {
    loading.value = false;
  }
};

const deleteDoc = async (id: number) => {
  try {
    await documentService.deleteDocument(id);
    Notify.create({ type: 'positive', message: 'Đã xóa tài liệu!' });
    loadDocuments();
  } catch (e) {
    documents.value = documents.value.filter((d) => d.id !== id);
  }
};

const mockDocs: InternDocument[] = [
  { id: 1, internProfileId: 1, fileName: 'CV_NguyenVanA.pdf', fileType: 'CV', fileSize: 1024500, fileUrl: '#', status: 'APPROVED', uploadedAt: '2026-07-01' },
  { id: 2, internProfileId: 1, fileName: 'CCCD_NguyenVanA.png', fileType: 'IDENTITY_CARD', fileSize: 2048000, fileUrl: '#', status: 'APPROVED', uploadedAt: '2026-07-02' }
];
</script>
