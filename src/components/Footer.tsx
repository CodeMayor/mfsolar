'use client'

import React, { Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/navigation'
import type { StoreState } from '@/store/useStore'

type PageKey = 'home' | 'products' | 'cart' | 'admin' | 'generators' | 'streetlights' | 'charge-controllers'

interface FooterProps {
  isDark: boolean
  setCurrentPage?: Dispatch<SetStateAction<PageKey>>
  setSelectedCategory?: (category: StoreState['selectedCategory']) => void
}

export default function Footer({ isDark, setCurrentPage, setSelectedCategory }: FooterProps) {
  const router = useRouter()

  const handleHomeClick = () => {
    if (setCurrentPage && setSelectedCategory) {
      setCurrentPage('home')
      setSelectedCategory('all')
    } else {
      router.push('/')
    }
  }

  const handleProductsClick = () => {
    if (setCurrentPage && setSelectedCategory) {
      setCurrentPage('products')
      setSelectedCategory('all')
    } else {
      router.push('/')
    }
  }

  return (
    <footer
      className={`${isDark ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-700'} border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} py-8 px-4 md:px-8`}
    >
      <div className="container mx-auto text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-heading font-semibold mb-4">Solar Store</h4>
            <p>Your one-stop shop for all things solar power. Sustainable energy, smarter living.</p>
          </div>
          <div>
            <h4 className="text-xl font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={handleHomeClick}
                  className="hover:underline"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={handleProductsClick}
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
            <h4 className="text-xl font-heading font-semibold mb-4">Contact Info</h4>
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
  )
}
