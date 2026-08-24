<template>
  <q-page class="q-pa-xl bg-grey-2">
    <div class="row items-center q-mb-xl">
      <div>
        <h4 class="q-my-none text-bold text-primary">HoLaHo Living Design System</h4>
        <div class="text-subtitle1 text-grey-6 q-mt-sm">Trang trình diễn và hướng dẫn tích hợp Base Components dùng chung</div>
      </div>
      <q-space />
      <q-btn label="Đổi giao diện (Dark/Light)" color="primary" icon="brightness_6" no-caps unelevated @click="toggleTheme" />
    </div>

    <!-- Group 1: Foundation Components -->
    <div class="q-mb-xl">
      <h5 class="text-bold q-mb-md">1. Nhóm nhập liệu cơ sở (Foundation)</h5>
      <q-card flat bordered class="q-pa-lg bg-white rounded-card">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-4">
            <div class="text-subtitle2 text-bold q-mb-xs">BaseButton</div>
            <div class="row q-gutter-sm">
              <BaseButton label="Primary" color="primary" />
              <BaseButton label="Secondary" color="secondary" />
              <BaseButton label="Danger" color="negative" />
              <BaseButton label="Loading" color="primary" loading />
              <BaseButton label="Disabled" color="primary" disabled />
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="text-subtitle2 text-bold q-mb-xs">BaseInput</div>
            <BaseInput v-model="inputText" label="Họ và tên" placeholder="Nhập họ tên..." />
            <BaseInput v-model="inputText" label="Họ và tên (Có lỗi)" error="Họ tên không được để trống" />
          </div>

          <div class="col-12 col-md-4">
            <div class="text-subtitle2 text-bold q-mb-xs">BaseSelect</div>
            <BaseSelect v-model="selectValue" :options="selectOptions" label="Phòng ban" />
          </div>
        </div>
      </q-card>
    </div>

    <!-- Group 2: Layout Components -->
    <div class="q-mb-xl">
      <h5 class="text-bold q-mb-md">2. Nhóm cấu trúc hiển thị (Layout)</h5>
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-6">
          <BaseCard title="Hồ sơ Thực tập sinh" subtitle="Thông tin tổng quan">
            <div>Nguyễn Văn A - Đại học Bách Khoa</div>
            <template #actions>
              <BaseButton label="Sửa hồ sơ" color="primary" />
            </template>
          </BaseCard>
        </div>

        <div class="col-12 col-md-6">
          <q-card flat bordered class="q-pa-lg bg-white rounded-card">
            <div class="text-subtitle2 text-bold q-mb-md">Badges & Chips & Avatars</div>
            <div class="row q-gutter-sm items-center">
              <BaseBadge label="Hoàn thành" color="success" />
              <BaseBadge label="Chờ duyệt" color="warning" />
              <BaseBadge label="Bị hủy" color="danger" />
              <BaseChip label="Tag Vue 3" color="info" />
              <BaseAvatar size="md" icon="person" />
            </div>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Group 3: Data Components -->
    <div class="q-mb-xl">
      <h5 class="text-bold q-mb-md">3. Nhóm dữ liệu nâng cao (Data Components)</h5>
      <q-card flat bordered class="q-pa-lg bg-white rounded-card">
        <SearchToolbar v-model="searchQuery" placeholder="Tìm kiếm thực tập sinh..." />
        <FilterPanel v-model="filters" :fields="filterFields" />
        
        <BaseTable
          :rows="mockTableRows"
          :columns="mockTableCols"
          row-key="id"
          selection="multiple"
          v-model:selected="selectedRows"
        />
        <BasePagination v-model="currentPage" :max="5" />
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useThemeStore } from '@/shared/store/theme';
import BaseButton from '@/shared/components/BaseButton.vue';
import BaseInput from '@/shared/components/BaseInput.vue';
import BaseSelect from '@/shared/components/BaseSelect.vue';
import BaseCard from '@/shared/components/BaseCard.vue';
import BaseBadge from '@/shared/components/BaseBadge.vue';
import BaseChip from '@/shared/components/BaseChip.vue';
import BaseAvatar from '@/shared/components/BaseAvatar.vue';
import BaseTable from '@/shared/components/BaseTable.vue';
import BasePagination from '@/shared/components/BasePagination.vue';
import SearchToolbar from '@/shared/components/SearchToolbar.vue';
import FilterPanel from '@/shared/components/FilterPanel.vue';

const themeStore = useThemeStore();

function toggleTheme() {
  themeStore.toggleTheme();
}

const inputText = ref('');
const selectValue = ref(null);
const selectOptions = [
  { label: 'Phòng Công nghệ', value: 'tech' },
  { label: 'Phòng Nhân sự', value: 'hr' }
];

const searchQuery = ref('');
const filters = reactive({
  status: null,
  role: null
});

const filterFields = [
  {
    key: 'status',
    label: 'Trạng thái',
    options: [
      { label: 'Đang thực tập', value: 'active' },
      { label: 'Đã tốt nghiệp', value: 'graduated' }
    ]
  }
];

const mockTableCols = [
  { name: 'name', label: 'Họ tên', field: 'name', align: 'left' as const },
  { name: 'role', label: 'Vị trí', field: 'role', align: 'left' as const },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' as const }
];

const mockTableRows = [
  { id: 1, name: 'Nguyễn Văn A', role: 'Intern Backend', status: 'Đang thực tập' },
  { id: 2, name: 'Trần Thị B', role: 'Intern Frontend', status: 'Đang thực tập' }
];

const selectedRows = ref([]);
const currentPage = ref(1);
</script>

<style scoped lang="sass">
.rounded-card
  border-radius: 12px
</style>
