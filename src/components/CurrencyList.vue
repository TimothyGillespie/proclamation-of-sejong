<script setup lang="ts">
import type { Currency } from '../types/game-state.types';

const props = defineProps<{
    currency: Partial<Currency>;
}>();
</script>

<template>
    <div class="currency-list">
        <div v-if="props.currency.rice != null" class="currency-entry">
            <span class="currency-value">{{ props.currency.rice }}</span>
            &nbsp;
            <span class="currency-name">Rice</span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.currency-name {
    font-weight: bold;
}

.currency-value {
    font-family: monospace;
}
</style>
