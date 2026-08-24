<template>
  <q-page class="q-pa-lg bg-grey-2">
    <!-- Header Controls -->
    <DashboardHeader
      :time-range="timeRange"
      :loading="loading"
      @update:time-range="changeTimeRange"
      @refresh="refresh"
    />

    <!-- Skeleton Loading State -->
    <BaseSkeleton v-if="loading && (!kpis || !kpis.length)" type="card" :rows="4" />

    <!-- Confirmed Active Intern Workspace -->
    <template v-else-if="isConfirmedIntern">
      <InternDashboardWidget />
    </template>

    <!-- Candidate Recruitment Workspace (Unconfirmed Applicant) -->
    <template v-else-if="isCandidate">
      <CandidateDashboardWidget />
    </template>

    <!-- HR Specific Operational Workspace -->
    <template v-else-if="isHr">
      <HrDashboardWidget />
    </template>

    <!-- Mentor Specific Workspace -->
    <template v-else-if="isMentor">
      <MentorDashboardWidget />
    </template>

    <!-- Admin Specific System Administrator Workspace -->
    <template v-else-if="isAdmin">
      <AdminDashboardWidget />
    </template>

    <!-- Main Admin / HR / Mentor Dashboard Content -->
    <template v-else>
      <!-- Row 1: KPI Stat Cards -->
      <div class="row q-col-gutter-md q-mb-lg" v-if="kpis && kpis.length">
        <div
          v-for="kpi in kpis"
          :key="kpi.id"
          class="col-12 col-sm-6 col-md-3"
        >
          <KpiStatCard
            :title="kpi.title"
            :value="kpi.value"
            :change-percentage="kpi.changePercentage"
            :trend="kpi.trend"
            :icon="kpi.icon"
            :color="kpi.color"
          />
        </div>
      </div>

      <!-- Row 2: Dynamic Registered Widgets with Independent Error Boundaries -->
      <div class="row q-col-gutter-lg">
        <BaseWidgetWrapper
          v-for="widget in registeredWidgets"
          :key="widget.id"
          :title="widget.title"
          :component="widget.component"
          :grid-col="widget.gridCol"
          :permission="widget.permission"
          :component-props="getWidgetProps(widget.id)"
        />
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DashboardHeader from '../components/DashboardHeader.vue';
import KpiStatCard from '../components/KpiStatCard.vue';
import BaseWidgetWrapper from '../components/BaseWidgetWrapper.vue';
import InternDashboardWidget from '../components/InternDashboardWidget.vue';
import CandidateDashboardWidget from '../components/CandidateDashboardWidget.vue';
import HrDashboardWidget from '../components/HrDashboardWidget.vue';
import MentorDashboardWidget from '../components/MentorDashboardWidget.vue';
import AdminDashboardWidget from '../components/AdminDashboardWidget.vue';
import BaseSkeleton from '../../../shared/components/BaseSkeleton.vue';
import { useDashboard } from '../composables/useDashboard';
import { widgetRegistry } from '../registry/widgetRegistry';
import { useAuthStore } from '../../auth/store/authStore';

const authStore = useAuthStore();

const isStaffRole = computed(() => authStore.roles.some(r => ['HR', 'ADMIN', 'ROLE_HR', 'ROLE_ADMIN', 'MENTOR', 'ROLE_MENTOR'].includes(r)));
const isInternRole = computed(() => authStore.roles.includes('ROLE_INTERN') || authStore.roles.includes('INTERN'));

const isConfirmedIntern = computed(() => {
  const activeInternStatuses = ['APPROVED', 'CONTRACT_SIGNED', 'INTERNING', 'COMPLETED', 'ONBOARDING'];
  const appStatus = authStore.user?.applicationStatus || '';
  return isInternRole.value && !isStaffRole.value && activeInternStatuses.includes(appStatus);
});

const isCandidate = computed(() => {
  return isInternRole.value && !isStaffRole.value && !isConfirmedIntern.value;
});

const isHr = computed(() => authStore.roles.includes('ROLE_HR') || authStore.roles.includes('HR'));
const isMentor = computed(() => authStore.roles.includes('ROLE_MENTOR') || authStore.roles.includes('MENTOR'));
const isAdmin = computed(() => authStore.roles.includes('ROLE_ADMIN') || authStore.roles.includes('ADMIN'));

const {
  kpis,
  activities,
  timeRange,
  loading,
  changeTimeRange,
  refresh
} = useDashboard();

const registeredWidgets = computed(() => widgetRegistry.getWidgets());

function getWidgetProps(widgetId: string) {
  if (widgetId === 'recent-activity-widget') {
    return { activities: activities.value };
  }
  return {};
}
</script>
