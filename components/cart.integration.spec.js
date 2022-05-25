import { renderHook, act as hooksAct } from '@testing-library/react-hooks';
import { fireEvent, render, screen } from '@testing-library/react';
import { useCartStore } from '../store/cart';
import { makeServer } from '../miragejs/server';
import { setAutoFreeze } from 'immer';
import TestRenderer from 'react-test-renderer';
import Cart from './Cart';

const { act: componentsAct } = TestRenderer;

setAutoFreeze(false);

describe('Cart', () => {
  let server;
  let result;
  let spy;
  let addProduct;
  let toggle;
  let reset;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
    result = renderHook(() => useCartStore()).result;
    toggle = result.current.actions.toggle;
    addProduct = result.current.actions.addProduct;
    reset = result.current.actions.reset;
    spy = jest.spyOn(result.current.actions, 'toggle');
  });

  afterEach(() => {
    server.shutdown();
    jest.clearAllMocks();
  });

  it('should render the component', () => {
    render(<Cart />);

    expect(screen.getByTestId('cart')).toBeInTheDocument();
  });

  it('should add css class "hidden" in the component', () => {
    render(<Cart />);

    expect(screen.getByTestId('cart')).toHaveClass('hidden');
  });

  it('should remove css class "hidden" when cart is opened', async () => {
    await componentsAct(async () => {
      render(<Cart />);

      await fireEvent.click(screen.getByTestId('close-button'));

      expect(screen.getByTestId('cart')).not.toHaveClass('hidden');
    });
  });

  it('should close cart when close button is clicked', async () => {
    hooksAct(() => {
      reset(); // reset state
      toggle(); // open cart
    });

    await componentsAct(async () => {
      render(<Cart />);

      const button = screen.getByTestId('close-button');

      await fireEvent.click(button); // close cart

      expect(spy).toHaveBeenCalledTimes(2);
      expect(screen.getByTestId('cart')).toHaveClass('hidden');
    });
  });

  it('should display 5 product cards', () => {
    const products = server.createList('product', 5);

    for (const product of products) {
      hooksAct(() => addProduct(product));
    }

    render(<Cart />);

    expect(screen.getByTestId('cart')).not.toHaveClass('hidden');
    expect(screen.getAllByTestId('cart-item')).toHaveLength(5);
  });

  it('should display "Cart is empty" message is there is no product at cart', () => {
    hooksAct(() => {
      reset();
      toggle();
    });

    render(<Cart />);

    expect(screen.getByTestId('cart')).not.toHaveClass('hidden');
    expect(screen.getByText(/Cart is empty$/i)).toBeInTheDocument();
  });
});
