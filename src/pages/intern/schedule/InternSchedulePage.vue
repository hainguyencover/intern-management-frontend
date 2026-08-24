<template>
  <div class="intern-schedule-page">
    <div class="text-h5 text-weight-bold q-mb-md">Lịch trình & Cột mốc Thực tập</div>

    <div class="row q-col-gutter-md">
      <!-- Milestones Timeline -->
      <div class="col-12 col-md-7">
        <q-card flat bordered class="fit">
          <q-card-section>
            <div class="text-h6 text-weight-bold">Các Cột mốc Nội dung Thực tập (Milestones)</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-timeline color="primary">
              <q-timeline-entry
                v-for="ms in milestones"
                :key="ms.id"
                :title="`Tuần ${ms.weekNumber}: ${ms.title}`"
                :subtitle="`Hạn nộp: ${ms.dueDate}`"
                :color="ms.isCompleted ? 'positive' : 'blue-8'"
                :icon="ms.isCompleted ? 'check_circle' : 'schedule'"
              >
                <div>{{ ms.deliverables }}</div>
              </q-timeline-entry>
            </q-timeline>
          </q-card-section>
        </q-card>
      </div>

      <!-- Key Dates Cards -->
      <div class="col-12 col-md-5">
        <q-card flat bordered class="fit">
          <q-card-section>
            <div class="text-h6 text-weight-bold">Sự kiện Quan trọng</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-list separator>
              <q-item v-for="ev in events" :key="ev.id">
                <q-item-section avatar>
                  <q-icon :name="getEventIcon(ev.eventType)" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ ev.title }}</q-item-label>
                  <q-item-label caption>{{ ev.description }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge color="blue-9">{{ ev.eventDate }}</q-badge>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { ScheduleEvent, ScheduleMilestone } from '@/types/schedule';
import scheduleService from '@/services/schedule/scheduleService';

const milestones = ref<ScheduleMilestone[]>([]);
const events = ref<ScheduleEvent[]>([]);

onMounted(() => {
  loadData();
});

const loadData = async () => {
  try {
    milestones.value = await scheduleService.getScheduleMilestones();
    events.value = await scheduleService.getScheduleEvents();
  } catch (error) {
    milestones.value = mockMilestones;
    events.value = mockEvents;
  }
};

const getEventIcon = (type: string) => {
  switch (type) {
    case 'CHECK_IN': return 'fingerprint';
    case 'REPORT_DEADLINE': return 'event_available';
    case 'EVALUATION': return 'grade';
    default: return 'event';
  }
};

const mockMilestones: ScheduleMilestone[] = [
  { id: 1, weekNumber: 1, title: 'Onboarding & Setup Môi trường', deliverables: 'Hoàn thành cài đặt IDE, Git repositories & đọc tài liệu DoD/DoR', dueDate: '07/07/2026', isCompleted: true },
  { id: 2, weekNumber: 2, title: 'Tìm hiểu Kiến trúc Spring Boot & Vue 3', deliverables: 'Nắm vững luồng REST API, DTOs, State Machine', dueDate: '14/07/2026', isCompleted: true },
  { id: 3, weekNumber: 6, title: 'Đánh giá Giữa kỳ (Mid-term Review)', deliverables: 'Báo cáo tiến độ và trình bày sản phẩm tính năng', dueDate: '15/08/2026', isCompleted: true },
  { id: 4, weekNumber: 12, title: 'Báo cáo Tổng kết & Nghiệm thu Dự án', deliverables: 'Báo cáo đồ án thực tập và bàn giao tài liệu', dueDate: '25/09/2026', isCompleted: false }
];

const mockEvents: ScheduleEvent[] = [
  { id: 1, title: 'Hạn nộp Báo cáo Tuần 34', description: 'Nộp báo cáo tuần cho Mentor trước 17:00', eventDate: '22/08/2026', eventType: 'REPORT_DEADLINE', status: 'UPCOMING' },
  { id: 2, title: 'Đánh giá Năng lực Giữa kỳ', description: 'Mentor thực hiện đánh giá trực tuyến', eventDate: '28/08/2026', eventType: 'EVALUATION', status: 'UPCOMING' }
];
</script>
