<template>
  <q-page class="q-pa-md">
    <!-- Header Banner -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h1 class="text-h5 text-bold q-my-none text-primary">Thông tin Nhóm Thực tập của tôi</h1>
        <p class="text-caption text-grey-7 q-mb-none">Xem thông tin chi tiết về Chương trình, Nhóm thực tập, Mentor hướng dẫn và các đồng đội</p>
      </div>
      <q-btn flat round icon="refresh" color="primary" @click="fetchMyGroupInfo" :loading="loading">
        <q-tooltip>Làm mới</q-tooltip>
      </q-btn>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="row q-col-gutter-md">
      <div class="col-12"><q-skeleton type="rect" height="120px" /></div>
      <div class="col-12 col-md-6"><q-skeleton type="rect" height="200px" /></div>
      <div class="col-12 col-md-6"><q-skeleton type="rect" height="200px" /></div>
    </div>

    <!-- Empty State if no group -->
    <div v-else-if="!groupInfo || !groupInfo.groupId" class="text-center q-pa-xl">
      <q-icon name="groups" size="64px" color="grey-5" />
      <div class="text-h6 text-grey-7 q-mt-md">Bạn chưa được xếp vào Nhóm thực tập nào</div>
      <p class="text-caption text-grey-6">Vui lòng liên hệ HR hoặc Mentor quản lý chương trình để được hỗ trợ phân nhóm.</p>
    </div>

    <!-- Content View -->
    <div v-else class="q-gutter-y-md">
      <!-- Program & Group Summary Header Card -->
      <q-card flat bordered class="bg-primary text-white">
        <q-card-section>
          <div class="row items-center justify-between">
            <div>
              <div class="text-overline text-blue-2">
                <q-icon name="school" size="xs" class="q-mr-xs" />
                {{ groupInfo.programName }} {{ groupInfo.programCode ? `(${groupInfo.programCode})` : '' }}
              </div>
              <div class="text-h4 text-bold">{{ groupInfo.groupName }}</div>
              <div v-if="groupInfo.groupDescription" class="text-body2 text-blue-1 q-mt-xs">
                {{ groupInfo.groupDescription }}
              </div>
            </div>
            <div class="text-right">
              <q-badge color="white" text-color="primary" class="text-bold q-px-sm q-py-xs">
                {{ groupInfo.coInterns ? groupInfo.coInterns.length : 0 }} Thành viên
              </q-badge>
              <div class="text-caption text-blue-2 q-mt-xs" v-if="groupInfo.programStartDate">
                {{ groupInfo.programStartDate }} ➔ {{ groupInfo.programEndDate || 'N/A' }}
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <div class="row q-col-gutter-md">
        <!-- Mentor Info Card -->
        <div class="col-12 col-md-5">
          <q-card flat bordered class="fit">
            <q-card-section>
              <div class="text-subtitle1 text-bold text-primary flex items-center q-mb-md">
                <q-icon name="record_voice_over" size="sm" class="q-mr-sm text-purple" />
                Mentor Hướng dẫn
              </div>

              <div v-if="groupInfo.mentorId">
                <div class="row items-center q-mb-md">
                  <q-avatar size="56px" color="purple-1" text-color="purple-9" class="q-mr-md">
                    <q-icon name="person" size="32px" />
                  </q-avatar>
                  <div>
                    <div class="text-h6 text-bold">{{ groupInfo.mentorName || 'Mentor #' + groupInfo.mentorId }}</div>
                    <div class="text-caption text-grey-7" v-if="groupInfo.mentorDepartment">
                      <q-icon name="business" size="xs" /> {{ groupInfo.mentorDepartment }}
                    </div>
                  </div>
                </div>

                <q-separator class="q-my-sm" />

                <q-list dense>
                  <q-item v-if="groupInfo.mentorEmail">
                    <q-item-section avatar min-width="32px">
                      <q-icon name="email" color="grey-7" size="xs" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-caption text-grey-9">{{ groupInfo.mentorEmail }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="groupInfo.mentorPhone">
                    <q-item-section avatar min-width="32px">
                      <q-icon name="phone" color="grey-7" size="xs" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-caption text-grey-9">{{ groupInfo.mentorPhone }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <div v-else class="text-center q-pa-md text-grey-6 text-caption">
                Nhóm chưa được phân công Mentor hướng dẫn
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Co-interns List Card -->
        <div class="col-12 col-md-7">
          <q-card flat bordered class="fit">
            <q-card-section>
              <div class="row items-center justify-between q-mb-md">
                <div class="text-subtitle1 text-bold text-primary flex items-center">
                  <q-icon name="groups" size="sm" class="q-mr-sm text-blue" />
                  Danh sách Thực tập sinh cùng nhóm ({{ groupInfo.coInterns ? groupInfo.coInterns.length : 0 }})
                </div>
              </div>

              <q-list separator>
                <q-item v-for="intern in groupInfo.coInterns" :key="intern.internId" class="q-py-sm">
                  <q-item-section avatar>
                    <q-avatar color="blue-1" text-color="blue-9" size="40px">
                      {{ (intern.fullName || 'T')[0].toUpperCase() }}
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-weight-bold">
                      {{ intern.fullName || ('TTS #' + intern.internId) }}
                      <q-chip dense v-if="intern.studentCode" color="grey-3" text-color="grey-9" size="xs" class="q-ml-xs">
                        {{ intern.studentCode }}
                      </q-chip>
                    </q-item-label>
                    <q-item-label caption class="text-grey-7">
                      {{ [intern.email, intern.university, intern.major].filter(Boolean).join(' • ') }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <span class="text-caption text-grey-6" v-if="intern.joinedAt">
                      Tham gia: {{ new Date(intern.joinedAt).toLocaleDateString('vi-VN') }}
                    </span>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { apiClient as api } from '../../../shared/api/client'

const $q = useQuasar()
const loading = ref(false)
const groupInfo = ref<any>(null)

async function fetchMyGroupInfo() {
  loading.value = true
  try {
    const res = await api.get('/api/v1/interns/me/group')
    if (res.data && res.data.data) {
      groupInfo.value = res.data.data
    }
  } catch (err: any) {
    console.warn('Fetch my group info error:', err)
    $q.notify({ type: 'warning', message: 'Không thể tải thông tin nhóm' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMyGroupInfo()
})
</script>
