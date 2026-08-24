<template>
  <div class="document-uploader">
    <q-card flat bordered class="q-pa-md bg-grey-1">
      <div class="text-subtitle1 text-weight-bold q-mb-sm">Tải lên Tài liệu Mới</div>

      <q-form @submit.prevent="onUpload" class="q-gutter-md">
        <div>
          <q-select
            v-model="selectedFileType"
            :options="fileTypeOptions"
            label="Loại tài liệu (*)"
            outlined
            dense
            emit-value
            map-options
          />
        </div>

        <div>
          <q-file
            v-model="selectedFile"
            label="Chọn tệp tin (PDF, DOCX, PNG, JPG - Tối đa 10MB)"
            outlined
            dense
            accept=".pdf,.docx,.png,.jpg,.jpeg"
            @rejected="onFileRejected"
          >
            <template #prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </div>

        <div>
          <q-input
            v-model="notes"
            label="Ghi chú thêm (Tùy chọn)"
            outlined
            dense
          />
        </div>

        <div class="row justify-end">
          <q-btn
            type="submit"
            color="primary"
            icon="cloud_upload"
            label="Tải lên ngay"
            unelevated
            :loading="uploading"
            :disable="!selectedFile || !selectedFileType"
          />
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Notify } from 'quasar';
import type { DocumentType } from '@/types/document';
import documentService from '@/services/document/documentService';

const emit = defineEmits<{
  (e: 'success'): void;
}>();

const selectedFileType = ref<DocumentType>('CV');
const selectedFile = ref<File | null>(null);
const notes = ref('');
const uploading = ref(false);

const fileTypeOptions = [
  { label: 'CV / Sơ yếu lý lịch', value: 'CV' },
  { label: 'Căn cước công dân / Hộ chiếu', value: 'IDENTITY_CARD' },
  { label: 'Bằng cấp / Chứng chỉ', value: 'CERTIFICATE' },
  { label: 'Hợp đồng / Giấy giới thiệu', value: 'CONTRACT' },
  { label: 'Tài liệu khác', value: 'OTHER' }
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const onFileRejected = () => {
  Notify.create({
    type: 'negative',
    message: 'Tệp tin không đúng định dạng cho phép hoặc vượt quá dung lượng tối đa 10MB!'
  });
};

const onUpload = async () => {
  if (!selectedFile.value) return;

  if (selectedFile.value.size > MAX_FILE_SIZE) {
    Notify.create({ type: 'negative', message: 'Dung lượng tệp vượt quá 10MB!' });
    return;
  }

  uploading.value = true;
  try {
    await documentService.uploadDocument(selectedFile.value, selectedFileType.value, notes.value);
    Notify.create({ type: 'positive', message: 'Tải lên tài liệu thành công!' });
    selectedFile.value = null;
    notes.value = '';
    emit('success');
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Không thể tải lên tài liệu!'
    });
  } finally {
    uploading.value = false;
  }
};
</script>
