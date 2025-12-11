<script setup lang="ts">
import { ref, watch, onUnmounted, computed, onMounted } from 'vue';
import { InputStore, blockToString } from '../keyboard/input-store';
import { keyboardService } from '../keyboard/typing.service';
import { useGameStore } from '../store/game.store';
import type { EvaluatedHangulBlock } from '../types/challenge.types';
import type { Challenge } from '../types/game-state.types';
import type { TypeEvent } from '../types/event.types';

// Store & Props
const gameStore = useGameStore();
const { challenge } = defineProps<{ challenge: Challenge }>();

// Typing Logic State
const inputStore = new InputStore();
const evaluatedBlocks = ref<EvaluatedHangulBlock[]>([]);
const cursorLocation = ref(0);
const currentTaskPartIndex = ref(0);
const currentTaskPart = ref<Challenge['task'][number]>(
    challenge?.task[currentTaskPartIndex.value] ?? null
);

// Derived state for better visualization
const targetText = computed(() => currentTaskPart.value?.text || '');
const targetBlocks = computed(() => targetText.value.split(''));

// Handle Keyboard Input
const subscription = keyboardService.subscribe((typeEvent: TypeEvent) => {
    if (!currentTaskPart.value) return;

    inputStore.input(typeEvent);
    evaluatedBlocks.value = inputStore.getEvaluatedBlocks(
        currentTaskPart.value.text
    );

    const lastBlock = evaluatedBlocks.value[evaluatedBlocks.value.length - 1];

    // Update cursor position based on completion
    if (lastBlock && lastBlock.completed) {
        // If last block is done, cursor is potentially at the next spot
        // But if we are done with all blocks, handle separately
        cursorLocation.value = evaluatedBlocks.value.length;
    } else {
        // Still working on the last block
        cursorLocation.value = Math.max(0, evaluatedBlocks.value.length - 1);
    }

    // Check Completion
    if (
        evaluatedBlocks.value.length === targetText.value.length &&
        evaluatedBlocks.value.every((block) => block.state === 'correct')
    ) {
        handlePartCompletion();
    }
});

const handlePartCompletion = () => {
    // Small delay for visual satisfaction
    setTimeout(() => {
        if (currentTaskPartIndex.value < challenge.task.length - 1) {
            currentTaskPartIndex.value++;
            currentTaskPart.value = challenge.task[currentTaskPartIndex.value];
            resetInputState();
        } else {
            gameStore.completeChallenge();
            currentTaskPartIndex.value = 0;
            // The component might unmount or reset here via parent
        }
    }, 200);
};

const resetInputState = () => {
    inputStore.reset();
    evaluatedBlocks.value = [];
    cursorLocation.value = 0;
};

// Lifecycle
onUnmounted(() => {
    subscription.unsubscribe();
});

watch(
    () => challenge.task,
    () => {
        resetInputState();
    }
);

// Initial Reset
onMounted(() => {
    resetInputState();
});
</script>

