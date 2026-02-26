import { useSyncExternalStore } from "react";

let now = Date.now();
let intervalId: ReturnType<typeof setInterval> | null = null;
let subscribersCount = 0;
const listeners = new Set<() => void>();

const emit = () => {
    now = Date.now();
    listeners.forEach((listener) => listener());
};

const startClock = () => {
    if (intervalId) return;
    intervalId = setInterval(emit, 1000);
};

const stopClock = () => {
    if (!intervalId) return;
    clearInterval(intervalId);
    intervalId = null;
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    subscribersCount += 1;

    if (subscribersCount === 1) {
        now = Date.now();
        startClock();
    }

    return () => {
        listeners.delete(listener);
        subscribersCount = Math.max(0, subscribersCount - 1);

        if (subscribersCount === 0) {
            stopClock();
        }
    };
};

const getSnapshot = () => now;

export const useGlobalClock = () => {
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};