<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h1 class="text-h5 text-bold q-my-none text-primary">Nhóm Thực tập & Phân công Mentor</h1>
        <p class="text-caption text-grey-7 q-mb-none">Quản lý nhóm thực tập, phân công Mentor hướng dẫn và kiểm soát giới hạn (BR-06: tối đa 10 em/mentor)</p>
      </div>
      <q-btn color="primary" icon="group_add" label="Tạo nhóm mới" @click="openCreateDialog" />
    </div>

    <!-- Group Grid Cards -->
    <div class="row q-col-gutter-md">
      <div v-for="group in groups" :key="group.id" class="col-12 col-md-6 col-lg-4">
        <q-card flat bordered class="fit flex flex-col justify-between">
          <q-card-section>
            <div class="row items-center justify-between q-mb-xs">
              <span class="text-h6 text-bold text-primary">{{ group.name }}</span>
              <q-chip dense color="purple" text-color="white" size="xs">
                Mentor: {{ getMentorName(group.mentorId) }}
              </q-chip>
            </div>
            <div class="text-caption text-grey-7 q-mb-sm">
              <q-icon name="school" size="xs" class="q-mr-xs" />
              {{ getProgramName(group.programId) }}
            </div>
            <p class="text-body2 text-grey-9">{{ group.description || 'Chưa có mô tả' }}</p>

            <q-separator class="q-my-sm" />

            <div class="row items-center justify-between q-mb-xs">
              <span class="text-caption text-bold text-grey-8">Danh sách Thực tập sinh:</span>
              <q-chip dense :color="(group.totalMembers || 0) >= 10 ? 'negative' : 'positive'" text-color="white" size="sm">
                {{ group.totalMembers || 0 }} / 10 em (BR-06)
              </q-chip>
            </div>

            <div v-if="group.members && group.members.length > 0" class="q-gutter-xs q-mt-xs">
              <q-chip
                v-for="member in group.members"
                :key="member.id"
                removable
                @remove="removeMemberFromGroup(group.id, member.internId)"
                color="blue-1"
                text-color="blue-9"
                size="sm"
                icon="account_circle"
              >
                {{ member.internName || ('TTS #' + member.internId) }}
              </q-chip>
            </div>
            <div v-else class="text-caption text-italic text-grey-6 q-my-xs">
              Chưa có thực tập sinh nào trong nhóm
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat dense icon="edit" color="primary" label="Sửa" @click="openEditDialog(group)" />
            <q-btn flat dense icon="person_add" color="positive" label="Thêm Intern" @click="openAddMemberDialog(group)" />
            <q-btn flat dense icon="delete" color="negative" label="Xóa" @click="deleteGroup(group.id)" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Create/Edit Group Dialog -->
    <q-dialog v-model="showDialog">
      <q-card style="min-width: 450px">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ isEdit ? 'Cập nhật' : 'Tạo mới' }} Nhóm Thực tập</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="saveGroup" class="q-gutter-md">
            <q-input v-model="form.name" label="Tên nhóm *" outlined dense :rules="[val => !!val || 'Bắt buộc']" />

            <q-select
              v-model="form.programId"
              :options="programOptions"
              option-value="id"
              option-label="label"
              emit-value
              map-options
              label="Chương trình thực tập *"
              outlined
              dense
              :rules="[val => !!val || 'Bắt buộc chọn chương trình']"
            />

            <q-select
              v-model="form.mentorId"
              :options="mentorOptions"
              option-value="id"
              option-label="label"
              emit-value
              map-options
              clearable
              label="Mentor hướng dẫn"
              outlined
              dense
            />

            <q-input v-model="form.description" label="Mô tả nhóm" type="textarea" outlined dense rows="3" />

            <div class="row justify-end q-mt-md">
              <q-btn label="Hủy" flat v-close-popup class="q-mr-sm" />
              <q-btn label="Lưu" color="primary" type="submit" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Add Member Dialog -->
    <q-dialog v-model="showAddMemberDialog">
      <q-card style="min-width: 420px">
        <q-card-section class="row items-center">
          <div class="text-h6">Thêm Thực tập sinh vào nhóm</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-select
            v-model="selectedInternId"
            :options="filteredInternOptions"
            option-value="id"
            option-label="label"
            emit-value
            map-options
            use-input
            input-debounce="200"
            @filter="filterInterns"
            label="Chọn Thực tập sinh *"
            outlined
            dense
            class="q-mb-md"
            :rules="[val => !!val || 'Vui lòng chọn thực tập sinh']"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Không tìm thấy thực tập sinh
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <div class="row justify-end">
            <q-btn label="Hủy" flat v-close-popup class="q-mr-sm" />
            <q-btn label="Thêm vào nhóm" color="positive" :loading="addingMember" @click="addMember" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { apiClient as api } from '../../../shared/api/client';

const $q = useQuasar();
const loading = ref(false);
const saving = ref(false);
const showDialog = ref(false);
const isEdit = ref(false);
const editId = ref<number | null>(null);

const showAddMemberDialog = ref(false);
const selectedGroupId = ref<number | null>(null);
const selectedInternId = ref<number | null>(null);
const addingMember = ref(false);

const groups = ref<any[]>([]);
const programs = ref<any[]>([]);
const mentors = ref<any[]>([]);
const interns = ref<any[]>([]);

const filteredInternOptions = ref<any[]>([]);

const form = ref({
  name: '',
  programId: null as number | null,
  mentorId: null as number | null,
  description: ''
});

