<template>
  <div class="admin-dashboard">
    <div class="text-h5 text-weight-bold q-mb-md">Admin System Overview</div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-indigo-1 text-indigo-10">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-caption text-uppercase text-weight-bold">Tổng Người dùng</div>
              <div class="text-h4 text-weight-bolder">148</div>
            </div>
            <q-icon name="people" size="3em" color="indigo" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-teal-1 text-teal-10">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-caption text-uppercase text-weight-bold">Thực tập sinh</div>
              <div class="text-h4 text-weight-bolder">96</div>
            </div>
            <q-icon name="groups" size="3em" color="teal" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-amber-1 text-amber-10">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-caption text-uppercase text-weight-bold">Mentors Active</div>
              <div class="text-h4 text-weight-bolder">24</div>
            </div>
            <q-icon name="supervisor_account" size="3em" color="amber-9" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-blue-grey-1 text-blue-grey-10">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-caption text-uppercase text-weight-bold">System Health</div>
              <div class="text-h4 text-weight-bolder">99.9%</div>
            </div>
            <q-icon name="health_and_safety" size="3em" color="blue-grey" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="q-pa-md">
      <div class="text-h6 q-mb-sm">Hoạt động Hệ thống Gần đây</div>
      <q-list separator>
        <q-item>
          <q-item-section avatar>
            <q-icon name="person_add" color="positive" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Tạo mới 5 tài khoản Thực tập sinh kíp 2026-Q3</q-item-label>
            <q-item-label caption>Bởi Admin System - 10 phút trước</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-icon name="security" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Cập nhật Phân quyền vai trò HR Lead</q-item-label>
            <q-item-label caption>Bởi Admin System - 1 giờ trước</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </div>
</template>

<script setup lang="ts">
</script>
