import { useCartStore } from './index';
import { renderHook, act } from '@testing-library/react-hooks';
import { makeServer } from '../../miragejs/server';

describe('Cart Store', () => {
  let server;
  let result;
  let toggle;
  let addProduct;
  let clearProducts;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
    result = renderHook(() => useCartStore()).result;
    toggle = result.current.actions.toggle;
    addProduct = result.current.actions.addProduct;
    clearProducts = result.current.actions.clearProducts;
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

  it('should add 5 products to the list', () => {
    const products = server.createList('product', 5);

    expect(result.current.state.products).toHaveLength(0);

    for (const product of products) {
      act(() => addProduct(product));
    }

    expect(result.current.state.products).toHaveLength(5);
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
});
