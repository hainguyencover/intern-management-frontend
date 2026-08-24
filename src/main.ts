import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Quasar } from 'quasar';
import quasarUserOptions from './quasar-user-options';

import App from '@/app/App.vue';
import router from '@/router';

import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';

import { vCan } from '@/shared/directives/can';
import { vRole } from '@/shared/directives/role';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Quasar, quasarUserOptions);

app.directive('can', vCan);
app.directive('role', vRole);

app.mount('#app');
