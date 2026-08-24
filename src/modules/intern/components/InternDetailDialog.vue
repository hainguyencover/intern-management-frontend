<template>
  <BaseDialog
    :model-value="modelValue"
    title="Chi tiết hồ sơ thực tập sinh"
    :loading="loading"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    @cancel="$emit('update:modelValue', false)"
  >
    <div v-if="intern" class="q-gutter-y-md">
      <!-- Header Banner -->
      <div class="row items-center q-pa-md bg-grey-2 rounded-borders">
        <q-avatar size="64px" color="primary" text-color="white" class="q-mr-md text-bold">
          {{ getInitials(intern.fullName) }}
        </q-avatar>
        <div class="col">
          <div class="text-h6 text-bold text-primary">{{ intern.fullName }}</div>
          <div class="text-subtitle2 text-grey-8">
            Mã TTS: <strong>{{ intern.studentCode || intern.internCode || '—' }}</strong>
          </div>
          <div class="q-mt-xs">
            <q-chip dense :color="getStatusChipColor(intern.status)" text-color="white" size="sm">
              {{ intern.status || 'DRAFT' }}
            </q-chip>
          </div>
        </div>
      </div>

      <!-- Detail Info Sections -->
      <div class="row q-col-gutter-md">
        <!-- Personal & Contact Info -->
        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-subtitle2 text-bold text-primary q-mb-sm">Thông tin Liên hệ</div>
              <q-list dense separator>
                <q-item>
                  <q-item-section class="text-grey-7">Email:</q-item-section>
                  <q-item-section class="text-bold text-right">{{ intern.email }}</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section class="text-grey-7">Số điện thoại:</q-item-section>
                  <q-item-section class="text-bold text-right">{{ intern.phone || 'Chưa cập nhật' }}</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section class="text-grey-7">Địa chỉ:</q-item-section>
                  <q-item-section class="text-bold text-right">{{ intern.address || 'Chưa cập nhật' }}</q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <!-- Academic Info -->
        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-subtitle2 text-bold text-teal q-mb-sm">Thông tin Đào tạo</div>
              <q-list dense separator>
                <q-item>
                  <q-item-section class="text-grey-7">Trường Đại học:</q-item-section>
                  <q-item-section class="text-bold text-right">{{ intern.university }}</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section class="text-grey-7">Chuyên ngành:</q-item-section>
                  <q-item-section class="text-bold text-right">{{ intern.major }}</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section class="text-grey-7">Điểm GPA:</q-item-section>
                  <q-item-section class="text-bold text-right text-primary">
                    {{ intern.gpa ? intern.gpa + ' / 4.0' : 'Chưa cập nhật' }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <!-- Internship Period -->
        <div class="col-12">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-subtitle2 text-bold text-deep-purple q-mb-sm">Thời gian Thực tập</div>
              <div class="row q-col-gutter-sm text-body2">
                <div class="col-6">
                  <span class="text-grey-7">Ngày bắt đầu: </span>
                  <strong class="text-dark">{{ intern.startDate || 'Chưa cập nhật' }}</strong>
                </div>
                <div class="col-6">
                  <span class="text-grey-7">Ngày kết thúc: </span>
                  <strong class="text-dark">{{ intern.endDate || 'Chưa cập nhật' }}</strong>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <template #actions>
      <BaseButton flat label="Đóng" color="secondary" @click="$emit('update:modelValue', false)" />
      <BaseButton
        icon="edit"
        label="Chỉnh sửa hồ sơ"
        color="primary"
        :disabled="intern?.status === 'COMPLETED'"
        @click="$emit('edit', intern)"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '../../../shared/components/BaseDialog.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';
import type { InternProfile } from '../models/intern';

defineProps<{
  modelValue: boolean;
  intern: InternProfile | null;
  loading?: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'edit', intern: InternProfile | null): void;
}>();

function getInitials(name: string): string {
  if (!name) return 'TS';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getStatusChipColor(status?: string) {
  switch (status) {
    case 'APPROVED': return 'positive';
    case 'INTERNING': return 'teal';
    case 'SUBMITTED': return 'info';
    case 'REVIEWING': return 'purple';
    case 'COMPLETED': return 'deep-purple';
    case 'REJECTED': return 'negative';
    default: return 'grey-7';
  }
}
</script>
