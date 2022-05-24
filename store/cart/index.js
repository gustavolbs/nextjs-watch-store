import create from 'zustand';

const initialState = {
  open: false,
  products: [],
};

export const useCartStore = create((set) => ({
  state: {
    ...initialState,
  },
  actions: {
    toggle: () =>
      set((store) => ({
        state: {
          ...store.state,
          open: !store.state.open,
        },
      })),
    addProduct: (product) =>
      set((store) => ({
        state: {
          ...store.state,
          open: true,
          products: [...store.state.products, product],
        },
      })),
    clearProducts: () =>
      set((store) => ({
        state: {
          ...store.state,
          products: [],
        },
      })),
    reset: () =>
      set((store) => ({
        state: {
          ...initialState,
        },
      })),
  },
}));
