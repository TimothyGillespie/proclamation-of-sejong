<script setup lang="ts">
import { defineProps } from 'vue';
import type { GameEvent } from '../types/game-event.types';
import GameEventChoice from './GameEventChoice.vue';
import { useGameStore } from '../store/game.store';

const { event } = defineProps<{
    event: GameEvent | null;
}>();

const gameStore = useGameStore();

const handleEscape = (keyboardEvent: KeyboardEvent) => {
    if (keyboardEvent.key === 'Escape' && gameStore.currentGameEvent) {
        const firstOption = gameStore.currentGameEvent.options[0];
        if (firstOption) {
            gameStore.makeGameEventChoice(firstOption.id);
        }
    }
};
</script>

<template>
    <div 
        v-if="event" 
        class="popup-overlay"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`event-title-${event.id}`"
        @keydown="handleEscape"
    >
        <div class="scroll-modal">
            <div class="scroll-top"></div>
            
            <div class="scroll-body">
                <div class="game-event">
                    <div class="popup-header">
                        <h2 :id="`event-title-${event.id}`" class="game-event-name">{{ event.name }}</h2>
                        <div class="seal-mark" aria-label="Official seal">Official</div>
                    </div>
                    <div class="popup-content">
                        <p
                            class="game-description-paragraph"
                            v-for="(singleLine, index) in event.description"
                            :key="index"
                        >
                            {{ singleLine }}
                        </p>
                    </div>
                </div>
                <div class="choice-bar" role="group" aria-label="Event choices">
                    <GameEventChoice
                        v-for="option in event.options"
                        :key="option.id"
                        :option="option"
                    />
                </div>
            </div>
            
            <div class="scroll-bottom"></div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
}

.scroll-modal {
    position: relative;
    width: 90%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));
}

.scroll-body {
    background-color: #fdfbf7; /* Very light paper */
    padding: 2rem 3rem;
    min-height: 200px;
    max-height: 70vh;
    overflow-y: auto;
    color: var(--ink-primary);
    position: relative;
    border-left: 10px solid var(--bg-wood-light); /* Scroll handles */
    border-right: 10px solid var(--bg-wood-light);
}

.scroll-top, .scroll-bottom {
    height: 20px;
    background-color: var(--bg-wood);
    border-radius: 10px;
    width: 104%; /* Slightly wider than body */
    margin-left: -2%;
    z-index: 2;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}

.popup-header {
    border-bottom: 2px solid var(--ink-primary);
    margin-bottom: var(--spacing-lg);
    padding-bottom: var(--spacing-sm);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.game-event-name {
    font-size: 1.8rem;
    color: var(--ink-primary);
    font-family: var(--font-serif);
    font-weight: bold;
}

.seal-mark {
    border: 3px solid var(--color-danger);
    color: var(--color-danger);
    font-weight: bold;
    padding: 2px 6px;
    font-size: 0.8rem;
    border-radius: 4px;
    transform: rotate(-10deg);
    font-family: var(--font-mono);
    opacity: 0.8;
}

.game-description-paragraph {
    margin-bottom: var(--spacing-md);
    line-height: 1.8;
    font-size: 1.1rem;
    font-family: var(--font-serif);
}

.choice-bar {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    margin-top: var(--spacing-lg);
    padding-top: var(--spacing-md);
    border-top: 1px dashed var(--ink-secondary);
}
</style>
