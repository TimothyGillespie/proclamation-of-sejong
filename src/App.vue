<script setup lang="ts">
import CurrencyList from './components/CurrencyList.vue';
import FarmTile from './components/FarmTile.vue';
import LoadingBar from './components/LoadingBar.vue';
import ToastDisplay from './components/ToastDisplay.vue';
import TypingChallenge from './components/TypingChallenge.vue';
import Upgrades from './components/Upgrades.vue';
import { useGameStore } from './store/game.store';

const gameStore = useGameStore();
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
                <div v-if="gameStore.challenge != null">
                    <TypingChallenge
                        :translation="
                            gameStore.challenge.currentChallenge.translation
                        "
                        :task="gameStore.challenge.currentChallenge.task"
                    />
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
    min-width: 450px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.middle-section {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.right-section {
    min-width: 450px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.farm-plot {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.3rem;
}
</style>
