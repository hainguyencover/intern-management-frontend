<template>
  <form @submit.prevent="$emit('save')">
    <div class="q-gutter-y-md">
      <!-- Intern & Period selection -->
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <BaseSelect
            :model-value="internId"
            :options="internOptions"
            label="Thực tập sinh *"
            :error="internError"
            @update:model-value="$emit('update:internId', $event)"
          />
        </div>
        <div class="col-12 col-md-6">
          <BaseInput
            :model-value="period"
            label="Kỳ đánh giá *"
            placeholder="VD: Tháng 02/2026"
            @update:model-value="$emit('update:period', $event)"
          />
        </div>
      </div>

      <q-separator />

      <!-- Dynamic Criteria Scoring Sliders -->
      <div class="text-bold text-subtitle2">Bảng chấm điểm tiêu chí (Trọng số 100%)</div>
      
      <div v-for="item in criteria" :key="item.id" class="q-pa-sm bg-grey-1 rounded-borders">
        <div class="row justify-between items-center">
          <span class="text-bold text-body2">{{ item.name }} ({{ item.weight * 100 }}%)</span>
          <span class="text-bold text-primary">{{ item.score }} / 10</span>
        </div>
        <q-slider
          v-model="item.score"
          :min="1"
          :max="10"
          :step="0.5"
          label
          color="primary"
          class="q-mt-xs"
        />
      </div>

      <!-- Real-time Score Engine Calculation Result Banner -->
      <q-banner rounded class="bg-primary text-white q-pa-md">
        <div class="row justify-between items-center">
          <div>
            <div class="text-subtitle1 text-bold">Điểm tổng kết trọng số: {{ calculatedResult.weightedScore }} / 10</div>
            <div class="text-caption">Hệ thống Score Engine tự động tính toán dựa trên trọng số các tiêu chí</div>
          </div>
          <div class="row q-gutter-x-xs">
            <BaseBadge :label="`Grade ${calculatedResult.grade}`" color="success" />
            <BaseBadge :label="calculatedResult.passFail" :color="calculatedResult.passFail === 'PASS' ? 'success' : 'danger'" />
          </div>
        </div>
      </q-banner>

      <!-- Feedback / Recommendation -->
      <BaseTextarea
        :model-value="feedback"
        label="Nhận xét & Khuyến nghị của Mentor"
        placeholder="Nhập nhận xét tổng quan về quá trình thực tập..."
        @update:model-value="$emit('update:feedback', $event)"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import BaseSelect from '../../../shared/components/BaseSelect.vue';
import BaseInput from '../../../shared/components/BaseInput.vue';
import BaseTextarea from '../../../shared/components/BaseTextarea.vue';
import BaseBadge from '../../../shared/components/BaseBadge.vue';
import type { EvaluationCriterion } from '../models/evaluation';
import type { ScoreEngineResult } from '../services/evaluationScoreEngine';

defineProps<{
  internId: string;
  period: string;
  feedback?: string;
  criteria: EvaluationCriterion[];
  calculatedResult: ScoreEngineResult;
  internError?: string;
}>();

defineEmits<{
  (e: 'update:internId', value: string): void;
  (e: 'update:period', value: string): void;
  (e: 'update:feedback', value: string): void;
  (e: 'save'): void;
}>();

const internOptions = [
  { label: 'Nguyễn Văn A (TTS2026-001)', value: 'intern-1' },
  { label: 'Trần Thị B (TTS2026-002)', value: 'intern-2' }
];
</script>
