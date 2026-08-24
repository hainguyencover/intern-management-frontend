<template>
  <div class="row q-col-gutter-md q-mb-md">
    <!-- Card 1: Tổng số Mentor -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="shadow-1">
        <q-card-section class="q-pa-md">
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-caption text-grey-7 text-uppercase text-weight-medium">Tổng số Mentor</div>
              <div class="text-h5 text-weight-bolder text-primary q-mt-xs">
                {{ summary?.totalMentors || 0 }}
              </div>
              <div class="text-caption text-grey-8 q-mt-xs">
                Trung bình: <strong>{{ summary?.averageInternsPerMentor || 0 }}</strong> TTS/Mentor
              </div>
            </div>
            <div class="col-auto">
              <q-avatar color="blue-1" text-color="primary" icon="supervisor_account" size="48px" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Card 2: Thực tập sinh đang quản lý -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="shadow-1">
        <q-card-section class="q-pa-md">
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-caption text-grey-7 text-uppercase text-weight-medium">TTS Active</div>
              <div class="text-h5 text-weight-bolder text-teal-8 q-mt-xs">
                {{ summary?.totalActiveInterns || 0 }}
              </div>
              <div class="text-caption text-grey-8 q-mt-xs">
                <strong>{{ summary?.mentorsWithInterns || 0 }}</strong> mentor có TTS
              </div>
            </div>
            <div class="col-auto">
              <q-avatar color="teal-1" text-color="teal-8" icon="school" size="48px" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Card 3: Mentor Thiếu / Bình thường -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="shadow-1">
        <q-card-section class="q-pa-md">
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-caption text-grey-7 text-uppercase text-weight-medium">Cân bằng / Thiếu tải</div>
              <div class="text-h5 text-weight-bolder text-positive q-mt-xs">
                {{ (summary?.normalCount || 0) + (summary?.underloadCount || 0) }}
              </div>
              <div class="text-caption text-grey-8 q-mt-xs">
                Bình thường: {{ summary?.normalCount || 0 }} | Thiếu: {{ summary?.underloadCount || 0 }}
              </div>
            </div>
            <div class="col-auto">
              <q-avatar color="green-1" text-color="positive" icon="check_circle" size="48px" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Card 4: Gần đầy & Quá tải -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="shadow-1" :class="{ 'bg-red-1': (summary?.overloadCount || 0) > 0 }">
        <q-card-section class="q-pa-md">
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-caption text-grey-7 text-uppercase text-weight-medium">Gần đầy / Quá tải</div>
              <div class="text-h5 text-weight-bolder" :class="(summary?.overloadCount || 0) > 0 ? 'text-negative' : 'text-warning'">
                {{ (summary?.nearCapacityCount || 0) + (summary?.overloadCount || 0) }}
              </div>
              <div class="text-caption text-grey-8 q-mt-xs">
                Gần đầy: {{ summary?.nearCapacityCount || 0 }} | <span class="text-negative text-weight-bold">Quá tải: {{ summary?.overloadCount || 0 }}</span>
              </div>
            </div>
            <div class="col-auto">
              <q-avatar
                :color="(summary?.overloadCount || 0) > 0 ? 'red-2' : 'amber-1'"
                :text-color="(summary?.overloadCount || 0) > 0 ? 'negative' : 'warning'"
                :icon="(summary?.overloadCount || 0) > 0 ? 'warning' : 'warning_amber'"
                size="48px"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MentorWorkloadSummary } from '../types/mentorWorkload';

defineProps<{
  summary?: MentorWorkloadSummary | null;
}>();
</script>
