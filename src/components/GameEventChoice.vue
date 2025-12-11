<script setup lang="ts">
import { useGameStore } from '../store/game.store';
import type { GameEventOption } from '../types/game-event.types';

const { option } = defineProps<{
    option: GameEventOption;
}>();

const gameStore = useGameStore();
</script>

<template>
    <div class="game-event-choice">
        <button
            class="choice-button"
            v-if="option.type === 'choice'"
            @click="gameStore.makeGameEventChoice(option.id)"
        >
            {{ option.label }}
        </button>
    </div>
</template>

<style scoped lang="scss">
.game-event-choice {
    .choice-button {
        background-color: transparent;
        color: var(--ink-primary);
        border: 2px solid var(--ink-primary);
        padding: 0.8rem 1.5rem;
        border-radius: 4px; /* Slight round */
        cursor: pointer;
        font-size: 1rem;
        font-family: var(--font-serif);
        font-weight: bold;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;

        &:hover {
            background-color: var(--ink-primary);
            color: var(--bg-paper);
            transform: translateY(-2px);
            box-shadow: 2px 2px 0 var(--ink-secondary);
        }
        
        &:active {
            transform: translateY(0);
            box-shadow: none;
        }
    }
}
</style>
