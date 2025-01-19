<script setup lang="ts">
import { useGameStore } from '../store/game.store';
import CurrencyList from './CurrencyList.vue';

const gameStore = useGameStore();
</script>

<template>
    <div class="upgrades">
        <div v-for="singleUpgrade in gameStore.availableUpgrades">
            <div
                :key="singleUpgrade.id"
                @click="gameStore.purchaseUpgrade(singleUpgrade.id)"
                class="upgrade-button"
                :class="{
                    disabled: !gameStore.canPurchaseUpgrade(singleUpgrade.id),
                }"
            >
                <h1>{{ singleUpgrade.name }}</h1>
                <p>{{ singleUpgrade.description }}</p>
                <CurrencyList
                    :currency="
                        gameStore.getCurrentCostForUpgrade(singleUpgrade.id)!
                    "
                />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.upgrades {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .upgrade-button {
        background-color: #0a192f;
        margin: 0.7rem;
        padding: 0.7rem;
        border-radius: 0.2rem;

        &.disabled {
            opacity: 0.5;
        }
    }
}
</style>
