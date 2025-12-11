<script setup lang="ts">
import { useGameStore } from '../store/game.store';
import CurrencyList from './CurrencyList.vue';

const gameStore = useGameStore();
</script>

<template>
    <div class="upgrades-list">
        <div v-if="gameStore.availableUpgrades.length === 0" class="empty-upgrades">
            <p>You have learned all you can for now.</p>
        </div>
        
        <button 
            v-for="singleUpgrade in gameStore.availableUpgrades" 
            :key="singleUpgrade.id"
            class="upgrade-scroll"
            :class="{
                disabled: !gameStore.canPurchaseUpgrade(singleUpgrade.id),
                purchasable: gameStore.canPurchaseUpgrade(singleUpgrade.id)
            }"
            @click="gameStore.purchaseUpgrade(singleUpgrade.id)"
            :disabled="!gameStore.canPurchaseUpgrade(singleUpgrade.id)"
            :aria-label="`${singleUpgrade.name}: ${singleUpgrade.description}. ${gameStore.canPurchaseUpgrade(singleUpgrade.id) ? 'Click to purchase' : 'Cannot afford'}`"
            type="button"
        >
            <div class="scroll-content">
                <div class="upgrade-header">
                    <h4>{{ singleUpgrade.name }}</h4>
                </div>
                
                <p class="upgrade-desc">{{ singleUpgrade.description }}</p>
                
                <div class="upgrade-cost">
                    <span class="cost-label">Requirement:</span>
                    <CurrencyList
                        :currency="gameStore.getCurrentCostForUpgrade(singleUpgrade.id)!"
                    />
                </div>
            </div>
        </button>
    </div>
</template>

<style scoped lang="scss">
.upgrades-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.empty-upgrades {
    text-align: center;
    color: var(--ink-secondary);
    padding: var(--spacing-md);
    font-style: italic;
    font-family: var(--font-serif);
}

.upgrade-scroll {
    background-color: #fff8e1; /* Pale yellow paper */
    border: 1px solid #d7ccc8;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
    background: #fff8e1;
    padding: 0;
    text-align: left;
    width: 100%;
    
    /* Scroll ends effect */
    &::before, &::after {
        content: '';
        position: absolute;
        height: 100%;
        width: 8px;
        background: var(--bg-wood);
        top: 0;
        border-radius: 2px;
    }
    
    &::before { left: 0; }
    &::after { right: 0; }

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 4px 4px 8px rgba(0,0,0,0.15);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        filter: grayscale(0.8);
        background-color: #eee;
    }
    
    &.purchasable:not(:disabled) {
        border-bottom: 3px solid var(--color-nature);
    }
}

.scroll-content {
    padding: var(--spacing-md) var(--spacing-lg); /* Add padding for scroll ends */
}

.upgrade-header {
    margin-bottom: var(--spacing-sm);
    border-bottom: 1px dashed var(--ink-secondary);
    padding-bottom: 4px;
    
    h4 {
        font-size: 1.1rem;
        color: var(--ink-primary);
        font-weight: bold;
        font-family: var(--font-serif);
    }
}

.upgrade-desc {
    font-size: 0.9rem;
    color: var(--ink-secondary);
    margin-bottom: var(--spacing-md);
    line-height: 1.4;
    font-family: var(--font-serif);
}

.upgrade-cost {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: 0.85rem;
    
    .cost-label {
        color: var(--ink-primary);
        font-weight: bold;
        font-family: var(--font-serif);
    }
}
</style>
