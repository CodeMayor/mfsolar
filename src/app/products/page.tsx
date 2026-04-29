'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import useStore from '@/store/useStore'
import type { StoreState } from '@/store/useStore'
import { ShoppingCart, Sun, Moon, Menu } from 'lucide-react'

export default function ProductsPage(): React.ReactElement {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category') as StoreState['selectedCategory'] | null

  const { products, addToCart, cartItems, fetchProducts, selectedCategory, setSelectedCategory } = useStore()
  const [isDark, setIsDark] = useState<boolean>(true)

  // Sync with localStorage on mount
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

  // Fetch products on mount
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Set category from URL parameter
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam, setSelectedCategory])

  const allCats: StoreState['selectedCategory'][] = [
    'all',
    'panels',
    'batteries',
    'inverters',
    'generators',
    'streetlights',
    'charge-controllers'
  ]

  const filteredProducts = products.filter((p) =>
    selectedCategory === 'all' ? true : p.category === selectedCategory
  )

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

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/cart')}
              className={`relative px-3 py-2 rounded-md transition-colors ${isDark ? 'hover:bg-yellow-400 hover:text-gray-900 text-white' : 'hover:bg-yellow-400 hover:text-gray-900 text-gray-900'}`}
            >
              <ShoppingCart />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-[10px] text-gray-900 font-bold">
                  {cartItems.length}
                </span>
              )}
            </button>

            <button onClick={() => setIsDark(!isDark)} className="px-3 py-1 rounded-md border border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800">
              {isDark ? <Moon /> : <Sun />}
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-8 py-8 md:py-12">
        <h1 className={`text-3xl md:text-4xl font-heading font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Our Products
        </h1>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {allCats.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-md transition-all font-medium capitalize ${
                selectedCategory === cat
                  ? 'bg-yellow-400 text-gray-900 shadow-md'
                  : isDark
                  ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-yellow-100'
              }`}
            >
              {cat.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center justify-items-center">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <article
                key={product.id}
                className={`${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-yellow-50 border-gray-300 text-gray-900 shadow-md'} p-5 rounded-xl shadow-lg border flex flex-col w-full max-w-sm cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300`}
                onClick={() => router.push(`/product/${product.id}`)}
              >
                <div className="w-full overflow-hidden rounded-lg mb-4 bg-gray-100 dark:bg-gray-800" style={{ height: 220 }}>
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={380}
                    height={220}
                    className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-lg font-heading font-bold mb-2 line-clamp-2">{product.name}</h3>
                <p className={`text-sm font-body mb-4 line-clamp-2 flex-grow ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    ₦{product.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <span className="text-xs px-2 py-1 bg-yellow-400 text-gray-900 rounded-md font-semibold">In Stock</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    addToCart(product)
                  }}
                  className="w-full py-2.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-semibold transition-colors"
                >
                  Add to Cart
                </button>
              </article>
            ))
          ) : (
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} col-span-full text-center font-body`}>
              No products found in this category.
            </p>
          )}
        </div>
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
