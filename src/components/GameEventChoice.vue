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
            v-on:click="gameStore.makeGameEventChoice(option.id)"
        >
            {{ option.label }}
        </button>
    </div>
</template>

<style scoped lang="scss">
.game-event-choice {
    margin-bottom: 1rem;

    .choice-button {
        background-color: gray;
        color: white;
        border: 1px solid black;
        padding: 0.5rem;
        border-radius: 5px;
        cursor: pointer;
    }
}
</style>
