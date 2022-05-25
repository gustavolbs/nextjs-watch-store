import { renderHook, act } from '@testing-library/react-hooks';
import { fireEvent, render, screen } from '@testing-library/react';
import { useCartStore } from '../store/cart';
import { makeServer } from '../miragejs/server';
import { setAutoFreeze } from 'immer';
import Cart from './Cart';

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

  it('should not have css class "hidden" when cart is opened', () => {
    act(() => toggle());

    render(<Cart />);

    expect(screen.getByTestId('cart')).not.toHaveClass('hidden');
  });

  it('should close cart when close button is clicked', async () => {
    act(() => {
      reset(); // reset state
      toggle(); // open cart
    });

    render(<Cart />);

    const button = screen.getByTestId('close-button');

    act(() => {
      fireEvent.click(button); // close cart
    });

    expect(spy).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId('cart')).toHaveClass('hidden');
  });

  it('should display 5 product cards', () => {
    const products = server.createList('product', 5);

    for (const product of products) {
      act(() => addProduct(product));
    }

    render(<Cart />);

    expect(screen.getByTestId('cart')).not.toHaveClass('hidden');
    expect(screen.getAllByTestId('cart-item')).toHaveLength(5);
  });
});
