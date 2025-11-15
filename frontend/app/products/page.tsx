'use client';

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../components/AuthContext';
import { CartContext } from '../../components/CartContext';
import { apiFetch } from '../../lib/api';
import Link from 'next/link';

interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  category: string;
  updatedAt: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const auth = useContext(AuthContext);
  const cart = useContext(CartContext);

  useEffect(() => {
    async function fetchProducts() {
      const data = await apiFetch(
        `/products?page=${page}&limit=10&search=${search}&category=${category}`
      );
      setProducts(data.products);
      setTotal(data.total);
    }
    fetchProducts();
  }, [page, search, category]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);
  const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setCategory(e.target.value);
  const handlePageChange = (newPage: number) => setPage(newPage);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    price: 0,
    category: '',
  });

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct
      ? `/products/${editingProduct.id}`
      : '/products';

    await apiFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        price: parseFloat(formData.price.toString()),
      }),
    });

    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ sku: '', name: '', price: 0, category: '' });

    const data = await apiFetch(
      `/products?page=${page}&limit=10&search=${search}&category=${category}`
    );
    setProducts(data.products);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await apiFetch(`/products/${id}`, { method: 'DELETE' });
      const data = await apiFetch(
        `/products?page=${page}&limit=10&search=${search}&category=${category}`
      );

      setProducts(data.products);
      setTotal(data.total);
      
    }
  };

  const openModal = (product?: Product) => {
    setEditingProduct(product || null);
    setFormData(product || { sku: '', name: '', price: 0, category: '' });
    setIsModalOpen(true);
  };

  const categories = ['electronics', 'fashion', 'clothing brand', 'hardware'];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800"> Products</h1>

      {/* Search + Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleSearch}
          className="p-3 border rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <select
          value={category}
          onChange={handleCategory}
          className="p-3 border rounded-lg w-full sm:w-52"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {auth?.user?.role === 'admin' && (
          <button
            onClick={() => openModal()}
            className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
          >
            Add Product
          </button>
        )}

        {auth?.user?.role === 'customer' && cart?.cart.length > 0 && (
          <Link
            href="/cart"
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            🛒 Cart {cart.cart.reduce((sum, item) => sum + item.quantity, 0)}
          </Link>
        )}
      </div>

      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>

            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <input
                name="sku"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                placeholder="SKU"
                className="border rounded-lg p-3 w-full"
                required
              />

              <input
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Name"
                className="border rounded-lg p-3 w-full"
                required
              />

              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="Price"
                className="border rounded-lg p-3 w-full"
                required
              />

              <select
                name="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="border rounded-lg p-3 w-full"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow rounded-xl p-5 border border-gray-100 hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {product.name}
            </h2>

            <p className="text-gray-700">SKU: {product.sku}</p>
            <p className="text-gray-700">
              Price:{' '}
              <span className="text-green-600 font-semibold">
                ₹{product.price.toFixed(2)}
              </span>
            </p>
            <p className="text-gray-700 capitalize">Category: {product.category}</p>
            <p className="text-gray-500 text-sm mt-1">
              Updated: {new Date(product.updatedAt).toLocaleDateString()}
            </p>

            {auth?.user?.role === 'admin' ? (
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => openModal(product)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            ) : (
              auth?.user?.role === 'customer' && (
                <button
                  onClick={() =>
                    cart?.addToCart(product.id, product.name, product.price)
                  }
                  className="bg-green-600 text-white w-full py-2 rounded-lg mt-4 hover:bg-green-700 transition"
                >
                  Add to Cart
                </button>
              )
            )}
          </div>
        ))}
      </div>

    
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page * 10 >= total}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Next
        </button>

        <span className="text-gray-700 font-medium">
          Page {page} of {Math.ceil(total / 10)}
        </span>
      </div>
    </div>
  );
}
