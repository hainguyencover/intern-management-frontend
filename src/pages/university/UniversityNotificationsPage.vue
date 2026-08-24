<template>
  <q-page class="q-pa-md">
    <!-- Header Card -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section class="row items-center justify-between">
        <div>
          <div class="text-h5 text-weight-bold text-primary">Thông báo Trường Đại Học</div>
          <div class="text-caption text-grey-7">
            Theo dõi các cập nhật tiến độ thực tập (Hoàn thành / Chấm dứt) của sinh viên thuộc trường
          </div>
        </div>

        <div class="row q-gutter-sm">
          <q-btn
            outline
            color="primary"
            icon="settings"
            label="Cài đặt thông báo"
            @click="openPreferenceDialog"
          />
          <q-btn
            color="primary"
            icon="done_all"
            label="Đánh dấu tất cả đã đọc"
            :disable="store.unreadCount === 0"
            @click="handleMarkAllAsRead"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Filters & List -->
    <q-card flat bordered>
      <q-tabs
        v-model="activeTab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
        @update:model-value="handleTabChange"
      >
        <q-tab name="ALL" label="Tất cả" />
        <q-tab name="UNREAD">
          <template #default>
            <span>Chưa đọc</span>
            <q-badge v-if="store.unreadCount > 0" color="red" class="q-ml-xs" floating>
              {{ store.unreadCount }}
            </q-badge>
          </template>
        </q-tab>
        <q-tab name="COMPLETED" label="Hoàn thành" />
        <q-tab name="TERMINATED" label="Chấm dứt thực tập" />
      </q-tabs>

      <q-separator />

      <!-- Loading State -->
      <div v-if="store.loading" class="text-center q-pa-xl">
        <q-spinner-dots color="primary" size="40px" />
        <div class="text-grey q-mt-sm">Đang tải danh sách thông báo...</div>
      </div>

      <!-- Notification Items -->
      <q-list separator v-else-if="store.items.length > 0">
        <q-item
          v-for="item in store.items"
          :key="item.id"
          clickable
          v-ripple
          :class="{ 'bg-blue-1': item.status === 'UNREAD' }"
          @click="openDetail(item)"
        >
          <q-item-section avatar>
            <q-avatar
              :icon="item.type === 'INTERNSHIP_COMPLETED' ? 'check_circle' : 'cancel'"
              :color="item.type === 'INTERNSHIP_COMPLETED' ? 'positive' : 'negative'"
              text-color="white"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-bold text-subtitle1">
              {{ item.title }}
              <q-badge v-if="item.status === 'UNREAD'" color="blue" label="MỚI" class="q-ml-sm" />
            </q-item-label>
            <q-item-label caption class="text-body2 text-grey-9 q-mt-xs">
              {{ item.message }}
            </q-item-label>
            <q-item-label caption class="text-grey-6 q-mt-sm">
              <q-icon name="schedule" size="xs" class="q-mr-xs" />
              {{ formatDate(item.createdAt) }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-btn
              flat
              round
              dense
              icon="chevron_right"
              color="grey-6"
            />
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Empty State -->
      <div v-else class="text-center q-pa-xl text-grey-7">
        <q-icon name="notifications_none" size="64px" color="grey-5" class="q-mb-md" />
        <div class="text-h6 text-weight-bold">Không có thông báo nào</div>
        <div class="text-caption">
          Các thông báo về trạng thái hoàn thành hoặc chấm dứt thực tập của sinh viên sẽ hiển thị tại đây.
        </div>
      </div>

      <!-- Pagination -->
      <q-separator />
      <div class="row items-center justify-between q-pa-md">
        <div class="text-caption text-grey-7">
          Tổng cộng {{ store.totalElements }} thông báo
        </div>
        <q-pagination
          v-model="currentPage"
          :max="store.totalPages"
          :max-pages="6"
          direction-links
          boundary-links
          icon-first="skip_previous"
          icon-last="skip_next"
          icon-prev="fast_rewind"
          icon-next="fast_forward"
          @update:model-value="handlePageChange"
        />
      </div>
    </q-card>

    <!-- Detail Dialog -->
    <q-dialog v-model="showDetailDialog">
      <q-card style="min-width: 450px">
        <q-card-section class="row items-center bg-primary text-white">
          <q-icon
            :name="selectedItem?.type === 'INTERNSHIP_COMPLETED' ? 'check_circle' : 'cancel'"
            size="md"
            class="q-mr-sm"
          />
          <div class="text-h6">{{ selectedItem?.title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md">
          <div class="text-body1 q-mb-md">{{ selectedItem?.message }}</div>

          <q-list bordered separator class="rounded-borders">
            <q-item>
              <q-item-section>
                <q-item-label caption>Loại thông báo</q-item-label>
                <q-item-label class="text-weight-bold">
                  {{ selectedItem?.type === 'INTERNSHIP_COMPLETED' ? 'Hoàn thành thực tập' : 'Chấm dứt thực tập' }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Thời gian phát sinh</q-item-label>
                <q-item-label>{{ selectedItem ? formatDate(selectedItem.createdAt) : '' }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md bg-grey-1">
          <q-btn
            v-if="selectedItem?.referenceId"
            color="primary"
            icon="visibility"
            label="Xem hồ sơ sinh viên"
            @click="navigateToStudent(selectedItem.referenceId)"
          />
          <q-btn flat label="Đóng" color="grey-7" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Preference Settings Dialog -->
    <q-dialog v-model="showPrefDialog">
      <q-card style="min-width: 480px">
        <q-card-section class="row items-center bg-primary text-white">
          <q-icon name="settings" size="md" class="q-mr-sm" />
          <div class="text-h6">Cài đặt Thông báo Trường</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md" v-if="prefForm">
          <div class="text-subtitle2 text-grey-8 q-mb-sm">Sự kiện nhận thông báo</div>
          <q-toggle
            v-model="prefForm.internshipCompletedEnabled"
            label="Sinh viên hoàn thành thực tập"
            color="positive"
          />
          <q-toggle
            v-model="prefForm.internshipTerminatedEnabled"
            label="Sinh viên bị chấm dứt thực tập"
            color="negative"
          />

          <q-separator class="q-my-md" />

          <div class="text-subtitle2 text-grey-8 q-mb-sm">Kênh nhận thông báo</div>
          <q-toggle
            v-model="prefForm.inAppEnabled"
            label="Thông báo trong ứng dụng (In-App)"
            color="primary"
          />
          <q-toggle
            v-model="prefForm.emailEnabled"
            label="Gửi Email trực tiếp"
            color="primary"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md bg-grey-1">
          <q-btn flat label="Hủy" color="grey-7" v-close-popup />
          <q-btn color="primary" icon="save" label="Lưu thay đổi" @click="savePreferences" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useUniversityNotificationStore } from '@/modules/university-notifications/stores/useUniversityNotificationStore';
import type { UniversityNotification, UniversityNotificationPreferenceUpdate } from '@/modules/university-notifications/types/notification.types';

const store = useUniversityNotificationStore();
const router = useRouter();
const $q = useQuasar();

const activeTab = ref('ALL');
const currentPage = ref(1);
const showDetailDialog = ref(false);
const selectedItem = ref<UniversityNotification | null>(null);

const showPrefDialog = ref(false);
const prefForm = ref<UniversityNotificationPreferenceUpdate | null>(null);

onMounted(() => {
  store.fetchNotifications();
  store.fetchUnreadCount();
});

function handleTabChange(tab: string) {
  if (tab === 'ALL') {
    store.filterStatus = '';
    store.filterType = '';
  } else if (tab === 'UNREAD') {
    store.filterStatus = 'UNREAD';
    store.filterType = '';
  } else if (tab === 'COMPLETED') {
    store.filterStatus = '';
    store.filterType = 'INTERNSHIP_COMPLETED';
  } else if (tab === 'TERMINATED') {
    store.filterStatus = '';
    store.filterType = 'INTERNSHIP_TERMINATED';
  }
  store.fetchNotifications(true);
  currentPage.value = 1;
}

function handlePageChange(pageVal: number) {
  store.page = pageVal - 1;
  store.fetchNotifications();
}

function handleMarkAllAsRead() {
  store.markAllAsRead();
  $q.notify({
    type: 'positive',
    message: 'Đã đánh dấu tất cả thông báo là đã đọc',
    position: 'top-right'
  });
}

function openDetail(item: UniversityNotification) {
  selectedItem.value = item;
  showDetailDialog.value = true;
  if (item.status === 'UNREAD') {
    store.markAsRead(item.id);
  }
}

function navigateToStudent(studentId?: number) {
  if (studentId) {
    showDetailDialog.value = false;
    router.push(`/university/students/${studentId}`);
  }
}

async function openPreferenceDialog() {
  await store.fetchPreferences();
  if (store.preference) {
    prefForm.value = {
      internshipCompletedEnabled: store.preference.internshipCompletedEnabled,
      internshipTerminatedEnabled: store.preference.internshipTerminatedEnabled,
      inAppEnabled: store.preference.inAppEnabled,
      emailEnabled: store.preference.emailEnabled
    };
  } else {
    prefForm.value = {
      internshipCompletedEnabled: true,
      internshipTerminatedEnabled: true,
      inAppEnabled: true,
      emailEnabled: true
    };
  }
  showPrefDialog.value = true;
}

async function savePreferences() {
  if (prefForm.value) {
    await store.updatePreferences(prefForm.value);
    $q.notify({
      type: 'positive',
      message: 'Cập nhật cấu hình nhận thông báo thành công',
      position: 'top-right'
    });
    showPrefDialog.value = false;
  }
}

function formatDate(isoStr: string) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
</script>
