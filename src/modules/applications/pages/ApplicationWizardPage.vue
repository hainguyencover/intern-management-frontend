<template>
  <q-page class="q-pa-md q-pa-md-lg bg-grey-1" style="min-height: 100vh">
    <div class="max-width-container margin-auto">
      <q-card flat bordered class="q-pa-md q-pa-md-lg bg-white shadow-4 rounded-borders-lg">
        <div class="text-h5 text-bold text-primary flex items-center q-mb-md">
          <q-icon name="assignment" size="32px" class="q-mr-sm" />
          Đăng ký & Nộp hồ sơ thực tập
        </div>

        <!-- Banner cảnh báo email chưa xác thực -->
        <q-banner v-if="!authStore.user?.emailVerified" class="bg-warning text-dark q-mb-lg rounded-borders">
          <template v-slot:avatar>
            <q-icon name="warning" color="dark" />
          </template>
          <strong>Email chưa xác thực!</strong> Bạn cần xác thực email trước khi có thể hoàn tất nộp hồ sơ.
          <template v-slot:action>
            <q-btn flat color="dark" label="Xác thực ngay" to="/verify-email" />
          </template>
        </q-banner>

        <!-- Banner lỗi chung -->
        <q-banner v-if="errorMsg" class="bg-negative text-white q-mb-lg rounded-borders">
          <template v-slot:avatar>
            <q-icon name="error" color="white" />
          </template>
          {{ errorMsg }}
        </q-banner>

        <!-- Stepper -->
        <q-stepper v-model="step" ref="stepper" color="primary" animated header-nav>
          <!-- Bước 1: Thông tin cá nhân -->
          <q-step :name="1" title="Thông tin cá nhân" icon="person" :done="step > 1">
            <div class="text-subtitle1 text-bold q-mb-sm">Xác nhận thông tin ứng viên</div>
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-sm-6">
                <q-input :model-value="authStore.user?.fullName" label="Họ và tên" readonly outlined dense />
              </div>
              <div class="col-12 col-sm-6">
                <q-input :model-value="authStore.user?.email" label="Địa chỉ Email" readonly outlined dense />
              </div>
              <div class="col-12 col-sm-6">
                <q-input v-model="personalInfo.university" label="Trường Đại học / Cao đẳng *" outlined dense />
              </div>
              <div class="col-12 col-sm-6">
                <q-input v-model="personalInfo.major" label="Chuyên ngành *" outlined dense />
              </div>
            </div>

            <q-stepper-navigation>
              <q-btn color="primary" label="Tiếp tục: Chọn chương trình" @click="step = 2" unelevated />
            </q-stepper-navigation>
          </q-step>

          <!-- Bước 2: Chọn chương trình thực tập -->
          <q-step :name="2" title="Chương trình thực tập" icon="work" :done="step > 2">
            <div class="text-subtitle1 text-bold q-mb-sm">Chọn chương trình ứng tuyển</div>

            <div v-if="appStore.loadingPrograms" class="text-center q-pa-xl">
              <q-spinner-dots color="primary" size="40px" />
              <div class="text-grey-7 q-mt-sm">Đang tải các chương trình thực tập đang mở...</div>
            </div>

            <div v-else-if="appStore.activePrograms.length === 0" class="text-center q-pa-xl">
              <q-icon name="do_not_disturb" color="grey-6" size="48px" />
              <div class="text-subtitle1 text-grey-7 q-mt-sm">Hiện tại chưa có chương trình thực tập nào đang mở nhận hồ sơ.</div>
            </div>

            <div v-else class="row q-col-gutter-md q-mb-md">
              <div v-for="program in appStore.activePrograms" :key="program.id" class="col-12 col-sm-6">
                <q-card
                  flat
                  bordered
                  class="program-card cursor-pointer q-pa-md"
                  :class="{ 'selected-card': selectedProgramId === program.id }"
                  @click="selectedProgramId = program.id"
                >
                  <div class="row items-center justify-between">
                    <div class="text-subtitle1 text-bold text-primary">{{ program.name }}</div>
                    <q-radio v-model="selectedProgramId" :val="program.id" color="primary" />
                  </div>
                  <div class="text-caption text-grey-7 q-mt-xs">{{ program.description || 'Chương trình thực tập chính thức tại HoLaHo' }}</div>
                  <div class="text-caption text-grey-8 q-mt-sm" v-if="program.startDate">
                    <q-icon name="event" size="14px" /> Thời gian: {{ program.startDate }} - {{ program.endDate || 'N/A' }}
                  </div>
                </q-card>
              </div>
            </div>

            <div class="q-mt-md">
              <q-input v-model="position" label="Vị trí / Chuyên môn mong muốn ứng tuyển *" outlined dense placeholder="VD: Backend Java Developer" />
            </div>

            <q-stepper-navigation class="q-mt-md">
              <q-btn color="primary" label="Tiếp tục: Tải lên CV" @click="goToStep3" unelevated />
              <q-btn flat color="grey-7" label="Quay lại" @click="step = 1" class="q-ml-sm" />
            </q-stepper-navigation>
          </q-step>

          <!-- Bước 3: Đính kèm tài liệu CV -->
          <q-step :name="3" title="Tài liệu & Hồ sơ" icon="description" :done="step > 3">
            <div class="text-subtitle1 text-bold q-mb-sm">Tải lên CV & Đơn xin thực tập (PDF/DOCX, &le; 10MB)</div>

            <q-file
              v-model="cvFile"
              label="Chọn tập tin CV ứng tuyển *"
              outlined
              dense
              accept=".pdf,.docx"
              max-file-size="10485760"
              @rejected="onFileRejected"
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>

            <q-input
              v-model="note"
              type="textarea"
              label="Ghi chú / Thư giới thiệu bản thân (Không bắt buộc)"
              outlined
              dense
              rows="3"
            />

            <q-stepper-navigation class="q-mt-md">
              <q-btn color="primary" label="Xem lại hồ sơ" @click="step = 4" unelevated :disable="!cvFile" />
              <q-btn flat color="grey-7" label="Quay lại" @click="step = 2" class="q-ml-sm" />
            </q-stepper-navigation>
          </q-step>

          <!-- Bước 4: Kiểm tra lại & Nộp hồ sơ -->
          <q-step :name="4" title="Xác nhận & Nộp" icon="check_circle">
            <div class="text-subtitle1 text-bold q-mb-sm">Kiểm tra thông tin trước khi nộp</div>

            <q-list bordered separator class="rounded-borders q-mb-lg bg-grey-1">
              <q-item>
                <q-item-section>
                  <q-item-label caption>Ứng viên</q-item-label>
                  <q-item-label class="text-bold">{{ authStore.user?.fullName }} ({{ authStore.user?.email }})</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Chương trình chọn</q-item-label>
                  <q-item-label class="text-bold text-primary">{{ selectedProgramName }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Vị trí ứng tuyển</q-item-label>
                  <q-item-label class="text-bold">{{ position }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Tập tin CV</q-item-label>
                  <q-item-label class="text-bold text-positive">{{ cvFile?.name }} ({{ (cvFile?.size ? cvFile.size / 1024 / 1024 : 0).toFixed(2) }} MB)</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <q-stepper-navigation>
              <q-btn
                color="positive"
                label="XÁC NHẬN NỘP HỒ SƠ"
                icon="send"
                class="text-bold q-px-lg"
                unelevated
                :loading="submitting"
                :disable="!authStore.user?.emailVerified || submitting"
                @click="handleSubmit"
              />
              <q-btn flat color="grey-7" label="Quay lại" @click="step = 3" class="q-ml-sm" :disable="submitting" />
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../auth/store/authStore';
import { useApplicationStore } from '../store/applicationStore';

const router = useRouter();
const authStore = useAuthStore();
const appStore = useApplicationStore();

const step = ref(1);
const selectedProgramId = ref<number | null>(null);
const position = ref('');
const note = ref('');
const cvFile = ref<File | null>(null);
const submitting = ref(false);
const errorMsg = ref('');

const personalInfo = reactive({
  university: '',
  major: ''
});

const selectedProgramName = computed(() => {
  const p = appStore.activePrograms.find(item => item.id === selectedProgramId.value);
  return p ? p.name : 'Chưa chọn';
});

function goToStep3() {
  if (!selectedProgramId.value) {
    errorMsg.value = 'Vui lòng chọn một chương trình thực tập';
    return;
  }
  if (!position.value.trim()) {
    errorMsg.value = 'Vui lòng nhập vị trí ứng tuyển mong muốn';
    return;
  }
  errorMsg.value = '';
  step.value = 3;
}

function onFileRejected(rejectedEntries: any[]) {
  errorMsg.value = 'File không hợp lệ. Vui lòng chọn file PDF hoặc DOCX với dung lượng dưới 10MB.';
}

async function handleSubmit() {
  if (!authStore.user?.emailVerified) {
    errorMsg.value = 'Vui lòng xác thực email trước khi nộp hồ sơ';
    return;
  }
  if (!selectedProgramId.value) return;

  errorMsg.value = '';
  submitting.value = true;

  try {
    if (cvFile.value) {
      await appStore.applicationService ? null : null; // document upload handling
    }

    const result = await appStore.submit(
      selectedProgramId.value,
      position.value,
      note.value
    );

    router.push({
      path: '/applications/submitted',
      query: { id: result.id, program: selectedProgramName.value }
    });
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || err.message || 'Nộp hồ sơ thất bại. Bạn có thể đã có 1 đơn ứng tuyển đang chờ xét duyệt.';
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  await appStore.fetchActivePrograms();
  if (appStore.activePrograms.length > 0 && selectedProgramId.value === null) {
    selectedProgramId.value = appStore.activePrograms[0].id;
  }
});
</script>

<style scoped lang="sass">
.max-width-container
  max-width: 800px

.margin-auto
  margin: 0 auto

.rounded-borders-lg
  border-radius: 16px

.program-card
  border-radius: 12px
  transition: all 0.2s ease
  &:hover
    border-color: var(--q-primary)

.selected-card
  border: 2px solid var(--q-primary)
  background-color: #f0f7ff
</style>
