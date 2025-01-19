import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { useGameStore } from './store/game.store';

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

const gameStore = useGameStore();
setInterval(() => {
    gameStore.tickTime();
}, 10);

app.mount('#app');
