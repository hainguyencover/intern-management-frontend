<template>
  <div class="mentor-management-page">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">Quản lý Mentor & Tải lượng Hướng dẫn</div>
        <div class="text-caption text-grey-7">Theo dõi số lượng thực tập sinh phụ trách và gán Mentor (Workload Capacity)</div>
      </div>
      <q-btn
        color="teal-8"
        icon="person_add"
        label="Thêm mới Mentor"
        unelevated
        @click="openCreateMentor"
      />
    </div>

    <!-- Mentors Table -->
    <BaseTable
      title="Danh sách Mentor"
      :rows="mentors"
      :columns="columns"
      :loading="loading"
    >
      <template #body-cell-capacity="props">
        <q-td :props="props">
          <div class="row items-center">
            <span class="text-weight-bold q-mr-xs">{{ props.row.activeInternCount }} / {{ props.row.maxCapacity }} TTS</span>
            <q-badge :color="props.row.activeInternCount >= props.row.maxCapacity ? 'negative' : 'positive'">
              {{ props.row.activeInternCount >= props.row.maxCapacity ? 'Đầy tải' : 'Còn trống' }}
            </q-badge>
          </div>
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props" class="q-gutter-xs">
          <q-btn flat round dense icon="edit" color="primary" @click="openEditMentor(props.row)">
            <q-tooltip>Chỉnh sửa Mentor</q-tooltip>
          </q-btn>
          <q-btn flat round dense icon="group_add" color="teal-9" @click="openAssignIntern(props.row)">
            <q-tooltip>Gán Thực tập sinh</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </BaseTable>

    <!-- Dialogs -->
    <MentorFormDialog
      v-model="showMentorDialog"
      :mentor-to-edit="mentorToEdit"
      @success="loadMentors"
    />

    <AssignMentorDialog
      v-model="showAssignDialog"
      :intern-profile-id="selectedInternId"
      :intern-name="selectedInternName"
      @success="loadMentors"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Mentor } from '@/types/mentor';
import type { QTableProps } from 'quasar';
import mentorService from '@/services/mentor/mentorService';
import BaseTable from '@/components/table/BaseTable.vue';
import MentorFormDialog from '@/components/mentor/MentorFormDialog.vue';
import AssignMentorDialog from '@/components/mentor/AssignMentorDialog.vue';

const mentors = ref<Mentor[]>([]);
const loading = ref(false);
const showMentorDialog = ref(false);
const mentorToEdit = ref<Mentor | null>(null);
const showAssignDialog = ref(false);
const selectedInternId = ref<number | null>(1);
const selectedInternName = ref<string>('Nguyễn Văn A');

const columns: QTableProps['columns'] = [
  { name: 'fullName', label: 'Họ và Tên Mentor', field: 'fullName', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'department', label: 'Phòng ban', field: 'department', align: 'left' },
  { name: 'position', label: 'Vị trí', field: 'position', align: 'left' },
  { name: 'capacity', label: 'Tải lượng TTS', field: 'capacity', align: 'left' },
  { name: 'actions', label: 'Thao tác', field: 'actions', align: 'center' }
];

onMounted(() => {
  loadMentors();
});

const loadMentors = async () => {
  loading.value = true;
  try {
    mentors.value = await mentorService.getMentors();
  } catch (error) {
    mentors.value = mockMentors;
  } finally {
    loading.value = false;
  }
};

const openCreateMentor = () => {
  mentorToEdit.value = null;
  showMentorDialog.value = true;
};

const openEditMentor = (mentor: Mentor) => {
  mentorToEdit.value = mentor;
  showMentorDialog.value = true;
};

const openAssignIntern = (mentor: Mentor) => {
  showAssignDialog.value = true;
};

const mockMentors: Mentor[] = [
  { id: 101, userId: 3, fullName: 'Lê Văn Mentor', email: 'mentor@holaho.com', phone: '0911223344', department: 'Software Engineering', position: 'Senior Developer', maxCapacity: 5, activeInternCount: 4, status: 'ACTIVE', createdAt: '2026-01-01' },
  { id: 102, userId: 5, fullName: 'Nguyễn Văn Lead', email: 'lead@holaho.com', phone: '0988776655', department: 'Software Engineering', position: 'Tech Lead', maxCapacity: 3, activeInternCount: 3, status: 'ACTIVE', createdAt: '2026-01-01' }
];
</script>
