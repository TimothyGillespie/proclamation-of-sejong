<script setup lang="ts">
import { useGameStore } from '../store/game.store';
import { useToastStore } from '../store/toast.store';
const props = defineProps<{
    fieldId: number;
}>();

const gameStore = useGameStore();
const toastStore = useToastStore();
const farm = gameStore.getFieldById(props.fieldId);

const onClick = () => {
    switch (farm.state) {
        case 'barren':
            gameStore.plantField(props.fieldId);
            break;
        case 'ripe':
            gameStore.harvestField(props.fieldId);
            break;
        case 'planted':
        case 'growing':
            toastStore.addToast(
                {
                    message: 'Nothing to do here',
                    type: 'error',
                },
                2000
            );
            break;
    }
};
</script>

<template>
    <div class="farm-tile" :class="farm.state" v-on:click="onClick"></div>
</template>

<style scoped lang="scss">
.farm-tile {
    width: 100px;
    height: 100px;
    cursor: pointer;
}

.ripe {
    background-color: green;
}

.growing {
    background-color: lightgreen;
}

.planted {
    background-color: yellow;
}

.barren {
    background-color: brown;
}
</style>
