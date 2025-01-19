import { defineStore } from 'pinia';

export type Toast = {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
};

export const useToastStore = defineStore('toast', {
    state: () => {
        return {
            toasts: [] as Toast[],
        };
    },
    actions: {
        addToast(toast: Omit<Toast, 'id'>, durationMs: number | null = null) {
            const id = Math.random().toString(36).slice(2);
            this.toasts.unshift({
                ...toast,
                id,
            });
            if (durationMs != null) {
                setTimeout(() => {
                    this.removeToast(id);
                }, durationMs);
            }
        },
        removeToast(id: string) {
            const index = this.toasts.findIndex((toast) => toast.id === id);
            if (index === -1) {
                return;
            }
            this.toasts.splice(index, 1);
        },
    },
});
