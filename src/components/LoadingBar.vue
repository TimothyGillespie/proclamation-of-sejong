<script setup lang="ts">
const props = defineProps<{
    progress: number;
}>();
</script>

<template>
    <div class="loading-bar">
        <div class="bar" :style="{ width: props.progress * 100 + '%' }"></div>
    </div>
</template>

<style scoped lang="scss">
.loading-bar {
    width: 100%;
    height: 100%;
    background-color: lightgray;
}

.bar {
    height: 100%;
    background-color: green;
}
</style>
