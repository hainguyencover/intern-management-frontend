<template>
  <BaseCard title="Phân bổ thực tập sinh theo phòng ban" subtitle="Thống kê trực quan số lượng nhân sự">
    <div class="q-py-md">
      <div v-for="dept in departments" :key="dept.name" class="q-mb-md">
        <div class="row justify-between text-caption text-bold q-mb-xs">
          <span>{{ dept.name }}</span>
          <span>{{ dept.count }} thực tập sinh ({{ dept.percentage }}%)</span>
        </div>
        <q-linear-progress
          :value="dept.percentage / 100"
          :color="dept.color"
          size="10px"
          class="rounded-progress"
        />
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '../../../shared/components/BaseCard.vue';

const departments = [
  { name: 'Phòng Phát triển Phần mềm (Tech)', count: 54, percentage: 42, color: 'primary' },
  { name: 'Phòng Kiểm thử & Đảm bảo Chất lượng (QA)', count: 28, percentage: 22, color: 'info' },
  { name: 'Phòng Thiết kế Sản phẩm (UI/UX)', count: 22, percentage: 17, color: 'secondary' },
  { name: 'Phòng Quản trị Dự án (PM/BA)', count: 24, percentage: 19, color: 'warning' }
];
</script>

<style scoped lang="sass">
.rounded-progress
  border-radius: 6px
</style>
