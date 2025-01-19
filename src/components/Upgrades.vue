<script setup lang="ts">
import { useGameStore } from '../store/game.store';
import { useUpgradeStore } from '../store/upgrade.store';
import CurrencyList from './CurrencyList.vue';

const gameStore = useGameStore();
const upgradeStore = useUpgradeStore();
</script>

<template>
    <div class="upgrades">
        <div v-for="singleUpgrade in upgradeStore.availableUpgrades">
            <div
                :key="singleUpgrade.id"
                @click="upgradeStore.purchaseUpgrade(singleUpgrade.id)"
            >
                <h1>{{ singleUpgrade.name }}</h1>
                <p>{{ singleUpgrade.description }}</p>
                <CurrencyList :currency="singleUpgrade.cost" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="sass"></style>
