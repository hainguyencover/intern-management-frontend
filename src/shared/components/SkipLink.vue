<template>
  <a href="#main-content" class="skip-link text-bold bg-primary text-white q-pa-sm rounded-borders shadow-2">
    Bỏ qua và chuyển đến nội dung chính
  </a>
</template>

<style scoped>
.skip-link {
  position: absolute;
  top: -100px;
  left: 10px;
  z-index: 9999;
  transition: top 0.2s ease-in-out;
}
.skip-link:focus {
  top: 10px;
}
</style>
