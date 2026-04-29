'use client'

import React, { useRef, useEffect, useState, Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, ShoppingCart, Sun, Moon } from 'lucide-react'
import useStore from '@/store/useStore'
import type { StoreState } from '@/store/useStore'

type PageKey = 'home' | 'products' | 'cart' | 'admin' | 'generators' | 'streetlights' | 'charge-controllers'

interface NavbarProps {
  isDark: boolean
  setIsDark: (value: boolean) => void
  currentPage?: PageKey
  setCurrentPage?: Dispatch<SetStateAction<PageKey>>
  setSelectedCategory?: (category: StoreState['selectedCategory']) => void
  showCategoryNav?: boolean
}

export default function Navbar({
  isDark,
  setIsDark,
  currentPage,
  setCurrentPage,
  setSelectedCategory,
  showCategoryNav = true
}: NavbarProps) {
  const router = useRouter()
  const { cartItems } = useStore()
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement | null>(null)

  const mainNavCats: StoreState['selectedCategory'][] = ['panels', 'batteries', 'inverters']
  const dropdownCats: StoreState['selectedCategory'][] = ['generators', 'streetlights', 'charge-controllers']
  const allCats: StoreState['selectedCategory'][] = ['all', ...mainNavCats, ...dropdownCats]

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

  const handleCategoryClick = (cat: StoreState['selectedCategory']) => {
    if (setSelectedCategory) setSelectedCategory(cat)
    if (setCurrentPage) setCurrentPage('products')
    setIsMoreOpen(false)
  }

  const handleLogoClick = () => {
    if (setCurrentPage && setSelectedCategory) {
      setCurrentPage('home')
      setSelectedCategory('all')
    } else {
      router.push('/')
    }
  }

  return (
    <>
      {/* Mobile menu slide-over */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className={`${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} absolute left-0 top-0 h-full w-72 p-6 shadow-2xl`}>
            <button className="absolute right-4 top-4 text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
              ✕
            </button>
            <h3 className="text-xl font-heading font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {allCats.slice(1).map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      handleCategoryClick(cat)
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
                  router.push('/cart')
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
              onClick={handleLogoClick}
              className="focus:outline-none"
            >
              <span className="text-3xl text-yellow-400">☀️</span>
            </button>
            <span
              className="text-2xl font-heading font-bold tracking-tight cursor-pointer"
              onClick={handleLogoClick}
            >
              Solar Store
            </span>
          </div>

          {/* Center nav (desktop) - only show if showCategoryNav is true */}
          {showCategoryNav && (
            <div className="flex-grow hidden md:flex justify-center space-x-6">
              {mainNavCats.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-4 py-2 rounded-md transition-colors ${isDark ? 'hover:bg-yellow-400 hover:text-gray-900 bg-transparent text-white' : 'hover:bg-yellow-400 hover:text-gray-900 bg-transparent text-gray-900'} capitalize`}
                >
                  {cat}
                </button>
              ))}

              {/* More dropdown */}
              <div className="relative" ref={moreRef}>
                <button
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  className={`px-4 py-2 rounded-md transition-colors ${isDark ? 'hover:bg-yellow-400 hover:text-gray-900 bg-transparent text-white' : 'hover:bg-yellow-400 hover:text-gray-900 bg-transparent text-gray-900'}`}
                >
                  More...
                </button>
                {isMoreOpen && (
                  <div className={`${isDark ? 'bg-gray-900 text-white border-gray-800' : 'bg-white text-gray-900 border-gray-200'} absolute left-0 mt-2 w-48 rounded-lg shadow-lg border z-50`}>
                    <ul>
                      {dropdownCats.map((cat) => (
                        <li key={cat}>
                          <button
                            onClick={() => handleCategoryClick(cat)}
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
            </div>
          )}

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

            {showCategoryNav && (
              <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden px-2 py-1 rounded-md">
                <Menu />
              </button>
            )}
          </div>
        </nav>
      </header>
    </>
  )
}
