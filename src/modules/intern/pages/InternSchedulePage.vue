<template>
  <q-page class="q-pa-md">
    <!-- Header Banner -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h1 class="text-h5 text-bold q-my-none text-primary flex items-center gap-2">
          <q-icon name="event" size="md" color="primary" />
          Lịch trình Thực tập của tôi
        </h1>
        <p class="text-caption text-grey-7 q-mb-none">
          Theo dõi mốc thời gian chương trình thực tập và các deadline nhiệm vụ được giao
        </p>
      </div>
      <div class="row items-center q-gutter-sm">
        <q-btn flat round icon="refresh" color="primary" @click="fetchSchedule" :loading="loading">
          <q-tooltip>Làm mới</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Filter & Search Bar -->
    <q-card flat bordered class="q-mb-md bg-grey-1">
      <q-card-section class="q-py-sm">
        <div class="row items-center justify-between q-col-gutter-sm">
          <div class="col-12 col-sm-auto">
            <q-btn-toggle
              v-model="filterType"
              toggle-color="primary"
              flat
              dense
              :options="filterOptions"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="searchQuery"
              placeholder="Tìm kiếm mốc lịch trình..."
              dense
              outlined
              bg-color="white"
              clearable
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="q-gutter-y-sm">
      <q-skeleton type="rect" height="90px" class="rounded-borders" />
      <q-skeleton type="rect" height="90px" class="rounded-borders" />
      <q-skeleton type="rect" height="90px" class="rounded-borders" />
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredEvents.length === 0" class="text-center q-pa-xl bg-white rounded-borders border-grey-4">
      <q-icon name="event_busy" size="64px" color="grey-5" />
      <div class="text-h6 text-grey-8 q-mt-md">Chưa có lịch trình</div>
      <p class="text-caption text-grey-6 max-width-300">
        {{ searchQuery || filterType !== 'ALL'
            ? 'Không tìm thấy mốc lịch trình nào phù hợp với bộ lọc.'
            : 'Lịch thực tập của bạn chưa được thiết lập hoặc chưa có nhiệm vụ nào. Vui lòng liên hệ Mentor hoặc HR.' }}
      </p>
    </div>

    <!-- Timeline List View -->
    <div v-else class="q-gutter-y-sm">
      <q-card
        v-for="(event, idx) in filteredEvents"
        :key="event.id || idx"
        flat
        bordered
        class="transition-all hover-shadow"
      >
        <q-card-section class="q-pa-none">
          <div class="row no-wrap items-center">
            <!-- Date Column -->
            <div class="bg-primary text-white text-center q-pa-md flex flex-center col-auto" style="min-width: 100px; min-height: 90px">
              <div>
                <div class="text-caption text-blue-2 text-weight-bold text-uppercase">
                  {{ formatDateMonth(event.date) }}
                </div>
                <div class="text-h4 text-bold">
                  {{ formatDateDay(event.date) }}
                </div>
                <div class="text-caption text-blue-1">
                  {{ formatDateWeekday(event.date) }}
                </div>
              </div>
            </div>

            <!-- Content Column -->
            <div class="q-pa-md col">
              <div class="row items-center q-gutter-x-sm q-mb-xs">
                <q-chip
                  dense
                  class="text-bold text-caption"
                  :color="getTypeColor(event.type)"
                  text-color="white"
                >
                  {{ getTypeLabel(event.type) }}
                </q-chip>
                <q-chip
                  v-if="event.status"
                  outline
                  dense
                  color="grey-7"
                  size="xs"
                >
                  {{ event.status }}
                </q-chip>
              </div>

              <div class="text-subtitle1 text-bold text-grey-9">
                {{ event.title }}
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { apiClient as api } from '../../../shared/api/client'

const $q = useQuasar()
const loading = ref(false)
const events = ref<any[]>([])
const filterType = ref('ALL')
const searchQuery = ref('')

const filterOptions = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Chương trình', value: 'PROGRAM' },
  { label: 'Nhiệm vụ', value: 'TASK' }
]

async function fetchSchedule() {
  loading.value = true
  try {
    const res = await api.get('/api/v1/interns/me/schedule')
    if (res.data && res.data.data) {
      events.value = res.data.data
    } else {
      events.value = []
    }
  } catch (err: any) {
    console.warn('Fetch schedule error:', err)
    $q.notify({ type: 'warning', message: 'Không thể tải lịch trình thực tập' })
  } finally {
    loading.value = false
  }
}

const filteredEvents = computed(() => {
  return events.value.filter(event => {
    const q = searchQuery.value.trim().toLowerCase()
    const matchesQuery = !q ||
      event.title?.toLowerCase().includes(q) ||
      event.type?.toLowerCase().includes(q)

    const matchesType = filterType.value === 'ALL' ||
      (filterType.value === 'PROGRAM' && (event.type === 'PROGRAM_START' || event.type === 'PROGRAM_END')) ||
      (filterType.value === 'TASK' && event.type === 'TASK')

    return matchesQuery && matchesType
  })
})

function getTypeLabel(type: string) {
  switch (type) {
    case 'PROGRAM_START':
      return 'Khởi động Chương trình'
    case 'PROGRAM_END':
      return 'Kết thúc Chương trình'
    case 'TASK':
      return 'Nhiệm vụ'
    default:
      return type || 'Sự kiện'
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case 'PROGRAM_START':
      return 'positive'
    case 'PROGRAM_END':
      return 'warning'
    case 'TASK':
      return 'primary'
    default:
      return 'grey-7'
  }
}

function formatDateMonth(dateStr: string) {
  if (!dateStr) return 'THÁNG'
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { month: 'long' })
}

function formatDateDay(dateStr: string) {
  if (!dateStr) return '--'
  const d = new Date(dateStr)
  return d.getDate()
}

function formatDateWeekday(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { weekday: 'short' })
}

onMounted(() => {
  fetchSchedule()
})
</script>

<style scoped>
.hover-shadow:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.max-width-300 {
  max-width: 300px;
  margin: 0 auto;
}
</style>
