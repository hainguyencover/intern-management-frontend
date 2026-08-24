<template>
  <div class="hr-dashboard">
    <div class="text-h5 text-weight-bold q-mb-md">HR Operations Dashboard</div>

    <!-- Summary Widgets -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-blue-1 text-blue-10">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-caption text-uppercase text-weight-bold">Tổng Thực tập sinh</div>
              <div class="text-h4 text-weight-bolder">96</div>
            </div>
            <q-icon name="groups" size="3em" color="blue" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-green-1 text-green-10">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-caption text-uppercase text-weight-bold">Có mặt Hôm nay</div>
              <div class="text-h4 text-weight-bolder">88</div>
            </div>
            <q-icon name="how_to_reg" size="3em" color="green" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-orange-1 text-orange-10">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-caption text-uppercase text-weight-bold">Đơn xin nghỉ chờ duyệt</div>
              <div class="text-h4 text-weight-bolder">4</div>
            </div>
            <q-icon name="pending_actions" size="3em" color="orange" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-purple-1 text-purple-10">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-caption text-uppercase text-weight-bold">Yêu cầu Hỗ trợ chờ xử lý</div>
              <div class="text-h4 text-weight-bolder">2</div>
            </div>
            <q-icon name="contact_support" size="3em" color="purple" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Quick Action Panels -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card flat bordered class="fit">
          <q-card-section>
            <div class="text-h6 text-weight-bold">Báo cáo chờ duyệt</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-list separator>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-weight-medium">Báo cáo tuần 34 - Nguyễn Văn A</q-item-label>
                  <q-item-label caption>Nhóm Backend Java - Mentor: Lê Văn B</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-chip size="sm" color="amber-3" text-color="amber-10">SUBMITTED</q-chip>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card flat bordered class="fit">
          <q-card-section>
            <div class="text-h6 text-weight-bold">Tải lượng Mentors</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-list separator>
              <q-item>
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white">MB</q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-medium">Lê Văn B (Senior Java)</q-item-label>
                  <q-item-label caption>4 / 5 Thực tập sinh đang phụ trách</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge color="positive">Active</q-badge>
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
</script>
