import { Notify, Dialog, Loading, LoadingBar } from 'quasar';
import '@quasar/extras/material-icons/material-icons.css';

export default {
  config: {
    notify: {
      position: 'top-right',
      timeout: 3000
    },
    loading: {},
    loadingBar: {
      color: 'primary',
      size: '3px'
    }
  },
  plugins: {
    Notify,
    Dialog,
    Loading,
    LoadingBar
  }
};
