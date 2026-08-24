<template>
  <q-page class="q-pa-md bg-grey-2" style="min-height: 100vh;">
    <div class="row justify-center">
      <div class="col-12 col-md-10 col-lg-8">

        <div class="row items-center justify-between q-mb-md">
          <div>
            <h5 class="q-ma-none text-weight-bold text-primary">⚙️ Cài Đặt Thông Báo</h5>
            <div class="text-caption text-grey-7">Tùy chỉnh kênh nhận thông báo Email và In-App cho từng sự kiện.</div>
          </div>
          <q-btn
            flat
            color="primary"
            icon="arrow_back"
            label="Quay lại"
            to="/notifications"
          />
        </div>

        <q-card flat class="rounded-borders shadow-1 q-pa-md">
          <q-list separator>
            <q-item-label header class="text-weight-bold text-subtitle1 text-dark">
              Các Sự Kiện Lịch Họp & Hệ Thống
            </q-item-label>

            <q-item v-for="event in eventTypes" :key="event.type" class="q-py-md">
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ event.label }}</q-item-label>
                <q-item-label caption>{{ event.description }}</q-item-label>
              </q-item-section>

              <q-item-section side class="row q-gutter-x-md">
                <q-toggle
                  v-model="event.emailEnabled"
                  label="Email"
                  color="primary"
                  @update:model-value="savePreference(event)"
                />
                <q-toggle
                  v-model="event.inAppEnabled"
                  label="Trong ứng dụng"
                  color="secondary"
                  @update:model-value="savePreference(event)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>

      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNotificationStore } from '@/stores/notificationStore';

const store = useNotificationStore();

const eventTypes = ref([
  { type: 'MEETING_CREATED', label: 'Tạo lịch họp mới', description: 'Thông báo khi bạn được thêm vào cuộc họp mới', emailEnabled: true, inAppEnabled: true },
  { type: 'MEETING_UPDATED', label: 'Cập nhật lịch họp', description: 'Thông báo khi thời gian/địa điểm cuộc họp thay đổi', emailEnabled: true, inAppEnabled: true },
  { type: 'MEETING_CANCELLED', label: 'Hủy lịch họp', description: 'Thông báo khi cuộc họp bị hủy bỏ', emailEnabled: true, inAppEnabled: true },
  { type: 'MEETING_REMINDER', label: 'Nhắc lịch họp', description: 'Nhắc nhở trước 24h và 30 phút trước khi bắt đầu', emailEnabled: true, inAppEnabled: true },
  { type: 'SYSTEM', label: 'Thông báo hệ thống', description: 'Thông báo hợp đồng, đánh giá, thông báo quan trọng từ quản trị viên', emailEnabled: true, inAppEnabled: true },
]);

onMounted(async () => {
  await store.fetchPreferences();
  if (store.preferences && store.preferences.length > 0) {
    eventTypes.value.forEach(item => {
      const pref = store.preferences.find(p => p.eventType === item.type);
      if (pref) {
        item.emailEnabled = pref.emailEnabled;
        item.inAppEnabled = pref.inAppEnabled;
      }
    });
  }
});

const savePreference = (event) => {
  store.updatePreference({
    eventType: event.type,
    emailEnabled: event.emailEnabled,
    websocketEnabled: event.inAppEnabled,
    inAppEnabled: event.inAppEnabled,
  });
};
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
</style>
