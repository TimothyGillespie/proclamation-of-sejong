<script setup lang="ts">
import { defineProps } from 'vue';
import type { GameEvent } from '../types/game-event.types';
import GameEventChoice from './GameEventChoice.vue';

const { event } = defineProps<{
    event: GameEvent | null;
}>();
</script>

<template>
    <div v-if="event" class="game-event-popup">
        <div class="game-event">
            <h2 class="game-event-name">{{ event.name }}</h2>
            <p
                class="game-description-paragraph"
                v-for="singleLine in event.description"
            >
                {{ singleLine }}
            </p>
        </div>
        <div class="choice-bar">
            <GameEventChoice
                v-for="option in event.options"
                :key="option.id"
                :option="option"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
.game-event-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    color: white;
    transform: translate(-50%, -50%);
    background-color: brown;
    border: 1px solid black;
    padding: 1rem;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    z-index: 100;
}

.game-event {
    margin-bottom: 1rem;
}

.game-event-name {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    font-size: 1.5rem;
    border-bottom: 1px solid white;
}

.game-description-paragraph {
    margin: 1.2rem 0;
    font-size: 1.2rem;
}

.choice-bar {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
