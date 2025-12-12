<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import CurrencyList from './components/CurrencyList.vue';
import FarmTile from './components/FarmTile.vue';
import GameEventPopup from './components/GameEventPopup.vue';
import Angbuilgu from './components/Angbuilgu.vue';
import ToastDisplay from './components/ToastDisplay.vue';
import TypingChallenge from './components/TypingChallenge.vue';
import Upgrades from './components/Upgrades.vue';
import SettingsModal from './components/SettingsModal.vue';
import { useGameStore } from './store/game.store';

const gameStore = useGameStore();
const showSettings = ref(false);
let {
    farm,
    currentChallenge,
    currentGameEvent,
    timeTicks,
    currency,
} = storeToRefs(gameStore);
</script>

<template>
    <div class="app-container">
        <!-- Main Game Area (The Scroll/Paper on the desk) -->
        <div class="game-board">
            <div class="dancheong-border-top"></div>
            <header class="game-header">
                <h1>
                    <span class="dancheong-decorative-circle"></span>
                    Proclamation of Sejong
                    <span class="dancheong-decorative-circle"></span>
                </h1>
                <div class="header-controls">
                    <span class="date-display">Year 1444</span>
                    <button 
                        class="btn settings-btn" 
                        @click="showSettings = true" 
                        aria-label="Settings"
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.42 2.78C19.89 4.25 19.89 6.64 18.42 8.11L13.11 13.42C12.44 14.09 11.64 14.6 10.74 14.89L7 16L8.11 12.26C8.4 11.36 8.91 10.56 9.58 9.89L14.89 4.58C16.36 3.11 18.75 3.11 20.22 4.58" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M13.5 9.5L14.5 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M4 20L7 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 22L4 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M14 4L18 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
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
        </div>
    </div>

    <ToastDisplay />
    <GameEventPopup :event="currentGameEvent" />
    <SettingsModal v-if="showSettings" @close="showSettings = false" />

    <!-- Floating Angbuilgu in bottom right -->
    <div class="clock-overlay">
        <Angbuilgu :progress="(timeTicks % 1000) / 1000" />
    </div>

    <!-- Version Stamp -->
    <div class="version-stamp">
        v0.0.4
    </div>
</template>

<style scoped lang="scss">
.version-stamp {
    position: fixed;
    bottom: 10px;
    left: 10px;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--ink-secondary);
    opacity: 0.5;
    pointer-events: none;
    z-index: 1000;
    border: 1px solid var(--ink-secondary);
    padding: 2px 5px;
    transform: rotate(2deg);
}

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
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .header-controls {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
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
        background-color: var(--bg-paper);
    }

    .settings-btn {
        background: transparent;
        border: 2px solid var(--ink-primary);
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--ink-primary);
        transition: all 0.2s ease;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px; /* Slight rounding for paper feel, not circle */
        box-shadow: 2px 2px 0 var(--ink-secondary);

        &:hover {
            transform: translate(1px, 1px);
            box-shadow: 1px 1px 0 var(--ink-secondary);
            background-color: var(--bg-wood-light);
            color: var(--bg-paper);
        }

        &:active {
            transform: translate(2px, 2px);
            box-shadow: none;
        }
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
    display: none;
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
