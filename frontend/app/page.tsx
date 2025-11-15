'use client';

import { useState, useEffect, useContext } from 'react';
import { CartContext } from '../components/CartContext';
import { AuthContext } from '../components/AuthContext';
import { apiFetch } from '../lib/api';
import Link from 'next/link';

interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  category: string;
  updatedAt: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const cart = useContext(CartContext);
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  async function fetchProducts() {
    setLoading(true);
    const data = await apiFetch('/products?page=1&limit=4');
    setProducts(data.products);
    setLoading(false);
  }
  fetchProducts();
  }, []);
  {loading && <p className="text-center">Loading...</p>}

  useEffect(() => {
  async function fetchProducts() {
    try {
      const data = await apiFetch('/products?page=1&limit=4');
      setProducts(data.products);
    } catch (err) {
      setError('Failed to load products');
    }
  }
  fetchProducts();
  }, []);
  {error && <p className="text-center text-red-500">{error}</p>}

  useEffect(() => {
    async function fetchProducts() {
      const data = await apiFetch('/products?page=1&limit=4'); // Fetch 4 products for the homepage
      setProducts(data.products);
    }
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Our E-Commerce Store</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg shadow-md hover:shadow-lg transition">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-600">SKU: {product.sku}</p>
            <p className="text-green-600 font-bold">₹{product.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Category: {product.category}</p>
            {auth?.user?.role === 'customer' && (
              <button
                onClick={() => cart?.addToCart(product.id, product.name, product.price)}
                className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Add to Cart
              </button>
            )}
            <Link href="/products" className="mt-2 block text-blue-500 hover:underline">
              View All Products
            </Link>
          </div>
        ))}
      </div>
      {products.length === 0 && <p className="text-center">No products available.</p>}
    </div>
  );
}