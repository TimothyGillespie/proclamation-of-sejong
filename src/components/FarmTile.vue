<script setup lang="ts">
import { useGameStore } from '../store/game.store';
import { useToastStore } from '../store/toast.store';
import { computed, ref } from 'vue';

const props = defineProps<{
    fieldId: number;
}>();

const gameStore = useGameStore();
const toastStore = useToastStore();
const farm = computed(() => gameStore.getFieldById(props.fieldId));

const isShaking = ref(false);

// Calculate potential yield for feedback
const potentialYield = computed(() => {
    return gameStore.currencyModifiers.rice.base * gameStore.currencyModifiers.rice.multiplier;
});

const triggerShake = () => {
    isShaking.value = true;
    setTimeout(() => {
        isShaking.value = false;
    }, 400); // Duration matches CSS animation
};

const onClick = () => {
    switch (farm.value.state) {
        case 'barren':
            gameStore.plantField(props.fieldId);
            break;
        case 'ripe':
            gameStore.harvestField(props.fieldId);
            break;
        case 'planted':
        case 'growing':
            triggerShake();
            toastStore.addToast(
                {
                    message: 'Be patient, it needs time to grow.',
                    type: 'info',
                },
                1000
            );
            break;
    }
};
</script>

<template>
    <button 
        class="farm-tile" 
        :class="[farm.state, { 'shake-animation': isShaking }]"
        @click="onClick"
        :aria-label="`Farm field ${fieldId}, ${farm.state === 'barren' ? 'click to plant' : farm.state === 'ripe' ? 'click to harvest' : 'growing'}`"
        type="button"
    >
        <div class="content">
            <span v-if="farm.state === 'planted'" aria-hidden="true">🌱</span>
            <span v-else-if="farm.state === 'growing'" aria-hidden="true">🌿</span>
            <span v-else-if="farm.state === 'ripe'" aria-hidden="true">🌾</span>
        </div>
        
        <!-- Hover Overlay for Feedback -->
        <div class="tile-overlay" aria-hidden="true">
            <div v-if="farm.state === 'barren'" class="overlay-content">
                <span class="action-label">Plant</span>
            </div>
            
            <div v-else-if="farm.state === 'ripe'" class="overlay-content">
                <span class="action-label harvest-label">Harvest</span>
                <span class="yield-label">+{{ potentialYield }}</span>
            </div>
            
            <div v-else class="overlay-content">
                <span class="wait-label">Growing...</span>
            </div>
        </div>
    </button>
</template>

<style scoped lang="scss">
.farm-tile {
    width: 100%;
    aspect-ratio: 1;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.8rem;
    position: relative;
    border: 1px solid rgba(0,0,0,0.1);
    box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
    overflow: hidden;
    background: none;
    padding: 0;

    &:hover {
        transform: scale(0.98);
        box-shadow: inset 0 0 15px rgba(0,0,0,0.2);
        
        .tile-overlay {
            opacity: 1;
        }
    }
}

.shake-animation {
    animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

.tile-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7); /* Darker background for readability */
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
    padding: 2px;
}

.overlay-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.action-label {
    color: white;
    font-size: 0.8rem; /* Slightly smaller base size */
    font-family: var(--font-serif);
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    white-space: nowrap; /* Prevent wrapping issues */
    transform: scale(0.9); /* Slight scale down to fit */
}

.harvest-label {
    color: var(--color-rice); /* Gold text */
    font-size: 0.75rem;
}

.yield-label {
    color: white;
    font-size: 1rem;
    font-weight: bold;
    font-family: var(--font-mono);
    line-height: 1.2;
}

.wait-label {
    color: #ccc;
    font-style: italic;
    font-size: 0.85rem;
    font-family: var(--font-serif);
}

/* Earthy Tones for Soil States */

.ripe {
    background-color: #fdd835;
    background-image: repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.2) 5px, rgba(255,255,255,0.2) 10px);
}

.growing {
    background-color: #8bc34a;
}

.planted {
    background-color: #5d4037;
    color: #a1887f;
}

.barren {
    background-color: #3e2723;
    opacity: 0.8;
    
    &:hover {
        background-color: #4e342e;
    }
}
</style>
