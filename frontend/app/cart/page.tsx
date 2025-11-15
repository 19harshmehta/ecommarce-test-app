'use client';

import { useContext } from 'react';
import { CartContext } from '../../components/CartContext';
import { AuthContext } from '../../components/AuthContext';
import { apiFetch } from '../../lib/api';

export default function Cart() {
  const cart = useContext(CartContext);
  const auth = useContext(AuthContext);

  if (!auth?.user || auth.user.role !== 'customer') {
    return (
      <div className="container mx-auto p-6 text-center text-gray-700">
        <p className="text-lg font-medium bg-yellow-100 p-3 rounded-lg inline-block">
          Please log in as a customer to view your cart.
        </p>
      </div>
    );
  }

  if (!cart?.cart.length) {
    return (
      <div className="container mx-auto p-6 text-center text-gray-700">
        <p className="text-lg font-medium bg-blue-100 p-3 rounded-lg inline-block">
          Your cart is empty.
        </p>
      </div>
    );
  }

  const handleCheckout = async () => {
    try {
      const order = await apiFetch('/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      alert(`Order placed successfully! Order ID: ${order.id}`);
      cart.clearCart();
    } catch (error) {
      alert('Checkout failed: ' + (error.message || 'Please try again.'));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {cart.cart.map(item => (
            <div
              key={item.productId}
              className="p-4 bg-white shadow rounded-xl flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
                <p className="text-gray-600 mt-1">
                  Price: <span className="font-medium">₹{item.price.toFixed(2)}</span> ×{' '}
                  {item.quantity}
                </p>
                <p className="text-gray-800 font-semibold mt-1">
                  Total: ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>

              <div className="space-x-2 flex items-center">
                <button
                  onClick={() => cart.updateQuantity(item.productId, item.quantity - 1)}
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg text-lg"
                >
                  -
                </button>

                <input
                  type="number"
                  value={item.quantity}
                  onChange={e =>
                    cart.updateQuantity(item.productId, parseInt(e.target.value) || 1)
                  }
                  className="border p-2 w-16 rounded-xl text-center"
                  min="1"
                />

                <button
                  onClick={() => cart.updateQuantity(item.productId, item.quantity + 1)}
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg text-lg"
                >
                  +
                </button>

                <button
                  onClick={() => cart.removeFromCart(item.productId)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="p-6 bg-gray-50 shadow rounded-xl h-fit sticky top-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

          <div className="flex justify-between text-lg font-medium text-gray-700 mb-3">
            <span>Total:</span>
            <span>
              ₹
              {cart.cart
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-green-600 text-white p-3 rounded-lg text-lg hover:bg-green-700 transition"
            disabled={!cart.cart.length}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
