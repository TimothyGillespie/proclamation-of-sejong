import { defineStore } from 'pinia';
import type { Currency } from '../types/game-state.types';
import { useGameStore } from './game.store';
import { useToastStore } from './toast.store';

const gameStore = useGameStore();
const toastStore = useToastStore();

export const useUpgradeStore = defineStore('upgrade', {
    getters: {},
    actions: {},
});
