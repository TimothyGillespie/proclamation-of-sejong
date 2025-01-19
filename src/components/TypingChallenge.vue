<script setup lang="ts">
import { ref, watch } from 'vue';
import { InputStore, blockToString } from '../keyboard/input-store';
import { keyboardService } from '../keyboard/typing.service';
import { useGameStore } from '../store/game.store';
import type { EvaluatedHangulBlock } from '../types/challenge.types';
import type { Challenge } from '../types/game-state.types';
import type { TypeEvent } from '../types/event.types';

const inputStore = new InputStore();
const evalutedBlocks = ref<EvaluatedHangulBlock[]>([]);
const cursorLocation = ref(-1);
const gameStore = useGameStore();

const props = defineProps<Challenge>();

keyboardService.subscribe((typeEvent: TypeEvent) => {
    inputStore.input(typeEvent);
    evalutedBlocks.value = inputStore.getEvaluatedBlocks(props.task);

    const lastBlock = evalutedBlocks.value[evalutedBlocks.value.length - 1];
    if (lastBlock && lastBlock.completed) {
        cursorLocation.value = -1;
    } else {
        cursorLocation.value = evalutedBlocks.value.length - 1;
    }

    if (
        evalutedBlocks.value.length === props.task.length &&
        evalutedBlocks.value.every((block) => block.state === 'correct')
    ) {
        gameStore.completeChallenge();
    }
});

watch(
    () => props.task,
    () => {
        inputStore.reset();
        evalutedBlocks.value = [];
    }
);
</script>

<template>
    <div class="text-container">
        <div class="translation" v-if="props.translation">
            {{ props.translation }}
        </div>
        <div class="task correct">{{ props.task }}</div>
        <div class="user-input">
            <span
                v-for="(block, index) in evalutedBlocks"
                :key="index"
                :class="{
                    correct: block.state === 'correct',
                    wrong: block.state === 'incorrect' && block.completed,
                    pending: block.state === 'incorrect' && !block.completed,
                    cursor: cursorLocation === index,
                }"
            >
                {{ blockToString(block) }}
            </span>
            <span v-if="cursorLocation === -1" class="cursor"></span>
        </div>
    </div>
</template>

<style lang="scss">
.text-container {
    $targetBlue: #007bff;
    $correctGreen: #28a745;
    $wrongRed: #dc3545;

    font-family: monospace, monospace;
    background: #f8f9fa;
    padding-bottom: 13px;

    .translation {
        font-size: 1.3em;
        color: #777;
    }

    .task {
        font-size: 2em;
        color: $targetBlue;
    }

    .user-input {
        span {
            font-size: 2em;
        }

        .correct {
            color: $correctGreen;
        }

        .wrong {
            color: $wrongRed;
        }

        .pending {
            color: #000;
        }
    }

    // defining blink animaton as a border bottom
    @keyframes blink {
        0%,
        100% {
            border-bottom: 2px solid transparent;
        }
        50% {
            border-bottom: 2px solid $targetBlue; /* Replace with your desired color */
        }
    }

    .cursor {
        position: relative;
        width: 1.8rem;
        display: inline-block;
    }

    .cursor::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 0;
        right: 0;
        height: 2px;
        margin-left: 1px;
        margin-right: 1px;
        background-color: transparent;
        animation: blink 1s infinite;
    }
}
</style>
