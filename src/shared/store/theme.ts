import { defineStore } from 'pinia';
import { Dark } from 'quasar';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: localStorage.getItem('theme_dark') === 'true'
  }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark;
      localStorage.setItem('theme_dark', String(this.isDark));
      Dark.set(this.isDark);
    },
    initTheme() {
      Dark.set(this.isDark);
    }
  }
});
