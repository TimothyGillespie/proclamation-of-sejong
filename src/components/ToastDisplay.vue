<script setup lang="ts">
import { useToastStore } from '../store/toast.store';
const toastStore = useToastStore();
</script>

<template>
    <TransitionGroup
        name="toast"
        class="toast-container"
        tag="div"
    >
        <div
            v-for="singleToast of toastStore.$state.toasts"
            :key="singleToast.id"
            :class="singleToast.type"
            class="toast-message"
            @click="toastStore.removeToast(singleToast.id)"
        >
            {{ singleToast.message }}
        </div>
    </TransitionGroup>
</template>

<style scoped lang="scss">
.toast-container {
    position: fixed;
    top: 80px; /* Below the header (70px + padding) */
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 3000; /* Ensure it's above everything */
    pointer-events: none;
}

.toast-message {
    pointer-events: auto;
    padding: 0.8rem 1.2rem;
    border-radius: var(--border-radius);
    min-width: 250px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    cursor: pointer;
    font-size: 0.95rem;
    font-family: var(--font-serif);
    display: flex;
    align-items: center;
    border: 1px solid rgba(0,0,0,0.1);
    
    &.success {
        background-color: var(--color-nature);
        color: #fff;
        border-left: 5px solid #33691e;
    }
    
    &.error {
        background-color: var(--color-danger);
        color: #fff;
        border-left: 5px solid #7f0000;
    }
    
    &.info {
        background-color: var(--bg-wood-light);
        color: #fff;
        border-left: 5px solid var(--bg-wood);
    }
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>
