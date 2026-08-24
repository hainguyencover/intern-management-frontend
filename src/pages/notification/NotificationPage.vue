<template>
  <q-page class="q-pa-md bg-grey-2" style="min-height: 100vh;">
    <div class="row justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        
        <div class="row items-center justify-between q-mb-md">
          <div>
            <h5 class="q-ma-none text-weight-bold text-primary">🔔 Trung Tâm Thông Báo</h5>
            <div class="text-caption text-grey-7">Quản lý lịch trình, lịch họp và các cập nhật mới nhất.</div>
          </div>

          <div class="row q-gutter-x-sm">
            <q-btn
              outline
              color="primary"
              icon="settings"
              label="Cài đặt thông báo"
              to="/notifications/preferences"
            />
            <q-btn
              v-if="store.unreadCount > 0"
              unelevated
              color="primary"
              icon="done_all"
              label="Đánh dấu tất cả đã đọc"
              @click="store.markAllAsRead"
            />
          </div>
        </div>

        <q-card flat class="rounded-borders shadow-1">
          <q-tabs
            v-model="activeTab"
            dense
            active-color="primary"
            indicator-color="primary"
            align="left"
            class="bg-grey-1 text-grey-7 border-bottom"
            @update:model-value="handleTabChange"
          >
            <q-tab name="ALL" label="Tất cả thông báo" />
            <q-tab name="UNREAD" label="Chưa đọc">
              <q-badge v-if="store.unreadCount > 0" color="red" class="q-ml-xs">
                {{ store.unreadCount }}
              </q-badge>
            </q-tab>
          </q-tabs>

          <q-card-section class="q-pa-none">
            <div v-if="store.loading" class="text-center q-pa-xl">
              <q-spinner color="primary" size="48px" />
              <div class="text-grey-6 q-mt-md">Đang tải danh sách thông báo...</div>
            </div>

            <div v-else-if="store.notifications.length === 0">
              <NotificationEmpty />
            </div>

            <div v-else>
              <NotificationItem
                v-for="item in store.notifications"
                :key="item.id"
                :notification="item"
              />
            </div>
          </q-card-section>

          <q-card-section v-if="store.totalPages > 1" class="row justify-center q-py-md bg-grey-1">
            <q-pagination
              v-model="currentPage"
              :max="store.totalPages"
              direction-links
              boundary-links
              color="primary"
              @update:model-value="handlePageChange"
            />
          </q-card-section>
        </q-card>

      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNotificationStore } from '@/stores/notificationStore';
import NotificationItem from '@/components/notification/NotificationItem.vue';
import NotificationEmpty from '@/components/notification/NotificationEmpty.vue';

const store = useNotificationStore();
const activeTab = ref('ALL');
const currentPage = ref(1);

const loadData = () => {
  store.page = currentPage.value - 1;
  const statusFilter = activeTab.value === 'UNREAD' ? 'UNREAD' : null;
  store.fetchNotifications(statusFilter);
};

const handleTabChange = () => {
  currentPage.value = 1;
  loadData();
};

const handlePageChange = (page) => {
  currentPage.value = page;
  loadData();
};

onMounted(() => {
  loadData();
  store.fetchUnreadCount();
});
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
.border-bottom {
  border-bottom: 1px solid #e2e8f0;
}
</style>
