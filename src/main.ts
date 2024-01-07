import '@@@/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import router from './router';
import { RouterView } from 'vue-router';

import '@shi-zhong/genshin-ui/css'

const app = createApp(RouterView);

app.use(createPinia());
app.use(router);

app.mount('#app');
