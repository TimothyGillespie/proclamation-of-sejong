<script setup lang="ts">
import { useToastStore } from '../store/toast.store';
const toastStore = useToastStore();
</script>

<template>
    <TransitionGroup
        name="toast"
        class="toast"
        tag="div"
        move-class="toast-move"
    >
        <div
            v-for="singleToast of toastStore.$state.toasts"
            :key="singleToast.id"
            :class="singleToast.type"
            class="toast-message"
            v-on:click="toastStore.removeToast(singleToast.id)"
        >
            {{ singleToast.message }}
        </div>
    </TransitionGroup>
</template>

<style scoped lang="scss">
.toast {
    position: fixed;
    top: 0;
    right: 0;
    padding: 1rem;
}

.toast-message {
    margin-top: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    width: 200px;
    color: white;
    position: relative;
}

.toast-message.success {
    background-color: green;
}

.toast-message.error {
    background-color: red;
}

.toast-message.info {
    background-color: blue;
}

.toast-enter-active,
.toast-leave-active,
.toast-move {
    transition: all 0.5s ease-in-out;
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateX(100%);
}

.toast-enter-to,
.toast-leave-from {
    opacity: 1;
    transform: translateX(0);
}

.toast-leave-active {
    position: absolute;
}
</style>
