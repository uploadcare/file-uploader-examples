import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import './assets/main.css'

import FormView from './views/FormView/FormView.vue';
import MinimalView from './views/MinimalView/MinimalView.vue';
import RegularView from './views/RegularView/RegularView.vue';

import App from './App.vue';

const routes = [
  {
    path: '/',
    redirect: '/form',
  },
  {
    path: '/form',
    component: FormView,
  },
  {
    path: '/minimal',
    component: MinimalView,
  },
  {
    path: '/regular',
    component: RegularView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount('#app');
