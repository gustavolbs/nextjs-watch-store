import { render, screen, fireEvent } from '@testing-library/react';
import CartItem from './cart-item';

const product = {
  title: 'Beautiful watch',
  price: '22.00',
  image:
    'https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
};

const addToCart = jest.fn();

const renderCartItem = () => {
  render(<CartItem product={product} />);
};

describe('CartItem - unit', () => {
  it('should render the component', () => {
    renderCartItem();

    expect(screen.getByTestId('cart-item')).toBeInTheDocument();
  });

  it('should render proper content', () => {
    renderCartItem();

    const image = screen.getByTestId('image');

    expect(screen.getByText(new RegExp(product.title, 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(product.price, 'i'))).toBeInTheDocument();
    expect(image).toHaveAttribute('src', product.image);
    expect(image).toHaveAttribute('alt', product.title);
  });

  it('should display 1 as initial quantity', async () => {
    renderCartItem();

    expect(screen.getByTestId('quantity').textContent).toEqual('1');
  });

  it('should increase quantity by 1 when second button is clicked', async () => {
    renderCartItem();

    const [_, increaseButton] = screen.getAllByRole('button');
    const quantity = screen.getByTestId('quantity');

    expect(quantity.textContent).toEqual('1');

    await fireEvent.click(increaseButton);
    expect(quantity.textContent).toEqual('2');
  });

  it('should decrease quantity by 1 when second button is clicked', async () => {
    renderCartItem();

    const [decreaseButton] = screen.getAllByRole('button');
    const quantity = screen.getByTestId('quantity');

    expect(quantity.textContent).toEqual('1');

    await fireEvent.click(decreaseButton);
    expect(quantity.textContent).toEqual('0');
  });

  it('should not go below zero in the quantity', async () => {
    renderCartItem();

    const [decreaseButton] = screen.getAllByRole('button');
    const quantity = screen.getByTestId('quantity');

    expect(quantity.textContent).toEqual('1');

    await fireEvent.click(decreaseButton);
    expect(quantity.textContent).toEqual('0');
    await fireEvent.click(decreaseButton);
    expect(quantity.textContent).toEqual('0');
    await fireEvent.click(decreaseButton);
    expect(quantity.textContent).toEqual('0');
  });
});
