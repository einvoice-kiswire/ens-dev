import { create } from 'zustand';

const useStore = create((set) => ({
    getItem: (key) => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(key);
        }
        return null;
    },
    setItem: (key, value) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, value);
        }
        set((state) => ({ ...state, [key]: value }));
    },
    initializeItem: (key, defaultValue) => {
        if (typeof window !== 'undefined') {
            const storedItem = localStorage.getItem(key);
            if (storedItem) {
                set({ [key]: storedItem });
            } else {
                localStorage.setItem(key, defaultValue);
                set({ [key]: defaultValue });
            }
        }
    }
}));

export default useStore;