<template>
    <div class="challenge-paper" v-if="currentTaskPart">
        <div class="paper-header">
            <h3>Practice</h3>
            <div class="ink-stain" aria-hidden="true"></div>
        </div>

        <div
            class="translation-banner"
            v-if="currentTaskPart.translation"
            role="note"
            aria-label="Translation"
        >
            <span class="quote-mark" aria-hidden="true">"</span>
            {{ currentTaskPart.translation }}
            <span class="quote-mark" aria-hidden="true">"</span>
        </div>

        <div
            class="writing-area"
            role="textbox"
            aria-label="Typing practice area"
            :aria-valuenow="evaluatedBlocks.length"
            :aria-valuemax="targetText.length"
            :aria-valuetext="`${evaluatedBlocks.length} of ${targetText.length} characters completed`"
        >
            <!-- 
               We render each character slot individually.
               This allows us to treat "Target" and "Input" as one unified visual unit per character.
            -->
            <div
                v-for="(char, index) in targetBlocks"
                :key="index"
                class="char-slot"
                :class="{
                    'current-cursor':
                        index === cursorLocation &&
                        evaluatedBlocks[index]?.completed !== true,
                    'is-completed': evaluatedBlocks[index]?.state === 'correct',
                    'is-error':
                        evaluatedBlocks[index]?.state === 'incorrect' &&
                        evaluatedBlocks[index]?.completed,
                }"
                :aria-label="`Character ${index + 1}: ${evaluatedBlocks[index] ? (evaluatedBlocks[index].state === 'correct' ? 'correct' : 'incorrect') : 'not yet typed'}`"
            >
                <!-- Background Guide Character (Faint) -->
                <div class="guide-char" aria-hidden="true">{{ char }}</div>

                <!-- User Input Character (Ink Overlay) -->
                <div
                    class="input-char"
                    v-if="evaluatedBlocks[index]"
                    aria-hidden="true"
                >
                    {{ blockToString(evaluatedBlocks[index]) }}
                </div>
            </div>
        </div>

        <div class="instructions" role="status" aria-live="polite">
            <span class="key-hint">Type to write</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.challenge-paper {
    background-color: #fffdf5;
    border: 1px solid #d7ccc8;
    padding: var(--spacing-lg);
    box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.1),
        0 15px 30px rgba(0, 0, 0, 0.05);
    text-align: center;
    position: relative;
    width: 100%;
    max-width: 700px;
    margin: 0 auto;

    /* Paper texture */
    background-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.03) 1px,
            transparent 1px
        ),
        linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
    background-size: 40px 40px; /* Larger grid for calligraphy feel */
}

.paper-header {
    margin-bottom: var(--spacing-lg);
    border-bottom: 2px solid var(--ink-secondary);
    padding-bottom: var(--spacing-sm);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    h3 {
        font-family: var(--font-serif);
        color: var(--ink-secondary);
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: 1rem;
    }
}

.translation-banner {
    font-size: 1.3rem;
    color: var(--ink-primary);
    margin-bottom: 2rem;
    font-family: var(--font-serif);
    font-style: italic;
    line-height: 1.4;
    padding: 0 var(--spacing-md);

    .quote-mark {
        color: var(--color-rice); /* Gold accent */
        font-size: 1.5em;
        vertical-align: -0.2em;
    }
}

.writing-area {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1.5rem; /* Space between character boxes */
    margin: 2rem 0 3rem 0;
}

/* Individual Character Slot */
.char-slot {
    width: 80px;
    height: 80px;
    position: relative;
    border: 2px dashed #d7ccc8; /* Empty box look */
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    background-color: rgba(255, 255, 255, 0.4);

    &.current-cursor {
        border-color: var(--ink-primary);
        border-style: solid;
        box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.05);
        transform: scale(1.05);
        background-color: #fff;

        /* Blinking Cursor Indicator inside */
        &::after {
            content: '';
            position: absolute;
            bottom: 5px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 2px;
            background-color: var(--ink-primary);
            animation: blink 1s infinite;
        }
    }

    &.is-completed {
        border-color: transparent;
        border-bottom: 2px solid var(--color-nature); /* Green underline for done */
    }

    &.is-error {
        border-color: var(--color-danger);
        background-color: rgba(255, 0, 0, 0.05);
        animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
}

.guide-char {
    position: absolute;
    font-family: var(--font-mono);
    font-size: 3rem;
    color: rgba(0, 0, 0, 0.1); /* Very faint */
    pointer-events: none;
    user-select: none;
    z-index: 1;
}

.input-char {
    position: relative;
    font-family: var(--font-mono);
    font-size: 3rem;
    color: var(--ink-primary);
    z-index: 2;
    /* Ink bleed effect simulation */
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
}

.char-slot.is-error .input-char {
    color: var(--color-danger);
    text-decoration: line-through;
}

.instructions {
    font-size: 0.9rem;
    color: var(--ink-secondary);
    font-family: var(--font-serif);
    opacity: 0.8;
}

@keyframes blink {
    0%,
    100% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
}

@keyframes shake {
    10%,
    90% {
        transform: translate3d(-1px, 0, 0);
    }
    20%,
    80% {
        transform: translate3d(2px, 0, 0);
    }
    30%,
    50%,
    70% {
        transform: translate3d(-4px, 0, 0);
    }
    40%,
    60% {
        transform: translate3d(4px, 0, 0);
    }
}
</style>
