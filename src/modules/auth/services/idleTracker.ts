import { useAuthStore } from '../store/authStore';

let idleTimer: any = null;
const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export function startIdleTracker() {
  const authStore = useAuthStore();

  const resetTimer = () => {
    authStore.touchActivity();
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      onIdleTimeout();
    }, IDLE_TIMEOUT_MS);
  };

  window.addEventListener('mousemove', resetTimer);
  window.addEventListener('keydown', resetTimer);
  window.addEventListener('click', resetTimer);

  resetTimer();
}

export function stopIdleTracker() {
  if (idleTimer) clearTimeout(idleTimer);
}

function onIdleTimeout() {
  const authStore = useAuthStore();
  authStore.clearSession();
  window.dispatchEvent(new CustomEvent('holaho:session-expired'));
}
