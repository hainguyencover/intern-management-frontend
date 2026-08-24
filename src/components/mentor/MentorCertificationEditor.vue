<template>
  <q-card flat bordered class="q-pa-md q-mb-md rounded-borders">
    <div class="row items-center justify-between q-mb-sm">
      <div class="text-h6 text-primary flex items-center gap-2">
        <q-icon name="card_membership" size="24px" />
        <span>Chứng chỉ chuyên môn</span>
      </div>
      <q-btn color="primary" icon="add" label="Thêm chứng chỉ" dense unelevated @click="showAddDialog = true" />
    </div>

    <div v-if="certifications.length === 0" class="text-grey-6 text-italic q-py-sm">
      Chưa có chứng chỉ nào được thêm.
    </div>

    <div v-else class="row q-col-gutter-sm q-mt-xs">
      <div v-for="cert in certifications" :key="cert.id" class="col-12 col-sm-6">
        <q-card flat bordered class="q-pa-sm bg-blue-1">
          <div class="row items-center justify-between">
            <div class="text-subtitle2 text-bold text-primary ellipsis">{{ cert.name }}</div>
            <q-btn flat round dense icon="delete" color="negative" size="sm" @click="$emit('remove-certification', cert.id)" />
          </div>
          <div class="text-caption text-grey-8" v-if="cert.issuingOrganization">
            Tổ chức cấp: {{ cert.issuingOrganization }}
          </div>
          <div class="text-caption text-grey-7" v-if="cert.issuedDate">
            Ngày cấp: {{ cert.issuedDate }}
          </div>
          <div class="q-mt-xs" v-if="cert.credentialUrl">
            <a :href="cert.credentialUrl" target="_blank" class="text-caption text-primary flex items-center gap-1">
              <q-icon name="open_in_new" size="14px" /> Link chứng thực
            </a>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Dialog Thêm Chứng chỉ -->
    <q-dialog v-model="showAddDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">Thêm chứng chỉ chuyên môn</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="form.name" label="Tên chứng chỉ *" outlined dense class="q-mb-md" />
          <q-input v-model="form.issuingOrganization" label="Tổ chức cấp" outlined dense class="q-mb-md" />
          <q-input v-model="form.credentialId" label="Mã chứng chỉ" outlined dense class="q-mb-md" />
          
          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-6">
              <q-input v-model="form.issuedDate" type="date" label="Ngày cấp" outlined dense />
            </div>
            <div class="col-6">
              <q-input v-model="form.expiryDate" type="date" label="Ngày hết hạn" outlined dense />
            </div>
          </div>

          <q-input v-model="form.credentialUrl" label="URL link chứng thực" outlined dense />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="grey" v-close-popup />
          <q-btn label="Thêm" color="primary" :disable="!form.name" @click="handleSave" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { MentorCertification, MentorCertificationPayload } from '@/types/mentor';

defineProps<{
  certifications: MentorCertification[];
}>();

const emit = defineEmits<{
  (e: 'add-certification', payload: MentorCertificationPayload): void;
  (e: 'remove-certification', certId: number): void;
}>();

const showAddDialog = ref(false);

const form = reactive<MentorCertificationPayload>({
  name: '',
  issuingOrganization: '',
  credentialId: '',
  issuedDate: '',
  expiryDate: '',
  credentialUrl: ''
});

function handleSave() {
  emit('add-certification', { ...form });
  showAddDialog.value = false;
  form.name = '';
  form.issuingOrganization = '';
  form.credentialId = '';
  form.issuedDate = '';
  form.expiryDate = '';
  form.credentialUrl = '';
}
</script>
