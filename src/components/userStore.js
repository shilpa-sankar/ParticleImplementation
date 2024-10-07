import { defineStore } from "pinia";

export const useUserStore = defineStore('userStore', {
    state: () => ({
        isPlaying: false, 
    }),
    actions: {
        togglePlayPause(val) {
            this.isPlaying = val;
        },
    },
});