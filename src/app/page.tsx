// src/app/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import type { StoreState } from '@/store/useStore'
import useStore from '@/store/useStore'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import AdminPage from '@/components/AdminPage'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

type PageKey =
  | 'home'
  | 'products'
  | 'cart'
  | 'admin'
  | 'generators'
  | 'streetlights'
  | 'charge-controllers'

function StoreContent(): React.ReactElement {
  // Router
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Router-like local state
  const [currentPage, setCurrentPage] = useState<PageKey>('home')

  // UI state - initialize to true for SSR, then sync with localStorage on mount
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

  // Handle URL params for category navigation
  useEffect(() => {
    const category = searchParams.get('category')
    if (category) {
      const validCategories: StoreState['selectedCategory'][] = [
        'all', 'panels', 'batteries', 'inverters', 'generators', 'streetlights', 'charge-controllers'
      ]
      if (validCategories.includes(category as StoreState['selectedCategory'])) {
        setSelectedCategory(category as StoreState['selectedCategory'])
        setCurrentPage('products')
      }
    }
  }, [searchParams])

  // Zustand store (unchanged)
  const {
    products,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    selectedCategory,
    setSelectedCategory,
    fetchProducts
  } = useStore()

  // Fetch products on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  // Persist/apply theme
  useEffect(() => {
    try {
      localStorage.setItem('mf-solar-dark-mode', String(isDark))
    } catch {}
    if (isDark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [isDark])

  // Category groups
  const mainNavCats: StoreState['selectedCategory'][] = ['panels', 'batteries', 'inverters']
  const dropdownCats: StoreState['selectedCategory'][] = ['generators', 'streetlights', 'charge-controllers']
  const allCats: StoreState['selectedCategory'][] = ['all', ...mainNavCats, ...dropdownCats]

  // Helpers
  const calculateTotal = () =>
    cartItems.reduce((acc: number, it) => acc + it.price * it.quantity, 0).toFixed(2)
  const handleCheckout = () => {
    alert('Thank you — your order has been placed.')
    clearCart()
    setCurrentPage('home')
  }
  const goToAllProducts = () => {
    setSelectedCategory('all')
    setCurrentPage('products')
  }

  const filteredProducts = products.filter((p) =>
    selectedCategory === 'all' ? true : p.category === selectedCategory
  )

  /* Small helper used in various places to render special sections */
  function FeaturedComponentsPage(
    title: string,
    items: Array<{ id: number; name: string; price: string; imageUrl: string; description: string }>
  ) {
    return (
      <section className={`py-12 md:py-20 px-4 md:px-8 ${isDark ? 'bg-gray-950' : 'bg-gray-50'} min-h-screen`}>
        <div className="container mx-auto max-w-5xl">
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-3xl md:text-4xl font-bold text-center mb-8`}>
            {title}
          </h2>

          {/* grid: CENTER everything and center items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center justify-items-center">
            {items.map((p) => (
              <article
                key={p.id}
                className={`${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-yellow-50 border-gray-300 text-gray-900 shadow-lg'} p-4 rounded-xl shadow-xl border flex flex-col items-center text-center w-full max-w-sm`}
              >
                <div className="w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md mb-2" style={{ minHeight: 180, maxHeight: 180 }}>
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    width={340}
                    height={180}
                    className="object-contain rounded-md w-full h-full"
                  />
                </div>
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>{p.description}</p>
                <div className={`mt-4 text-lg font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{p.price}</div>
              </article>
            ))}
          </div>
        </div>
      </section>
    )
  }

  /* Page sections (kept inline for simplicity) */
  const HomePage = () => (
    <>
      {/* Hero */}
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center px-4 overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          aria-hidden="true"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(34,197,94,0.45), rgba(16,185,129,0.45))'
              : 'linear-gradient(135deg, rgba(253,224,71,0.35), rgba(249,115,22,0.35))'
          }}
        />
        <div className="max-w-4xl space-y-4 md:space-y-6 z-10">
          <h1 className={`${isDark ? 'text-white' : 'text-gray-900'} text-4xl sm:text-5xl md:text-6xl font-heading font-bold tracking-tight`}>
            Powering Your Future with Solar Solutions
          </h1>
          <p className={`${isDark ? 'text-white/90' : 'text-gray-800/90'} text-lg sm:text-xl md:text-2xl font-body`}>
            Discover premium solar panels, batteries, inverters and accessories for a more sustainable tomorrow.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={goToAllProducts}
              className="px-6 py-3 text-lg font-semibold rounded-md shadow-lg transition-colors bg-yellow-300 text-gray-900 hover:bg-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-300/50"
            >
              Explore Products
            </button>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className={`py-12 md:py-20 px-4 md:px-8 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="container mx-auto">
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-3xl md:text-4xl font-heading font-bold text-center mb-10`}>Featured Products</h2>

          {/* center grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center justify-items-center">
            {products.slice(0, 3).map((product) => (
              <article
                key={product.id}
                className={`${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-yellow-50 border-gray-300 text-gray-900 shadow-md'} p-5 rounded-xl shadow-xl border flex flex-col w-full max-w-sm cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300`}
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
                <p className={`text-sm font-body mb-4 line-clamp-2 flex-grow ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{product.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>₦{product.price.toFixed(2)}</div>
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
            ))}
          </div>
        </div>
      </section>
    </>
  )

  const ProductsPage = () => (
    <section className={`py-12 md:py-20 px-4 md:px-8 ${isDark ? 'bg-gray-950' : 'bg-gray-50'} min-h-screen`}>
      <div className="container mx-auto">
        <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-3xl md:text-4xl font-heading font-bold text-center mb-8`}>Our Products</h2>

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

        {/* Grid - centered even for a single item */}
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
                <p className={`text-sm font-body mb-4 line-clamp-2 flex-grow ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{product.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>₦{product.price.toFixed(2)}</div>
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
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} col-span-full text-center font-body`}>No products found in this category.</p>
          )}
        </div>
      </div>
    </section>
  )

  const CartPage = () => (
    <section className={`py-12 md:py-20 px-4 md:px-8 ${isDark ? 'bg-gray-950' : 'bg-gray-50'} min-h-screen`}>
      <div className="container mx-auto max-w-3xl">
        <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-3xl md:text-4xl font-heading font-bold text-center mb-8`}>Your Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <div className={`${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-700'} text-center p-8 border rounded-xl`}>
            <p className="text-lg">Your cart is empty. Start shopping now!</p>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setCurrentPage('products')
              }}
              className="mt-6 px-6 py-3 text-lg font-semibold text-gray-900 bg-yellow-300 rounded-md shadow-lg hover:bg-yellow-400"
            >
              Go to Products
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className={`${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-yellow-50 border-gray-300 text-gray-900 shadow-md'} flex items-center space-x-4 p-4 rounded-xl border shadow-md w-full`}
              >
                <div className="w-24 h-24 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md mb-2">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="object-contain rounded-md w-full h-full"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-heading font-semibold">{item.name}</h3>
                  <p className={`text-sm font-body ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Quantity: {item.quantity}</p>
                  <p className={`text-lg font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>₦{item.price.toFixed(2)}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400">
                  Remove
                </button>
              </div>
            ))}

            <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-yellow-50 border-gray-300 shadow-md'} flex flex-col md:flex-row justify-between items-center p-6 rounded-xl border mt-8`}>
              <span className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-bold`}>Total: ₦{calculateTotal()}</span>
              <button onClick={handleCheckout} className="px-8 py-3 bg-emerald-600 text-white rounded-md shadow-lg hover:bg-emerald-700">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )

  /* ---------- Render ---------- */
  return (
    <div className={`min-h-screen font-body ${isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      <Navbar 
        isDark={isDark} 
        setIsDark={setIsDark}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setSelectedCategory={setSelectedCategory}
        showCategoryNav={true}
      />

      {/* Main content */}
      <main>
        {(() => {
          switch (currentPage) {
            case 'home':
              return <HomePage />
            case 'products':
              return <ProductsPage />
            case 'cart':
              return <CartPage />
            case 'admin':
              // Wrap AdminPage so its main wrapper respects theme (helps if AdminPage uses plain backgrounds)
              return (
                <section className={`${isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'} py-12 md:py-20 px-4 md:px-8 min-h-screen`}>
                  <div className="container mx-auto">
                    {/* Ensure AdminPage content sits on the correct background */}
                    <div className={`${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-yellow-50 border-gray-300 text-gray-900'} p-6 rounded-xl shadow`}>
                      <AdminPage />
                    </div>
                  </div>
                </section>
              )
            case 'generators':
              return FeaturedComponentsPage('Solar Generators', [
                { id: 1, name: 'Portable Solar Generator', price: 'NGN 120,000', imageUrl: '/sg1.jpg', description: 'Portable solar generator for backup power.' },
                { id: 2, name: 'Home Backup Generator', price: 'NGN 220,000', imageUrl: '/sg2.jpg', description: 'Larger capacity solar generator.' },
                { id: 3, name: 'Camping Solar Generator', price: 'NGN 80,000', imageUrl: '/sg3.jpg', description: 'Compact solar generator for outdoor use.' },
                { id: 4, name: 'RV Solar Generator', price: 'NGN 150,000', imageUrl: '/sg4.jpg', description: 'Solar generator designed for RVs and travel.' },
                { id: 5, name: 'Emergency Solar Generator', price: 'NGN 100,000', imageUrl: '/sg5.jpg', description: 'Reliable solar generator for emergencies.' },
                { id: 6, name: 'High-Capacity Solar Generator', price: 'NGN 300,000', imageUrl: '/sg6.jpg', description: 'High-capacity solar generator for larger power needs.' }
              ])
            case 'streetlights':
              return FeaturedComponentsPage('Streetlights', [
                { id: 1, name: 'Solar Streetlight 60W', price: 'NGN 35,000', imageUrl: '/sl1.jpg', description: 'Solar-powered streetlight for outdoor lighting.' },
                { id: 2, name: 'LED Solar Streetlight 100W', price: 'NGN 50,000', imageUrl: '/sl2.jpg', description: 'Bright LED solar streetlight for enhanced visibility.' },
                { id: 3, name: 'Smart Solar Streetlight', price: 'NGN 75,000', imageUrl: '/sl3.jpg', description: 'Smart solar streetlight with motion sensor.' },
                { id: 4, name: 'Solar Streetlight with Remote Control', price: 'NGN 60,000', imageUrl: '/sl4.jpg', description: 'Solar streetlight with remote control functionality.' },
                { id: 5, name: 'High-Efficiency Solar Streetlight', price: 'NGN 80,000', imageUrl: '/sl5.jpg', description: 'High-efficiency solar streetlight for maximum brightness.' },
                { id: 6, name: 'Durable Solar Streetlight', price: 'NGN 55,000', imageUrl: '/sl6.jpg', description: 'Durable solar streetlight for long-lasting performance.' },
                { id: 7, name: 'Solar Streetlight with Battery Backup', price: 'NGN 90,000', imageUrl: '/sl7.jpg', description: 'Solar streetlight with built-in battery backup for cloudy days.' }
              ])
            case 'charge-controllers':
              return FeaturedComponentsPage('Charge Controllers', [
                { id: 1, name: 'Solar Charge Controller 60A', price: 'NGN 18,000', imageUrl: '/cc1.jpg', description: 'Efficient charge controller for solar systems.' },
                { id: 2, name: 'Solar Charge Controller 30A', price: 'NGN 12,000', imageUrl: '/cc2.jpg', description: 'Compact charge controller for small systems.' },
                { id: 3, name: 'MPPT Charge Controller', price: 'NGN 45,000', imageUrl: '/cc3.jpg', description: 'High-efficiency MPPT controller for best performance.' }
              ])
            default:
              return <HomePage />
          }
        })()}
      </main>

      <Footer 
        isDark={isDark}
        setCurrentPage={setCurrentPage}
        setSelectedCategory={setSelectedCategory}
      />
    </div>
  )
}

export default function Page() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading Store...</div>}>
      <StoreContent />
    </React.Suspense>
  )
}