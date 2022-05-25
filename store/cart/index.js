import create from 'zustand';
import produce from 'immer';

const initialState = {
  open: false,
  products: [],
};

export const useCartStore = create((set) => {
  const setState = (fn) => set(produce(fn));

  return {
    state: {
      ...initialState,
    },
    actions: {
      toggle: () => {
        setState(({ state }) => {
          state.open = !state.open;
        });
      },
      addProduct: (product) => {
        setState(({ state }) => {
          const doesntExist = !state.products.find(({ id }) => id === product.id);

          if (doesntExist) {
            if (!product.quantity) {
              product.quantity = 1;
            }
            state.products.push(product);
            state.open = true;
          }
        });
      },
      clearProducts: () =>
        set((store) => ({
          state: {
            ...store.state,
            products: [],
          },
        })),
      reset: () => {
        setState((store) => {
          store.state = initialState;
        });
      },
    },
  };
});
