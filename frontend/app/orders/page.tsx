'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import Link from 'next/link';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await apiFetch('/orders/my');
        setOrders(data.orders || []);
      } catch (e) {
        console.error("Order fetch failed:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-600">Loading orders...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
         Your Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-600 bg-blue-100 inline-block p-3 rounded-lg">
          You have no orders yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(o => (
            <div
              key={o.id}
              className="bg-white shadow rounded-xl p-5 border border-gray-100 hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Order #{o.id}
              </h2>

              <p className="text-gray-700">
                <span className="font-medium">Total:</span>{' '}
                <span className="text-green-600 font-semibold">
                  ₹{o.total.toFixed(2)}
                </span>
              </p>

              <p className="text-gray-600 mt-1">
                <span className="font-medium">Date:</span>{' '}
                {new Date(o.createdAt).toLocaleDateString()}
              </p>

            
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
