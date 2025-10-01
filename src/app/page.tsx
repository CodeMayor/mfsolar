// src/app/page.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { StoreState } from '@/store/useStore'
import useStore from '@/store/useStore'
import Image from 'next/image'
import AdminPage from '@/components/AdminPage'
import { Menu, ShoppingCart, Sun, Moon } from 'lucide-react'

type PageKey =
  | 'home'
  | 'products'
  | 'cart'
  | 'admin'
  | 'generators'
  | 'streetlights'
  | 'charge-controllers'

export default function Page(): React.ReactElement {
  // Router-like local state
  const [currentPage, setCurrentPage] = useState<PageKey>('home')

  // UI state
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem('mf-solar-dark-mode')
      return v === null ? true : v === 'true'
    } catch {
      return true
    }
  })
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Zustand store (unchanged)
  const {
    products,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    selectedCategory,
    setSelectedCategory
  } = useStore()

  // Category groups
  const mainNavCats: StoreState['selectedCategory'][] = ['panels', 'batteries', 'inverters']
  const dropdownCats: StoreState['selectedCategory'][] = ['generators', 'streetlights', 'charge-controllers']
  const allCats: StoreState['selectedCategory'][] = ['all', ...mainNavCats, ...dropdownCats]

  // Persist/apply theme
  useEffect(() => {
    try {
      localStorage.setItem('mf-solar-dark-mode', String(isDark))
    } catch {}
    if (isDark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [isDark])

  // Close "More..." when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!moreRef.current) return
      if (!(e.target instanceof Node)) return
      if (!moreRef.current.contains(e.target)) setIsMoreOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

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
                className={`${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'} p-4 rounded-xl shadow-xl border flex flex-col items-center text-center w-full max-w-sm`}
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
                <p className="text-gray-400 mt-2">{p.description}</p>
                <div className="mt-4 text-lg font-bold text-green-400">{p.price}</div>
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
          <h1 className={`${isDark ? 'text-white' : 'text-gray-900'} text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight`}>
            Powering Your Future with Solar Solutions
          </h1>
          <p className={`${isDark ? 'text-white/90' : 'text-gray-800/90'} text-lg sm:text-xl md:text-2xl`}>
            Discover premium solar panels, batteries, inverters and accessories for a more sustainable tomorrow.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={goToAllProducts}
              className="px-6 py-3 text-lg font-semibold rounded-full shadow-lg transition-colors bg-yellow-300 text-gray-900 hover:bg-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-300/50"
            >
              Explore Products
            </button>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className={`py-12 md:py-20 px-4 md:px-8 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="container mx-auto">
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-3xl md:text-4xl font-bold text-center mb-10`}>Featured Products</h2>

          {/* center grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center justify-items-center">
            {products.slice(0, 3).map((product) => (
              <article
                key={product.id}
                className={`${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'} p-4 rounded-xl shadow-xl border flex flex-col items-center text-center w-full max-w-sm`}
              >
                <div className="w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md mb-2" style={{ minHeight: 210, maxHeight: 210 }}>
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={380}
                    height={210}
                    className="object-contain rounded-md w-full h-full"
                  />
                </div>
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-sm mt-2">{product.description}</p>
                <div className="mt-4 text-2xl font-bold text-green-400">${product.price.toFixed(2)}</div>
                <button onClick={() => addToCart(product)} className="mt-4 w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all">
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
        <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-3xl md:text-4xl font-bold text-center mb-8`}>Our Products</h2>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {allCats.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full transition-all font-medium capitalize ${
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
                className={`${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'} p-4 rounded-xl shadow-lg border flex flex-col items-center text-center w-full max-w-sm`}
              >
                <div className="w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md mb-2" style={{ minHeight: 210, maxHeight: 210 }}>
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={380}
                    height={210}
                    className="object-contain rounded-md w-full h-full"
                  />
                </div>
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-sm mt-2">{product.description}</p>
                <div className="mt-4 text-2xl font-bold text-green-400">${product.price.toFixed(2)}</div>
                <button onClick={() => addToCart(product)} className="mt-4 w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                  Add to Cart
                </button>
              </article>
            ))
          ) : (
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} col-span-full text-center`}>No products found in this category.</p>
          )}
        </div>
      </div>
    </section>
  )

  const CartPage = () => (
    <section className={`py-12 md:py-20 px-4 md:px-8 ${isDark ? 'bg-gray-950' : 'bg-gray-50'} min-h-screen`}>
      <div className="container mx-auto max-w-3xl">
        <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-3xl md:text-4xl font-bold text-center mb-8`}>Your Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <div className={`${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-700'} text-center p-8 border rounded-xl`}>
            <p className="text-lg">Your cart is empty. Start shopping now!</p>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setCurrentPage('products')
              }}
              className="mt-6 px-6 py-3 text-lg font-semibold text-gray-900 bg-yellow-300 rounded-full shadow-lg hover:bg-yellow-400"
            >
              Go to Products
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className={`${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'} flex items-center space-x-4 p-4 rounded-xl border shadow-md w-full`}
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
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm">Quantity: {item.quantity}</p>
                  <p className="text-lg font-bold text-green-400">${item.price.toFixed(2)}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400">
                  Remove
                </button>
              </div>
            ))}

            <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} flex flex-col md:flex-row justify-between items-center p-6 rounded-xl border mt-8`}>
              <span className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-bold`}>Total: ${calculateTotal()}</span>
              <button onClick={handleCheckout} className="px-8 py-3 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700">
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
    <div className={`min-h-screen font-sans ${isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      {/* Mobile menu slide-over */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className={`${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} absolute left-0 top-0 h-full w-72 p-6 shadow-2xl`}>
            <button className="absolute right-4 top-4 text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              {allCats.slice(1).map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat)
                      setCurrentPage('products')
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full text-left py-2 px-4 rounded-lg hover:bg-yellow-400 hover:text-gray-900 capitalize"
                  >
                    {cat.replace('-', ' ')}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-gray-700 pt-4">
              <button
                onClick={() => {
                  setCurrentPage('admin')
                  setIsMobileMenuOpen(false)
                }}
                className="w-full text-left py-2 px-4 rounded-lg hover:bg-yellow-400 hover:text-gray-900 text-red-400"
              >
                Admin
              </button>
              <button
                onClick={() => {
                  setCurrentPage('cart')
                  setIsMobileMenuOpen(false)
                }}
                className="w-full text-left py-2 px-4 rounded-lg hover:bg-yellow-400 hover:text-gray-900"
              >
                Cart ({cartItems.length})
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Header */}
      <header
        className={`${isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'} sticky top-0 z-50 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'} backdrop-blur-md`}
      >
        <nav className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setCurrentPage('home')
                setSelectedCategory('all')
              }}
              className="focus:outline-none"
            >
              <span className="text-3xl text-yellow-400">☀️</span>
            </button>
            <span
              className="text-2xl font-bold tracking-tight cursor-pointer"
              onClick={() => {
                setCurrentPage('home')
                setSelectedCategory('all')
              }}
            >
              Solar Store
            </span>
          </div>

          {/* Center nav (desktop) */}
          <div className="flex-grow hidden md:flex justify-center space-x-6">
            {mainNavCats.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat)
                  setCurrentPage('products')
                }}
                className={`px-4 py-2 rounded-full transition-colors ${isDark ? 'hover:bg-yellow-400 hover:text-gray-900 bg-transparent text-white' : 'hover:bg-yellow-400 hover:text-gray-900 bg-transparent text-gray-900'} capitalize`}
              >
                {cat}
              </button>
            ))}

            {/* More dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`px-4 py-2 rounded-full transition-colors ${isDark ? 'hover:bg-yellow-400 hover:text-gray-900 bg-transparent text-white' : 'hover:bg-yellow-400 hover:text-gray-900 bg-transparent text-gray-900'}`}
              >
                More...
              </button>
              {isMoreOpen && (
                <div className={`${isDark ? 'bg-gray-900 text-white border-gray-800' : 'bg-white text-gray-900 border-gray-200'} absolute left-0 mt-2 w-48 rounded-lg shadow-lg border z-50`}>
                  <ul>
                    {dropdownCats.map((cat) => (
                      <li key={cat}>
                        <button
                          onClick={() => {
                            setSelectedCategory(cat)
                            setCurrentPage('products')
                            setIsMoreOpen(false)
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-yellow-400 hover:text-gray-900 transition-colors capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}
                        >
                          {cat.replace('-', ' ')}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button onClick={() => setCurrentPage('admin')} className="px-4 py-2 rounded-full text-red-400">
              Admin
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentPage('cart')}
              className={`relative px-3 py-2 rounded-full transition-colors ${isDark ? 'hover:bg-yellow-400 hover:text-gray-900 text-white' : 'hover:bg-yellow-400 hover:text-gray-900 text-gray-900'}`}
            >
              <ShoppingCart />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-[10px] text-gray-900 font-bold">
                  {cartItems.length}
                </span>
              )}
            </button>

            <button onClick={() => setIsDark(!isDark)} className="px-3 py-1 rounded-full border border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800">
              {isDark ? <Moon /> : <Sun />}
            </button>

            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden px-2 py-1 rounded-md">
              <Menu />
            </button>
          </div>
        </nav>
      </header>

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
                    <div className={`${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'} p-6 rounded-xl shadow`}>
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

      {/* Footer */}
      <footer
        className={`${isDark ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-700'} border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} py-8 px-4 md:px-8`}
      >
        <div className="container mx-auto text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-4">Solar Store</h4>
              <p>Your one-stop shop for all things solar power. Sustainable energy, smarter living.</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setCurrentPage('home')
                      setSelectedCategory('all')
                    }}
                    className="hover:underline"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCurrentPage('products')
                      setSelectedCategory('all')
                    }}
                    className="hover:underline"
                  >
                    Products
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Contact Info</h4>
              <p>123 Solar Street, Green City, 90210</p>
              <p>Email: info@solarstore.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Solar Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}