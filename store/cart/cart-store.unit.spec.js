import { useCartStore } from './index';
import { renderHook, act } from '@testing-library/react-hooks';
import { makeServer } from '../../miragejs/server';

describe('Cart Store', () => {
  let server;
  let result;
  let toggle;
  let addProduct;
  let clearProducts;
  let removeProduct;
  let increase;
  let decrease;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
    result = renderHook(() => useCartStore()).result;
    toggle = result.current.actions.toggle;
    addProduct = result.current.actions.addProduct;
    clearProducts = result.current.actions.clearProducts;
    removeProduct = result.current.actions.removeProduct;
    increase = result.current.actions.increase;
    decrease = result.current.actions.decrease;
  });

  afterEach(() => {
    server.shutdown();

    act(() => result.current.actions.reset());
  });

  it('should return open equals false on initial state', () => {
    expect(result.current.state.open).toBe(false);
  });

  it('should return open equals true when toggle is called', async () => {
    expect(result.current.state.open).toBe(false);

    act(() => toggle());
    expect(result.current.state.open).toBe(true);

    act(() => toggle());
    expect(result.current.state.open).toBe(false);
  });

  it('should return an empty array for products on initial state', () => {
    expect(Array.isArray(result.current.state.products)).toBe(true);
    expect(result.current.state.products).toHaveLength(0);
  });

  it('should add product and grant that the product is properly added', () => {
    const product = server.create('product');

    expect(result.current.state.products).toHaveLength(0);

    act(() => addProduct(product));

    expect(result.current.state.products).toHaveLength(1);
    expect(result.current.state.products[0]).toEqual(product);
  });

  it('should add 5 products to the list and open the cart', () => {
    const products = server.createList('product', 5);

    expect(result.current.state.products).toHaveLength(0);

    for (const product of products) {
      act(() => addProduct(product));
    }

    expect(result.current.state.products).toHaveLength(5);
    expect(result.current.state.open).toBe(true);
  });

  it('should assign 1 as initial quantity on addProduct()', () => {
    const product = server.create('product');

    act(() => addProduct(product));

    expect(result.current.state.products).toHaveLength(1);
    expect(result.current.state.products[0].quantity).toBe(1);
  });

  it('should have 1 as quantity when addProduct() is called twice', () => {
    const product = server.create('product');

    act(() => {
      addProduct(product);
      addProduct(product);
    });

    expect(result.current.state.products).toHaveLength(1);
    expect(result.current.state.products[0].quantity).toBe(1);
  });

  it('should increase product quantity', () => {
    const product = server.create('product');

    act(() => {
      addProduct(product);
      increase(product);
    });

    expect(result.current.state.products[0].quantity).toBe(2);
  });

  it('should decrease product quantity', () => {
    const product = server.create('product');

    act(() => {
      addProduct(product);
      decrease(product);
    });

    expect(result.current.state.products[0].quantity).toBe(0);
  });

  it('should not decrease below zero', () => {
    const product = server.create('product');

    act(() => {
      addProduct(product);
      decrease(product);
      decrease(product);
      decrease(product);
    });

    expect(result.current.state.products[0].quantity).toBe(0);
  });

  it('should clear products', () => {
    const products = server.createList('product', 5);

    expect(result.current.state.products).toHaveLength(0);

    for (const product of products) {
      act(() => addProduct(product));
    }

    expect(result.current.state.products).toHaveLength(5);

    act(() => clearProducts());

    expect(result.current.state.products).toHaveLength(0);
  });

  it('should not add same product twice', () => {
    const product = server.create('product');

    expect(result.current.state.products).toHaveLength(0);

    act(() => addProduct(product));
    act(() => addProduct(product));

    expect(result.current.state.products).toHaveLength(1);
  });

  it('should remove a product from the store', () => {
    const [product1, product2] = server.createList('product', 2);

    act(() => {
      addProduct(product1);
      addProduct(product2);
    });

    expect(result.current.state.products).toHaveLength(2);

    act(() => removeProduct(product1));

    expect(result.current.state.products).toHaveLength(1);
    expect(result.current.state.products[0]).toEqual(product2);
  });

  it('should not change products in the cart if provided product is not in the array', () => {
    const [product1, product2, product3] = server.createList('product', 3);

    act(() => {
      addProduct(product1);
      addProduct(product2);
    });

    expect(result.current.state.products).toHaveLength(2);

    act(() => removeProduct(product3));

    expect(result.current.state.products).toHaveLength(2);
  });
});
