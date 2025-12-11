import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStoreStore = create(
    persist(
        (set) => ({
            currentStore: null,
            stores: [],
            setCurrentStore: (store) => set({ currentStore: store }),
            setStores: (stores) => set({ stores }),
            addStore: (store) => set((state) => ({ stores: [...state.stores, store] })),
        }),
        {
            name: 'constructor-store',
        }
    )
);
