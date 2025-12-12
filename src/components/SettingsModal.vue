<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useGameStore } from '../store/game.store';

defineEmits(['close']);

const gameStore = useGameStore();
let { tickSpeed, currency } = storeToRefs(gameStore);

const resetGame = () => {
    if (window.confirm('Are you sure you want to reset the game?')) {
        gameStore.$reset();
    }
};

const addRice = () => {
    currency.value.rice += 1000;
};
</script>

<template>
    <div class="modal-overlay" @click="$emit('close')">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h2>Royal Decrees</h2>
                <button
                    class="close-btn"
                    @click="$emit('close')"
                    aria-label="Close settings"
                >
                    ×
                </button>
            </div>

            <div class="modal-body">
                <div class="setting-group">
                    <h3>Testing Tools</h3>
                    <div class="control-row">
                        <button
                            class="btn ink-btn"
                            @click="tickSpeed = 100"
                            v-if="tickSpeed === 1"
                            aria-label="Speed up time"
                        >
                            Time Warp
                        </button>
                        <button
                            class="btn ink-btn"
                            @click="gameStore.tickSpeed = 1"
                            v-if="gameStore.tickSpeed > 1"
                            aria-label="Return to normal speed"
                        >
                            Normal Speed
                        </button>
                        <button
                            class="btn ink-btn"
                            @click="addRice"
                            aria-label="Add Rice"
                        >
                            Grant Rice
                        </button>
                        <button
                            class="btn ink-btn"
                            @click="gameStore.completeChallenge()"
                            v-if="gameStore.currentChallengeId != null"
                            aria-label="Complete current challenge"
                        >
                            Solve Challenge
                        </button>
                    </div>
                </div>

                <div class="setting-group danger-zone">
                    <h3>Danger Zone</h3>
                    <div class="control-row">
                        <button
                            class="btn ink-btn danger-btn"
                            @click="resetGame"
                            aria-label="Reset game and start over"
                        >
                            Reset Game
                        </button>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <div class="version-tag">v0.0.4</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3000;
    backdrop-filter: blur(2px);
    animation: fadeIn 0.3s ease;
}

.modal-content {
    background-color: var(--bg-paper);
    padding: var(--spacing-lg);
    border: 2px solid var(--ink-primary);
    box-shadow: 10px 10px 0 rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 500px;
    position: relative;
    background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
    animation: slideIn 0.3s ease;
    border-radius: 2px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
    border-bottom: 2px solid var(--ink-primary);
    padding-bottom: var(--spacing-sm);
}

.modal-header h2 {
    font-family: var(--font-serif);
    font-size: 1.5rem;
    color: var(--ink-primary);
    margin: 0;
    letter-spacing: -0.5px;
}

.close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    line-height: 1;
    color: var(--ink-primary);
    cursor: pointer;
    padding: 0 var(--spacing-sm);
    font-family: var(--font-mono);
}

.close-btn:hover {
    color: var(--ink-accent);
}

.setting-group {
    margin-bottom: var(--spacing-lg);
}

.setting-group h3 {
    font-family: var(--font-serif);
    font-size: 1.1rem;
    color: var(--ink-secondary);
    margin-bottom: var(--spacing-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px dashed var(--ink-secondary);
    display: inline-block;
}

.control-row {
    display: flex;
    gap: var(--spacing-md);
    flex-wrap: wrap;
}

.btn {
    padding: 0.6rem 1rem;
    border: 1px solid var(--ink-primary);
    background: var(--bg-paper);
    color: var(--ink-primary);
    font-family: var(--font-serif);
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 120px;
    position: relative;
    overflow: hidden;
}

/* Button style refinement: Calligraphy/Brush feel */
.btn.ink-btn {
    border-width: 2px;
    box-shadow: 4px 4px 0 var(--ink-secondary);
    border-radius: 2px;

    /* Brush stroke texture hint */
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='%23000' fill-opacity='0.03' filter='url(%23noise)'/%3E%3C/svg%3E");
        opacity: 0.5;
        pointer-events: none;
    }

    &:hover {
        transform: translate(-1px, -1px);
        box-shadow: 6px 6px 0 var(--ink-primary);
        background-color: var(--bg-paper-dark);
    }

    &:active {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 var(--ink-secondary);
    }
}

.danger-zone h3 {
    color: var(--color-danger);
    border-color: var(--color-danger);
}

.danger-btn {
    border-color: var(--color-danger);
    color: var(--color-danger);
    box-shadow: 4px 4px 0 #ef9a9a; /* lighter red shadow */
}

.danger-btn:hover {
    background-color: var(--bg-paper-dark);
    border-color: var(--color-danger);
    color: var(--color-danger);
    box-shadow: 6px 6px 0 #b71c1c; /* darker red shadow */
}

.modal-footer {
    margin-top: var(--spacing-lg);
    text-align: right;
    border-top: 1px solid var(--ink-secondary);
    padding-top: var(--spacing-sm);
}

.version-tag {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--ink-secondary);
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideIn {
    from {
        transform: translateY(-20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>
