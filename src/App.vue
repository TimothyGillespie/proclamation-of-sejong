<script setup lang="ts">
import { storeToRefs } from 'pinia';
import CurrencyList from './components/CurrencyList.vue';
import FarmTile from './components/FarmTile.vue';
import GameEventPopup from './components/GameEventPopup.vue';
import LoadingBar from './components/LoadingBar.vue';
import ToastDisplay from './components/ToastDisplay.vue';
import TypingChallenge from './components/TypingChallenge.vue';
import Upgrades from './components/Upgrades.vue';
import { useGameStore } from './store/game.store';

const gameStore = useGameStore();
let {
    farm,
    currentChallenge,
    currentGameEvent,
    timeTicks,
    currency,
    tickSpeed,
} = storeToRefs(gameStore);

const resetGame = () => {
    if (window.confirm('Are you sure you want to reset the game?')) {
        gameStore.$reset();
    }
};
</script>

<template>
    <div class="app-container">
        <!-- Main Game Area (The Scroll/Paper on the desk) -->
        <div class="game-board">
            <header class="game-header">
                <h1>Proclamation of Sejong</h1>
                <div class="header-controls">
                    <span class="date-display">Year 1444</span>
                </div>
            </header>

            <div class="main-content">
                <!-- Left Panel: Farm Life -->
                <aside class="panel left-panel">
                    <div class="panel-section resources-section">
                        <h2>Inventory</h2>
                        <CurrencyList :currency="currency" />
                    </div>

                    <div class="panel-section farm-section">
                        <h2>Rice Paddy</h2>
                        <div class="farm-grid">
                            <FarmTile
                                v-for="singleFieldId in Object.keys(
                                    farm.fields
                                )"
                                :key="singleFieldId"
                                :field-id="parseInt(singleFieldId, 10)"
                            />
                        </div>
                    </div>

                    <div class="panel-section controls-section">
                        <h2>Settings</h2>
                        <div class="game-controls">
                            <button
                                class="btn ink-btn"
                                @click="resetGame"
                                title="Start Over"
                            >
                                Reset
                            </button>
                            <button
                                class="btn ink-btn"
                                @click="tickSpeed = 100"
                                v-if="tickSpeed === 1"
                                title="Speed up time"
                            >
                                Fast Forward
                            </button>
                            <button
                                class="btn ink-btn"
                                @click="gameStore.tickSpeed = 1"
                                v-if="gameStore.tickSpeed > 1"
                                title="Normal Speed"
                            >
                                Normal Speed
                            </button>
                        </div>
                        <div class="version-tag">v0.0.4</div>
                    </div>
                </aside>

                <!-- Middle Panel: The Scholar's Desk (Typing) -->
                <main class="panel center-panel">
                    <div class="writing-desk">
                        <TypingChallenge
                            v-if="currentChallenge != null"
                            :challenge="currentChallenge"
                        />
                        <div v-else class="empty-state">
                            <p>The ink stone is dry.</p>
                            <p class="sub-text">Wait for inspiration...</p>
                        </div>
                    </div>
                </main>

                <!-- Right Panel: Knowledge & Upgrades -->
                <aside class="panel right-panel">
                    <div class="panel-section upgrades-section">
                        <h2>Knowledge</h2>
                        <Upgrades />
                    </div>
                </aside>
            </div>

            <footer class="game-footer">
                <!-- Footer content can be placed here if needed, or removed if Sundial is moved -->
            </footer>
        </div>
    </div>

    <ToastDisplay />
    <GameEventPopup :event="currentGameEvent" />

    <!-- Floating Sundial in bottom right -->
    <div class="clock-overlay">
        <LoadingBar :progress="(timeTicks % 1000) / 1000" />
    </div>
</template>

<style scoped lang="scss">
.clock-overlay {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: auto;
    height: auto;
    z-index: 2000;
    pointer-events: none; /* Let clicks pass through */

    /* Ensure the component inside can receive events if needed */
    & > * {
        pointer-events: auto;
    }
}
.app-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: var(--spacing-md);
    background-color: var(--bg-wood);
}

.game-board {
    background-color: var(--bg-paper);
    width: 100%;
    max-width: 1400px;
    height: 90vh; /* Keeps it within view */
    display: flex;
    flex-direction: column;
    box-shadow:
        0 0 20px rgba(0, 0, 0, 0.5),
        inset 0 0 100px rgba(0, 0, 0, 0.05);
    border: 1px solid #d7ccc8;
    position: relative;
    overflow: hidden; /* Ensure content stays inside the "board" */

    /* Paper Texture effect */
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
        pointer-events: none;
        z-index: 0;
    }
}

