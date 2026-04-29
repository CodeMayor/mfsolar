'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import useStore from '@/store/useStore'
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus, Moon, Sun } from 'lucide-react'

export default function CartPage(): React.ReactElement {
  const router = useRouter()
  const { cartItems, removeFromCart, clearCart, addToCart } = useStore()
  const [isDark, setIsDark] = useState<boolean>(true)

  // Sync with localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const v = localStorage.getItem('mf-solar-dark-mode')
      if (v !== null) {
        setIsDark(v === 'true')
      }
    } catch {
      // Keep default
    }
  }, [])

  // Apply theme
  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [isDark])

  const calculateTotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const handleCheckout = () => {
    alert('Thank you — your order has been placed.')
    clearCart()
    router.push('/')
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      const item = cartItems.find((i) => i.id === productId)
      if (item) {
        const diff = newQuantity - item.quantity
        if (diff > 0) {
          // Add more
          for (let i = 0; i < diff; i++) {
            addToCart(item)
          }
        } else {
          // Remove some (not implemented in store, so we'll just remove and re-add)
          removeFromCart(productId)
          for (let i = 0; i < newQuantity; i++) {
            addToCart(item)
          }
        }
      }
    }
  }

  return (
    <div className={`min-h-screen font-sans ${isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <header
        className={`${isDark ? 'bg-gray-950 text-white border-gray-800' : 'bg-white text-gray-900 border-gray-200'} sticky top-0 z-50 border-b backdrop-blur-md`}
      >
        <nav className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.push('/')}
              className="focus:outline-none flex items-center space-x-2"
            >
              <span className="text-3xl">☀️</span>
              <span className="text-2xl font-heading font-bold tracking-tight">Solar Store</span>
            </button>
          </div>

          {/* Right side - Theme toggle only */}
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsDark(!isDark)} className="px-3 py-1 rounded-md border border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800">
              {isDark ? <Moon /> : <Sun />}
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className={`flex items-center space-x-2 mb-6 px-4 py-2 rounded-md transition-colors ${isDark ? 'text-white hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-100'}`}
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-semibold">Back to Home</span>
        </button>

        <h1 className={`text-3xl md:text-4xl font-heading font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className={`${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-700'} text-center p-8 border rounded-xl`}>
            <ShoppingCart size={64} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-4">Your cart is empty. Start shopping now!</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 text-lg font-semibold text-gray-900 bg-yellow-400 rounded-md shadow-lg hover:bg-yellow-500"
            >
              Go to Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-yellow-50 border-gray-300 text-gray-900 shadow-md'} flex items-center space-x-4 p-4 rounded-xl border`}
                >
                  <div className="w-24 h-24 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="object-contain rounded-md w-full h-full"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-heading font-semibold mb-1">{item.name}</h3>
                    <p className={`text-lg font-bold mb-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      ₦{item.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className={`${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} w-8 h-8 rounded-md flex items-center justify-center transition-colors`}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className={`${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} w-8 h-8 rounded-md flex items-center justify-center transition-colors`}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-400 p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-yellow-50 border-gray-300 shadow-md'} p-6 rounded-xl border sticky top-24`}>
                <h2 className="text-2xl font-heading font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Items ({cartItems.length})</span>
                    <span className="font-semibold">
                      ₦{calculateTotal().toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Shipping</span>
                    <span className="font-semibold text-green-500">Free</span>
                  </div>
                  <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-300'} pt-3 mt-3`}>
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className={isDark ? 'text-green-400' : 'text-green-600'}>
                        ₦{calculateTotal().toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-emerald-600 text-white rounded-md shadow-lg hover:bg-emerald-700 font-semibold text-lg mb-3"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={clearCart}
                  className={`w-full py-2 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} rounded-md font-semibold transition-colors`}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className={`${isDark ? 'bg-gray-900 text-gray-300 border-gray-800' : 'bg-white text-gray-700 border-gray-200'} border-t py-8 px-4 md:px-8 mt-16`}
      >
        <div className="container mx-auto text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Solar Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
