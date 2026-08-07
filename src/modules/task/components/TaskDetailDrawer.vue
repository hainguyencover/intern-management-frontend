<template>
  <q-drawer
    :model-value="modelValue"
    side="right"
    bordered
    overlay
    class="bg-grey-1"
    style="width: 480px"
    @update:model-value="(val) => $emit('update:modelValue', val)"
  >
    <div v-if="task" class="column full-height q-pa-lg">
      <!-- Header -->
      <div class="row items-center justify-between q-mb-md">
        <div>
          <span class="text-caption text-bold text-primary">{{ task.code }}</span>
          <h6 class="q-my-none text-bold">{{ task.title }}</h6>
        </div>
        <q-btn flat dense icon="close" @click="$emit('update:modelValue', false)" />
      </div>

      <q-separator class="q-mb-md" />

      <!-- Details -->
      <div class="q-mb-lg">
        <div class="text-caption text-bold text-grey-7">Mô tả nhiệm vụ:</div>
        <div class="text-body2 text-grey-9 q-mt-xs">{{ task.description }}</div>

        <div class="row q-col-gutter-sm q-mt-md">
          <div class="col-6">
            <div class="text-caption text-grey-6">Người thực hiện:</div>
            <div class="text-bold text-body2">{{ task.assigneeName }}</div>
          </div>
          <div class="col-6">
            <div class="text-caption text-grey-6">Hạn hoàn thành:</div>
            <div class="text-bold text-body2">{{ task.dueDate }}</div>
          </div>
        </div>
      </div>

      <q-separator class="q-mb-md" />

      <!-- Comment Section -->
      <div class="col column no-wrap">
        <div class="text-bold text-subtitle2 q-mb-sm">Thảo luận ({{ comments.length }})</div>

        <!-- Comment List -->
        <div class="col overflow-auto q-mb-md q-pr-xs">
          <div
            v-for="c in comments"
            :key="c.id"
            class="q-pa-sm q-mb-sm bg-white rounded-borders shadow-1"
          >
            <div class="row justify-between text-caption">
              <span class="text-bold text-primary">{{ c.authorName }} ({{ c.authorRole }})</span>
              <span class="text-grey-6">{{ c.createdAt }}</span>
            </div>
            <div class="text-body2 q-mt-xs">{{ c.content }}</div>
          </div>

          <div v-if="!comments.length" class="text-caption text-grey-6 text-center q-pa-md">
            Chưa có bình luận nào.
          </div>
        </div>

        <!-- Add Comment Form -->
        <div class="row q-gutter-x-xs">
          <BaseInput
            :model-value="newCommentText"
            placeholder="Nhập phản hồi..."
            class="col"
            @update:model-value="$emit('update:newCommentText', $event)"
          />
          <BaseButton icon="send" color="primary" @click="$emit('addComment')" />
        </div>
      </div>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import BaseInput from '../../../shared/components/BaseInput.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';
import type { Task, TaskComment } from '../models/task';

defineProps<{
  modelValue: boolean;
  task: Task | null;
  comments: TaskComment[];
  newCommentText: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'update:newCommentText', value: string): void;
  (e: 'addComment'): void;
}>();
</script>