// Computes dropdown options
const programOptions = computed(() => {
  return programs.value.map(p => ({
    id: p.id,
    label: p.code ? `${p.name} (${p.code})` : p.name
  }));
});

const mentorOptions = computed(() => {
  return mentors.value.map(m => {
    const fullName = m.fullName || (m.user ? m.user.fullName : `Mentor #${m.id}`);
    const dept = m.departmentName || (m.department ? m.department.name : '');
    return {
      id: m.id,
      label: dept ? `${fullName} - ${dept}` : fullName
    };
  });
});

const internOptions = computed(() => {
  return interns.value.map(i => {
    const fullName = i.fullName || (i.user ? i.user.fullName : `Intern #${i.id}`);
    const code = i.studentCode || i.code || '';
    const email = i.email || (i.user ? i.user.email : '');
    const info = [code, email].filter(Boolean).join(' • ');
    return {
      id: i.id,
      label: info ? `${fullName} (${info})` : fullName,
      fullName
    };
  });
});

function getProgramName(programId: number | null) {
  if (!programId) return 'Chưa chọn chương trình';
  const found = programs.value.find(p => p.id === programId);
  return found ? (found.code ? `${found.name} (${found.code})` : found.name) : `Chương trình ID: ${programId}`;
}

function getMentorName(mentorId: number | null) {
  if (!mentorId) return 'Chưa gán';
  const found = mentors.value.find(m => m.id === mentorId);
  if (found) {
    return found.fullName || (found.user ? found.user.fullName : `Mentor #${mentorId}`);
  }
  return `Mentor ID: ${mentorId}`;
}

function filterInterns(val: string, update: Function) {
  if (val === '') {
    update(() => {
      filteredInternOptions.value = internOptions.value;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    filteredInternOptions.value = internOptions.value.filter(
      v => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
}

async function loadGroups() {
  loading.value = true;
  try {
    const res = await api.get('/api/v1/program-groups');
    if (res.data && res.data.data) {
      groups.value = res.data.data.content || res.data.data;
    }
  } catch (err: any) {
    $q.notify({ type: 'warning', message: 'Không thể tải danh sách nhóm' });
  } finally {
    loading.value = false;
  }
}

async function loadMasterData() {
  try {
    const [progRes, mentorRes, internRes] = await Promise.all([
      api.get('/api/v1/programs?size=100'),
      api.get('/api/v1/mentors'),
      api.get('/api/v1/interns?size=100')
    ]);

    if (progRes.data && progRes.data.data) {
      programs.value = progRes.data.data.content || progRes.data.data;
    }
    if (mentorRes.data && mentorRes.data.data) {
      mentors.value = mentorRes.data.data.content || mentorRes.data.data;
    }
    if (internRes.data && internRes.data.data) {
      interns.value = internRes.data.data.content || internRes.data.data;
      filteredInternOptions.value = internOptions.value;
    }
  } catch (err) {
    console.warn('Load master data error:', err);
  }
}

function openCreateDialog() {
  isEdit.value = false;
  editId.value = null;
  const defaultProgId = programs.value.length > 0 ? programs.value[0].id : null;
  form.value = { name: '', programId: defaultProgId, mentorId: null, description: '' };
  showDialog.value = true;
}

function openEditDialog(group: any) {
  isEdit.value = true;
  editId.value = group.id;
  form.value = {
    name: group.name,
    programId: group.programId || null,
    mentorId: group.mentorId || null,
    description: group.description || ''
  };
  showDialog.value = true;
}

function openAddMemberDialog(group: any) {
  selectedGroupId.value = group.id;
  selectedInternId.value = null;
  filteredInternOptions.value = internOptions.value;
  showAddMemberDialog.value = true;
}

async function addMember() {
  if (!selectedGroupId.value || !selectedInternId.value) return;
  addingMember.value = true;
  try {
    await api.post(`/api/v1/program-groups/${selectedGroupId.value}/members`, {
      internId: selectedInternId.value
    });
    $q.notify({ type: 'positive', message: 'Thêm thực tập sinh thành công' });
    showAddMemberDialog.value = false;
    await loadGroups();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: err?.response?.data?.error?.message || 'Không thể thêm thực tập sinh' });
  } finally {
    addingMember.value = false;
  }
}

async function removeMemberFromGroup(groupId: number, internId: number) {
  try {
    await api.delete(`/api/v1/program-groups/${groupId}/members/${internId}`);
    $q.notify({ type: 'positive', message: 'Đã xóa thực tập sinh khỏi nhóm' });
    await loadGroups();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Không thể xóa thực tập sinh' });
  }
}

async function saveGroup() {
  saving.value = true;
  try {
    if (isEdit.value && editId.value) {
      await api.put(`/api/v1/program-groups/${editId.value}`, form.value);
    } else {
      await api.post('/api/v1/program-groups', form.value);
    }
    $q.notify({ type: 'positive', message: 'Lưu nhóm thành công' });
    showDialog.value = false;
    await loadGroups();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Thao tác thất bại' });
  } finally {
    saving.value = false;
  }
}

async function deleteGroup(id: number) {
  $q.dialog({
    title: 'Xác nhận xóa',
    message: 'Bạn có chắc chắn muốn xóa nhóm này?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/api/v1/program-groups/${id}`);
      $q.notify({ type: 'positive', message: 'Xóa nhóm thành công' });
      await loadGroups();
    } catch (err: any) {
      $q.notify({ type: 'negative', message: 'Không thể xóa nhóm' });
    }
  });
}

onMounted(() => {
  loadGroups();
  loadMasterData();
});
</script>
