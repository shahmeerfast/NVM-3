import { create } from "zustand";

export type Filters = {
  priceRange: [number, number];
  numberOfWines: [number, number];
  wineType: { red: boolean; white: boolean; sparkling: boolean; dessert: boolean };
  ava: string[];
  time: string;
  specialFeatures: string[];
};

export interface FilterState {
  filters: Filters;
  setFilters: (newFilters: Partial<FilterState["filters"]>) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  filters: {
    priceRange: [0, 1000],
    numberOfWines: [1, 10],
    wineType: { red: false, white: false, sparkling: false, dessert: false },
    ava: [],
    time: "",
    specialFeatures: [],
  },
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
}));
