'use client';

import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import Link from 'next/link';

export default function Header() {
  const auth = useContext(AuthContext);

  return (
    <header className="bg-purple-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">

        {/* Logo */}
        <h1 className="text-xl font-bold">
          <Link href="/products">E Commerce App Test</Link>
        </h1>

        {/* Navigation */}
        <nav>
          <ul className="flex items-center space-x-6">

            {auth?.user && (
              <>
                <li className="text-md font-medium">
                  Welcome, <b>{auth.user.name || 'User'}!</b>
                </li>

                <li>
                  <Link href="/products" className="hover:underline">
                    Products
                  </Link>
                </li>

               {/* NEW — Show Orders link for customers */}
                <li>
                  <Link href="/orders" className="hover:underline">
                    My Orders
                  </Link>
                </li>

                <li>
                  <button
                    onClick={() => auth?.logout()}
                    className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

            {!auth?.user && (
              <li className="flex space-x-3">
                <Link href="/login" className="hover:underline">
                  Login
                </Link>

                <Link href="/register" className="hover:underline">
                  Register
                </Link>
              </li>
            )}
          </ul>
        </nav>

      </div>
    </header>
  );
}
