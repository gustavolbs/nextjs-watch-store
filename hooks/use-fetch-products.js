import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetchProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      axios
        .get('/api/products')
        .then((res) => {
          if (mounted) {
            setProducts(res.data.products);
          }
        })
        .catch((err) => {
          /* istanbul ignore next */
          if (mounted) {
            setError(true);
          }
        });
    };
    fetchData();

    return () => (mounted = false);
  }, []);

  return { products, error };
};
