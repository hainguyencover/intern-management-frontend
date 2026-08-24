<template>
  <q-card flat bordered class="q-mb-md">
    <q-card-section>
      <div class="row items-center justify-between q-mb-sm">
        <div class="text-subtitle1 text-weight-bold text-primary">
          <q-icon name="filter_alt" class="q-mr-xs" /> Bộ lọc dữ liệu
        </div>
        <q-btn flat dense color="grey-7" icon="refresh" label="Đặt lại" @click="resetFilters" />
      </div>

      <div class="row q-col-gutter-md">
        <!-- Status Filter -->
        <div class="col-12 col-sm-6 col-md-3" v-if="isFilterAvailable('internStatus')">
          <q-select
            v-model="localFilters.internStatus"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            clearable
            dense
            outlined
            label="Trạng thái thực tập"
            @update:model-value="onFilterChange"
          />
        </div>

        <!-- From Date -->
        <div class="col-12 col-sm-6 col-md-3" v-if="isFilterAvailable('fromDate')">
          <q-input
            v-model="localFilters.fromDate"
            type="date"
            dense
            outlined
            label="Từ ngày"
            stack-label
            @update:model-value="onFilterChange"
          />
        </div>

        <!-- To Date -->
        <div class="col-12 col-sm-6 col-md-3" v-if="isFilterAvailable('toDate')">
          <q-input
            v-model="localFilters.toDate"
            type="date"
            dense
            outlined
            label="Đến ngày"
            stack-label
            @update:model-value="onFilterChange"
          />
        </div>

        <!-- Apply Button -->
        <div class="col-12 col-md-3 row items-center justify-end">
          <q-btn
            color="primary"
            icon="search"
            label="Xem trước dữ liệu"
            class="full-width"
            :loading="loading"
            @click="$emit('apply', localFilters)"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { ReportFilterRequest } from '@/types/report';

const props = defineProps<{
  availableFilters?: string[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'apply', filters: ReportFilterRequest): void;
}>();

const localFilters = reactive<ReportFilterRequest>({
  internStatus: null,
  fromDate: null,
  toDate: null,
  programId: null,
  departmentId: null,
  universityId: null,
  majorId: null,
  mentorId: null
});

const statusOptions = [
  { label: 'Tất cả trạng thái', value: null },
  { label: 'Đang thực tập (ACTIVE)', value: 'ACTIVE' },
  { label: 'Hoàn thành (COMPLETED)', value: 'COMPLETED' },
  { label: 'Tạm dừng (ON_HOLD)', value: 'ON_HOLD' },
  { label: 'Đã thôi học (TERMINATED)', value: 'TERMINATED' }
];

function isFilterAvailable(name: string): boolean {
  if (!props.availableFilters || props.availableFilters.length === 0) return true;
  return props.availableFilters.includes(name);
}

function onFilterChange() {
  emit('apply', { ...localFilters });
}

function resetFilters() {
  localFilters.internStatus = null;
  localFilters.fromDate = null;
  localFilters.toDate = null;
  localFilters.programId = null;
  localFilters.departmentId = null;
  localFilters.universityId = null;
  localFilters.majorId = null;
  localFilters.mentorId = null;
  emit('apply', { ...localFilters });
}
</script>
