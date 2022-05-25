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
            /* istanbul ignore next */
            if (!product.quantity) {
              product.quantity = 1;
            }
            state.products.push(product);
            state.open = true;
          }
        });
      },
      clearProducts: () =>
        setState(({ state }) => {
          state.products = [];
        }),
      reset: () => {
        setState((store) => {
          store.state = initialState;
        });
      },
      removeProduct: (product) => {
        setState(({ state }) => {
          const exists = !!state.products.find(({ id }) => id === product.id);

          if (exists) {
            state.products = state.products.filter(({ id }) => id !== product.id);
          }
        });
      },
      increase: (product) => {
        setState(({ state }) => {
          const localProduct = state.products.find(({ id }) => id === product.id);

          if (localProduct) {
            localProduct.quantity++;
          }
        });
      },
      decrease: (product) => {
        setState(({ state }) => {
          const localProduct = state.products.find(({ id }) => id === product.id);

          if (localProduct && localProduct.quantity > 0) {
            localProduct.quantity--;
          }
        });
      },
    },
  };
});
