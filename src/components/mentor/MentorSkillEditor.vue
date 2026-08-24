<template>
  <q-card flat bordered class="q-pa-md q-mb-md rounded-borders">
    <div class="row items-center justify-between q-mb-sm">
      <div class="text-h6 text-primary flex items-center gap-2">
        <q-icon name="psychology" size="24px" />
        <span>Kỹ năng & Chuyên môn</span>
      </div>
      <q-btn color="primary" icon="add" label="Thêm kỹ năng" dense unelevated @click="showAddDialog = true" />
    </div>

    <div v-if="skills.length === 0" class="text-grey-6 text-italic q-py-sm">
      Chưa có kỹ năng nào được thêm. Vui lòng thêm các kỹ năng chuyên môn của bạn.
    </div>

    <div v-else class="row q-col-gutter-sm q-mt-xs">
      <div v-for="skill in skills" :key="skill.id" class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered class="q-pa-xs bg-grey-1">
          <q-card-section class="q-pa-sm">
            <div class="row items-center justify-between no-wrap">
              <div class="text-subtitle2 text-bold ellipsis">{{ skill.name }}</div>
              <q-btn flat round dense icon="delete" color="negative" size="sm" @click="$emit('remove-skill', skill.skillId)" />
            </div>
            <div class="row items-center justify-between q-mt-xs">
              <q-badge :color="getLevelColor(skill.proficiencyLevel)" label-key="level">
                {{ getLevelLabel(skill.proficiencyLevel) }}
              </q-badge>
              <span class="text-caption text-grey-7">{{ skill.yearsOfExperience }} năm EXP</span>
            </div>
            <q-linear-progress :value="getLevelProgress(skill.proficiencyLevel)" :color="getLevelColor(skill.proficiencyLevel)" class="q-mt-sm" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Dialog Thêm Kỹ năng -->
    <q-dialog v-model="showAddDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <div class="text-h6">Thêm kỹ năng mới</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-select
            v-model="selectedSkillId"
            :options="skillOptions"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            label="Chọn kỹ năng"
            outlined
            dense
            class="q-mb-md"
          />

          <q-select
            v-model="proficiencyLevel"
            :options="levelOptions"
            emit-value
            map-options
            label="Trình độ thành thạo"
            outlined
            dense
            class="q-mb-md"
          />

          <q-input
            v-model.number="yearsOfExperience"
            type="number"
            label="Số năm kinh nghiệm sử dụng"
            outlined
            dense
            min="0"
            max="60"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="grey" v-close-popup />
          <q-btn label="Thêm" color="primary" :disable="!selectedSkillId" @click="handleSave" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { MentorSkill, Skill, ProficiencyLevel } from '@/types/mentor';

const props = defineProps<{
  skills: MentorSkill[];
  availableSkills: Skill[];
}>();

const emit = defineEmits<{
  (e: 'add-skill', payload: { skillId: number; proficiencyLevel: ProficiencyLevel; yearsOfExperience?: number }): void;
  (e: 'remove-skill', skillId: number): void;
}>();

const showAddDialog = ref(false);
const selectedSkillId = ref<number | null>(null);
const proficiencyLevel = ref<ProficiencyLevel>('INTERMEDIATE');
const yearsOfExperience = ref<number>(1);

const skillOptions = computed(() => {
  const existingIds = new Set(props.skills.map((s) => s.skillId));
  return props.availableSkills.filter((s) => !existingIds.has(s.id));
});

const levelOptions = [
  { label: 'Beginner (Mới bắt đầu)', value: 'BEGINNER' },
  { label: 'Intermediate (Trung cấp)', value: 'INTERMEDIATE' },
  { label: 'Advanced (Nâng cao)', value: 'ADVANCED' },
  { label: 'Expert (Chuyên gia)', value: 'EXPERT' }
];

function getLevelLabel(level: ProficiencyLevel): string {
  switch (level) {
    case 'EXPERT': return 'Chuyên gia';
    case 'ADVANCED': return 'Nâng cao';
    case 'INTERMEDIATE': return 'Trung cấp';
    case 'BEGINNER': return 'Mới bắt đầu';
    default: return level;
  }
}

function getLevelColor(level: ProficiencyLevel): string {
  switch (level) {
    case 'EXPERT': return 'purple-9';
    case 'ADVANCED': return 'positive';
    case 'INTERMEDIATE': return 'primary';
    case 'BEGINNER': return 'orange-8';
    default: return 'grey';
  }
}

function getLevelProgress(level: ProficiencyLevel): number {
  switch (level) {
    case 'EXPERT': return 1.0;
    case 'ADVANCED': return 0.75;
    case 'INTERMEDIATE': return 0.5;
    case 'BEGINNER': return 0.25;
    default: return 0.2;
  }
}

function handleSave() {
  if (selectedSkillId.value) {
    emit('add-skill', {
      skillId: selectedSkillId.value,
      proficiencyLevel: proficiencyLevel.value,
      yearsOfExperience: yearsOfExperience.value
    });
    showAddDialog.value = false;
    selectedSkillId.value = null;
    proficiencyLevel.value = 'INTERMEDIATE';
    yearsOfExperience.value = 1;
  }
}
</script>
