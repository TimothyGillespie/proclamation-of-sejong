<script setup lang="ts">
import CurrencyList from './components/CurrencyList.vue';
import FarmTile from './components/FarmTile.vue';
import GameEventPopup from './components/GameEventPopup.vue';
import LoadingBar from './components/LoadingBar.vue';
import ToastDisplay from './components/ToastDisplay.vue';
import TypingChallenge from './components/TypingChallenge.vue';
import Upgrades from './components/Upgrades.vue';
import { useGameStore } from './store/game.store';

let gameStore = useGameStore();

const resetGame = () => {
    // confirmation first via alert
    if (window.confirm('Are you sure you want to reset the game?')) {
        gameStore.$reset();
        window.location.href = window.location.href; // hard reload for a proper refresh of the farm tiles
    }
};
</script>

<template>
    <div class="container">
        <div class="main-screen">
            <div class="left-section">
                <div class="currency-list">
                    <CurrencyList :currency="gameStore.currency" />
                </div>
                <div class="farm-plot">
                    <FarmTile
                        v-for="singleFieldId in Object.keys(
                            gameStore.farm.fields
                        )"
                        :field-id="parseInt(singleFieldId, 10)"
                    />
                </div>
            </div>
            <div class="middle-section">
                <div>
                    <div v-if="gameStore.currentChallenge != null">
                        <TypingChallenge
                            v-if="gameStore.currentChallenge != null"
                            :challenge="gameStore.currentChallenge"
                        />
                    </div>
                </div>
                <div class="disclaimer">
                    <div>Version 0.0.2</div>
                    <div>More is yet to come</div>
                    <button class="btn danger" v-on:click="resetGame">
                        Reset Game
                    </button>
                    <button
                        class="btn success"
                        v-on:click="gameStore.tickSpeed = 100"
                        v-if="gameStore.tickSpeed === 1"
                    >
                        Increase Game Speed
                    </button>
                    <button
                        class="btn success"
                        v-on:click="gameStore.tickSpeed = 1"
                        v-if="gameStore.tickSpeed > 1"
                    >
                        Normalize Game Speed
                    </button>
                </div>
            </div>
            <div class="right-section">
                <Upgrades />
            </div>
        </div>

        <div class="bottom-section">
            <LoadingBar :progress="(gameStore.timeTicks % 1000) / 1000" />
        </div>
    </div>
    <ToastDisplay />
    <GameEventPopup :event="gameStore.currentGameEvent" />
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
}

.currency-list {
    margin: 0.6rem;
}

.main-screen {
    display: flex;
    justify-content: space-between;
    flex-grow: 1;
}

.bottom-section {
    height: 10px;
}

.left-section {
    width: 450px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.middle-section {
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    margin: 0.8rem 0;
}

.right-section {
    max-width: 450px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.farm-plot {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.3rem;
}

.disclaimer {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;

    div {
        font-size: 0.7rem;
    }
}

.btn.danger {
    background-color: #ff0000;
    font-size: 0.8rem;
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 0.3rem;
    border: none;
    cursor: pointer;
}

.btn.success {
    background-color: #00ff00;
    font-size: 0.8rem;
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 0.3rem;
    border: none;
    cursor: pointer;
}
</style>
