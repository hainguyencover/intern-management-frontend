<template>
  <BaseDialog
    :model-value="modelValue"
    title="Tạo phom đánh giá thực tập sinh"
    :loading="loading"
    style="width: 640px; max-width: 90vw;"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    @cancel="$emit('update:modelValue', false)"
  >
    <EvaluationForm
      :intern-id="internId"
      :period="period"
      :feedback="feedback"
      :criteria="criteria"
      :calculated-result="calculatedResult"
      :intern-error="internError"
      @update:intern-id="$emit('update:internId', $event)"
      @update:period="$emit('update:period', $event)"
      @update:feedback="$emit('update:feedback', $event)"
      @save="$emit('save')"
    />

    <template #actions>
      <BaseButton flat label="Hủy" color="secondary" @click="$emit('update:modelValue', false)" />
      <BaseButton label="Lưu bản thảo" color="primary" :loading="loading" @click="$emit('save')" />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '../../../shared/components/BaseDialog.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';
import EvaluationForm from './EvaluationForm.vue';
import type { EvaluationCriterion } from '../models/evaluation';
import type { ScoreEngineResult } from '../services/evaluationScoreEngine';

defineProps<{
  modelValue: boolean;
  internId: string;
  period: string;
  feedback?: string;
  criteria: EvaluationCriterion[];
  calculatedResult: ScoreEngineResult;
  loading: boolean;
  internError?: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'update:internId', value: string): void;
  (e: 'update:period', value: string): void;
  (e: 'update:feedback', value: string): void;
  (e: 'save'): void;
}>();
</script>
