'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import useStore from '@/store/useStore'
import type { Product } from '@/store/useStore'
import { ArrowLeft, ShoppingCart, Check, Star, Package, Shield, Truck } from 'lucide-react'

export default function ProductDetailsPage(): React.ReactElement {
  const params = useParams()
  const router = useRouter()
  const productId = Number(params.id)

  const { products, addToCart, cartItems } = useStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
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

  // Find product
  useEffect(() => {
    const foundProduct = products.find((p) => p.id === productId)
    if (foundProduct) {
      setProduct(foundProduct)
    }
  }, [productId, products])

  const handleAddToCart = () => {
    if (!product) return
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  if (!product) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold mb-4">Product Not Found</h2>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  // Mock related products (same category)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  return (
    <div className={`min-h-screen font-sans ${isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <header
        className={`${isDark ? 'bg-gray-950 text-white border-gray-800' : 'bg-white text-gray-900 border-gray-200'} sticky top-0 z-50 border-b backdrop-blur-md`}
      >
        <nav className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          {/* Logo - Always on the left */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.push('/')}
              className="focus:outline-none flex items-center space-x-2"
            >
              <span className="text-3xl">☀️</span>
              <span className="text-2xl font-heading font-bold tracking-tight">Solar Store</span>
            </button>
          </div>

          {/* Right side - Back button and Cart */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${isDark ? 'text-white hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-100'}`}
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-semibold hidden sm:inline">Back</span>
            </button>

            <button
              onClick={() => router.push('/')}
              className={`relative px-3 py-2 rounded-md transition-colors ${isDark ? 'hover:bg-yellow-400 hover:text-gray-900 text-white' : 'hover:bg-yellow-400 hover:text-gray-900 text-gray-900'}`}
            >
              <ShoppingCart />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-[10px] text-gray-900 font-bold">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center space-x-2 text-sm">
          <button onClick={() => router.push('/')} className="hover:text-yellow-400 transition-colors">
            Home
          </button>
          <span>/</span>
          <button onClick={() => router.push('/')} className="hover:text-yellow-400 transition-colors capitalize">
            {product.category}
          </button>
          <span>/</span>
          <span className="text-gray-500">{product.name}</span>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
          {/* Left: Image */}
          <div>
            <div
              className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'} rounded-2xl border p-4 md:p-8 flex items-center justify-center`}
              style={{ minHeight: '500px' }}
            >
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={700}
                height={500}
                className="object-contain rounded-lg w-full h-full max-h-[600px]"
                priority
              />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div>
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-yellow-400 text-gray-900 capitalize">
                {product.category.replace('-', ' ')}
              </span>
            </div>

            {/* Product Name */}
            <h1 className={`text-3xl md:text-4xl font-heading font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={20} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-500">(4.8 out of 5 stars)</span>
            </div>

            {/* Price */}
            <div className="py-4 border-y border-gray-700">
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-bold text-green-400">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${(product.price * 1.2).toFixed(2)}
                </span>
                <span className="px-2 py-1 text-xs font-semibold bg-green-600 text-white rounded">
                  Save 20%
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-heading font-semibold mb-3">Product Description</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed font-body`}>
                {product.description}
              </p>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="text-xl font-heading font-semibold mb-3">Key Features</h3>
              <ul className="space-y-2">
                {[
                  'High efficiency and durability',
                  'Weather-resistant design',
                  'Easy installation and maintenance',
                  'Certified quality standards',
                  '2-year manufacturer warranty',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <Check size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="text-lg font-heading font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={decrementQuantity}
                  className={`${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} w-10 h-10 rounded-md font-bold text-xl transition-colors`}
                >
                  -
                </button>
                <span className="text-2xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className={`${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} w-10 h-10 rounded-md font-bold text-xl transition-colors`}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 px-8 rounded-md font-semibold text-lg transition-all shadow-lg ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                }`}
              >
                {addedToCart ? (
                  <span className="flex items-center justify-center space-x-2">
                    <Check size={24} />
                    <span>Added to Cart!</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <ShoppingCart size={24} />
                    <span>Add to Cart</span>
                  </span>
                )}
              </button>
            </div>

            {/* Trust Badges */}
            <div className={`grid grid-cols-3 gap-4 pt-6 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'} p-3 rounded-full`}>
                  <Truck size={24} className="text-yellow-400" />
                </div>
                <span className="text-xs font-medium">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'} p-3 rounded-full`}>
                  <Shield size={24} className="text-yellow-400" />
                </div>
                <span className="text-xs font-medium">2-Year Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'} p-3 rounded-full`}>
                  <Package size={24} className="text-yellow-400" />
                </div>
                <span className="text-xs font-medium">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className={`text-3xl font-heading font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <article
                  key={relatedProduct.id}
                  className={`${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'} p-5 rounded-xl shadow-lg border flex flex-col cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300`}
                  onClick={() => router.push(`/product/${relatedProduct.id}`)}
                >
                  <div className="w-full overflow-hidden rounded-lg mb-4 bg-gray-100 dark:bg-gray-800" style={{ height: 200 }}>
                    <Image
                      src={relatedProduct.imageUrl}
                      alt={relatedProduct.name}
                      width={300}
                      height={200}
                      className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-lg font-heading font-bold mb-2 line-clamp-2">{relatedProduct.name}</h3>
                  <p className={`text-sm font-body mb-4 line-clamp-2 flex-grow ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {relatedProduct.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-green-400">
                      ${relatedProduct.price.toFixed(2)}
                    </div>
                    <span className="text-xs px-2 py-1 bg-yellow-400 text-gray-900 rounded-md font-semibold">In Stock</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      addToCart(relatedProduct)
                    }}
                    className="w-full py-2.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-semibold transition-colors"
                  >
                    Add to Cart
                  </button>
                </article>
              ))}
            </div>
          </section>
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