.game-header {
    height: 70px;
    padding: 0 var(--spacing-lg);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid var(--ink-primary);
    z-index: 2; /* Increased Z-index to be above content */
    background-color: var(
        --bg-paper
    ); /* Opaque background to cover scrolling content */
    position: relative; /* Ensure z-index works */

    h1 {
        font-size: 2rem;
        color: var(--ink-primary);
        font-weight: bold;
        font-family: var(--font-serif);
        letter-spacing: -1px;
    }

    .date-display {
        font-family: var(--font-mono);
        font-size: 1.1rem;
        font-weight: bold;
        border: 2px solid var(--ink-accent);
        color: var(--ink-accent);
        padding: 0.3rem 0.8rem;
        border-radius: 8px; /* Seal shape */
        transform: rotate(-2deg);
    }
}

.main-content {
    flex: 1;
    display: grid;
    grid-template-columns: 280px 1fr 320px;
    gap: 0; /* No gap, using borders */
    overflow: hidden; /* Individual panels scroll, not this container */
    z-index: 1;
    position: relative;
}

.panel {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: var(--spacing-md);
    position: relative;

    &.left-panel {
        border-right: 1px solid var(--ink-secondary);
        background-color: rgba(0, 0, 0, 0.02);
    }

    &.right-panel {
        border-left: 1px solid var(--ink-secondary);
        background-color: rgba(0, 0, 0, 0.02);
    }
}

.panel-section {
    margin-bottom: var(--spacing-lg);

    h2 {
        font-size: 1.2rem;
        margin-bottom: var(--spacing-md);
        color: var(--ink-primary);
        border-bottom: 1px solid var(--ink-primary);
        padding-bottom: 0.2rem;
        font-family: var(--font-serif);
        text-transform: uppercase;
        letter-spacing: 0.1em;
    }
}

/* Farm Grid */
.farm-grid {
    display: grid;
    grid-template-columns: repeat(
        3,
        1fr
    ); /* Reduced from 4 to 3 for larger tiles */
    gap: 6px;
    background-color: var(--bg-wood-light);
    padding: 6px;
    border: 2px solid var(--bg-wood);
}

/* Center Panel specific */
.center-panel {
    display: flex;
    flex-direction: column;
    align-items: center; /* keep horizontal center */
    /* Remove justify-content: center so top content isn't pushed down/hidden if tall */
    overflow-y: auto; /* Enable vertical scrolling */
    background-color: var(--bg-paper);
    padding: var(--spacing-lg);
}

.writing-desk {
    width: 100%;
    max-width: 800px;
    /* Use min-height but allow growing */
    min-height: min-content;
    display: flex;
    justify-content: center;
    /* Ensure margins exist so it doesn't touch edges when scrolling */
    margin: auto 0;
}

.empty-state {
    text-align: center;
    color: var(--ink-secondary);
    margin: 4rem 0; /* Give it some breathing room when empty */

    p {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        font-family: var(--font-serif);
        font-style: italic;
    }

    .sub-text {
        font-size: 1rem;
        opacity: 0.7;
    }
}

.controls-section {
    margin-top: auto;
}

.game-controls {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
}

.version-tag {
    font-size: 0.7rem;
    color: var(--ink-secondary);
    text-align: right;
    font-family: var(--font-mono);
}

/* Footer */
.game-footer {
    height: 10px;
    background-color: var(--bg-wood);
    z-index: 2; /* Above content */
    position: relative;
    border-top: 1px solid var(--ink-secondary);
}

/* Buttons */
.btn {
    padding: 0.4rem 0.8rem;
    border: 1px solid var(--ink-primary);
    background: transparent;
    color: var(--ink-primary);
    font-family: var(--font-serif);
    font-weight: bold;

    &:hover {
        background-color: var(--ink-primary);
        color: var(--bg-paper);
    }

    &.ink-btn {
        border-width: 2px;
        box-shadow: 2px 2px 0 var(--ink-secondary);

        &:active {
            transform: translate(2px, 2px);
            box-shadow: none;
        }
    }
}

/* Responsive */
@media (max-width: 1024px) {
    .main-content {
        grid-template-columns: 240px 1fr 240px;
    }
}

@media (max-width: 768px) {
    .main-content {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto;
        overflow-y: auto;
    }

    .game-board {
        height: auto;
        min-height: 100vh;
    }
}
</style>
