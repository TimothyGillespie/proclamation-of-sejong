<script setup lang="ts">
import type { Currency } from '../types/game-state.types';

const props = defineProps<{
    currency: Partial<Currency>;
}>();
</script>

<template>
    <div class="currency-list">
        <div v-if="props.currency.rice != null" class="currency-entry">
            <span class="currency-icon">🍚</span>
            <span class="currency-value">{{ Math.floor(props.currency.rice) }}</span>
            <span class="currency-unit">sacks</span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.currency-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
}

.currency-entry {
    display: flex;
    align-items: center;
    font-size: 1rem;
    color: var(--ink-primary);
    font-family: var(--font-serif);
    
    .currency-icon {
        margin-right: 0.3rem;
        font-size: 1.2rem;
    }

    .currency-value {
        font-family: var(--font-mono); /* Numbers look good in mono */
        font-weight: bold;
        margin-right: 0.3rem;
        font-size: 1.1rem;
    }

    .currency-unit {
        color: var(--ink-secondary);
        font-size: 0.9rem;
        font-style: italic;
    }
}
</style>
