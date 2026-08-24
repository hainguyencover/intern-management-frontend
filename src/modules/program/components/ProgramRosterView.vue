<template>
  <div class="program-roster-view">
    <!-- Header & Action Bar -->
    <div class="row items-center justify-between q-mb-md">
      <div class="row items-center q-gutter-sm">
        <q-input
          v-model="keyword"
          placeholder="Tìm theo tên, mã TTS..."
          outlined
          dense
          clearable
          style="min-width: 250px"
          @update:model-value="fetchRoster"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-select
          v-model="selectedGroupId"
          :options="groupOptions"
          option-value="id"
          option-label="name"
          emit-value
          map-options
          clearable
          label="Lọc theo nhóm"
          outlined
          dense
          style="min-width: 180px"
          @update:model-value="fetchRoster"
        />
      </div>

      <q-btn
        color="primary"
        icon="person_add"
        label="Tiếp nhận Thực tập sinh"
        @click="showEnrollModal = true"
      />
    </div>

    <!-- Roster Table -->
    <q-table
      :rows="roster"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      bordered
      no-data-label="Chưa có thực tập sinh nào tham gia chương trình này"
    >
      <template v-slot:body-cell-internName="props">
        <q-td :props="props">
          <div class="text-weight-bold">{{ props.row.internName || 'TTS #' + props.row.internId }}</div>
          <div class="text-caption text-grey-7">{{ props.row.internEmail }}</div>
        </q-td>
      </template>

      <template v-slot:body-cell-groupName="props">
        <q-td :props="props">
          <q-chip v-if="props.row.groupName" color="blue-1" text-color="blue-9" size="sm">
            {{ props.row.groupName }}
          </q-chip>
          <span v-else class="text-caption text-grey-6">Chưa xếp nhóm</span>
        </q-td>
      </template>

      <template v-slot:body-cell-mentorName="props">
        <q-td :props="props">
          <q-chip v-if="props.row.mentorName" color="purple-1" text-color="purple-9" size="sm" icon="record_voice_over">
            {{ props.row.mentorName }}
          </q-chip>
          <span v-else class="text-caption text-grey-6">Chưa gán</span>
        </q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="props.row.status === 'ACTIVE' ? 'positive' : 'grey'">
            {{ props.row.status }}
          </q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" align="right">
          <q-btn flat round dense icon="remove_circle_outline" color="negative" @click="withdrawIntern(props.row.id)">
            <q-tooltip>Rút khỏi chương trình</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Enroll Modal -->
    <q-dialog v-model="showEnrollModal">
      <q-card style="min-width: 420px">
        <q-card-section class="row items-center">
          <div class="text-h6">Tiếp nhận TTS vào Chương trình</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-select
            v-model="enrollForm.internId"
            :options="availableInternOptions"
            option-value="id"
            option-label="label"
            emit-value
            map-options
            use-input
            label="Chọn Thực tập sinh *"
            outlined
            dense
            class="q-mb-md"
            :rules="[val => !!val || 'Bắt buộc chọn']"
          />

          <q-select
            v-model="enrollForm.groupId"
            :options="groupOptions"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            clearable
            label="Chọn nhóm ban đầu (không bắt buộc)"
            outlined
            dense
            class="q-mb-md"
          />

          <div class="row justify-end q-mt-md">
            <q-btn label="Hủy" flat v-close-popup class="q-mr-sm" />
            <q-btn label="Tiếp nhận" color="primary" :loading="submittingEnroll" @click="submitEnrollment" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { apiClient as api } from '../../../shared/api/client'

const props = defineProps<{
  programId: number
}>()

const $q = useQuasar()
const loading = ref(false)
const roster = ref<any[]>([])
const groups = ref<any[]>([])
const availableInterns = ref<any[]>([])

const keyword = ref('')
const selectedGroupId = ref<number | null>(null)

const showEnrollModal = ref(false)
const submittingEnroll = ref(false)
const enrollForm = ref({
  internId: null as number | null,
  groupId: null as number | null
})

const columns = [
  { name: 'internName', label: 'Thực tập sinh', field: 'internName', align: 'left', sortable: true },
  { name: 'studentCode', label: 'Mã SV', field: 'studentCode', align: 'left' },
  { name: 'university', label: 'Trường / Ngành', field: row => `${row.university || ''} - ${row.major || ''}`, align: 'left' },
  { name: 'groupName', label: 'Nhóm', field: 'groupName', align: 'left' },
  { name: 'mentorName', label: 'Mentor', field: 'mentorName', align: 'left' },
  { name: 'joinedAt', label: 'Ngày tham gia', field: 'joinedAt', align: 'left' },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' },
  { name: 'actions', label: 'Thao tác', field: 'actions', align: 'right' }
]

const groupOptions = computed(() => groups.value)
const availableInternOptions = computed(() => {
  return availableInterns.value.map(i => ({
    id: i.id,
    label: `${i.fullName || (i.user ? i.user.fullName : `TTS #${i.id}`)} (${i.studentCode || i.email || ''})`
  }))
})

async function fetchRoster() {
  loading.value = true;
  try {
    const params: any = { size: 100 };
    if (keyword.value) params.keyword = keyword.value;
    if (selectedGroupId.value) params.groupId = selectedGroupId.value;

    const res = await api.get(`/api/v1/programs/${props.programId}/enrollments`, { params });
    if (res.data && res.data.data) {
      roster.value = res.data.data.content || res.data.data;
    }
  } catch (err) {
    console.warn('Fetch roster error:', err);
  } finally {
    loading.value = false;
  }
}

async function fetchGroupsAndInterns() {
  try {
    const [gRes, iRes] = await Promise.all([
      api.get(`/api/v1/programs/${props.programId}/groups`),
      api.get('/api/v1/interns?size=100')
    ]);
    if (gRes.data && gRes.data.data) {
      groups.value = gRes.data.data;
    }
    if (iRes.data && iRes.data.data) {
      availableInterns.value = iRes.data.data.content || iRes.data.data;
    }
  } catch (err) {
    console.warn('Fetch master data error:', err);
  }
}

async function submitEnrollment() {
  if (!enrollForm.value.internId) return;
  submittingEnroll.value = true;
  try {
    await api.post(`/api/v1/programs/${props.programId}/enrollments`, {
      internId: enrollForm.value.internId,
      groupId: enrollForm.value.groupId
    });
    $q.notify({ type: 'positive', message: 'Tiếp nhận thực tập sinh thành công' });
    showEnrollModal.value = false;
    enrollForm.value = { internId: null, groupId: null };
    await fetchRoster();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: err?.response?.data?.error?.message || 'Không thể tiếp nhận TTS' });
  } finally {
    submittingEnroll.value = false;
  }
}

async function withdrawIntern(enrollmentId: number) {
  $q.dialog({
    title: 'Xác nhận rút',
    message: 'Bạn có chắc chắn muốn rút thực tập sinh này khỏi chương trình?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/api/v1/programs/${props.programId}/enrollments/${enrollmentId}`);
      $q.notify({ type: 'positive', message: 'Đã rút thực tập sinh khỏi chương trình' });
      await fetchRoster();
    } catch (err) {
      $q.notify({ type: 'negative', message: 'Không thể thực hiện thao tác' });
    }
  });
}

onMounted(() => {
  fetchRoster();
  fetchGroupsAndInterns();
});
</script>
