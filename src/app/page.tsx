"use client"

import React, { useState, } from 'react';
import type { StoreState } from '@/store/useStore';
import useStore from '@/store/useStore';
// import { useRouter } from 'next/navigation';
import Image from 'next/image'
import AdminPage from '@/components/AdminPage'; // Import the new Admin page component

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const router = useRouter();

  // Connect to the Zustand store
  const {
    products,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    selectedCategory,
    setSelectedCategory
  } = useStore();

  const calculateTotal = () => {
    return cartItems.reduce((acc: number, item) => acc + item.price * item.quantity, 0).toFixed(2);
  };

  const handleCheckout = () => {
    alert('Thank you for your purchase! Your order has been placed.');
    clearCart();
    setCurrentPage('home');
  };

  const TemplateCategorySample: StoreState['selectedCategory'][] = ['all', 'panels', 'batteries', 'inverters']

  // --- Page Components ---
  const HomePage = () => (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/50 to-emerald-800/50 -z-10" aria-hidden="true"></div>
        <div className="max-w-4xl space-y-4 md:space-y-6 z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-md">
            Powering Your Future with Solar Solutions
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 drop-shadow-sm">
            Discover a wide range of high-quality solar batteries, inverters, and panels for a sustainable tomorrow.
          </p>
          <button
            onClick={() => setCurrentPage('products')}
            className="px-6 py-3 mt-4 text-lg font-semibold text-gray-900 transition-all bg-yellow-300 rounded-full shadow-lg hover:bg-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-300/50"
          >
            Explore Products
          </button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 bg-gray-950">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-white">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className="p-4 rounded-xl bg-gray-900 shadow-xl border border-gray-800 flex flex-col items-center text-center">
                <Image src={product.imageUrl} alt={product.name} height={200} width={200} className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-xl font-semibold text-white">{product.name}</h3>
                <p className="text-gray-400 mt-2">{product.description}</p>
                <div className="mt-4 text-2xl font-bold text-green-400">${product.price.toFixed(2)}</div>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );

  const ProductsPage = () => {
    const filteredProducts = products.filter((product) => {
      if (selectedCategory === 'all') {
        return true;
      }
      return product.category === selectedCategory;
    });

    return (
      <section className="py-12 md:py-20 px-4 md:px-8 bg-gray-950 min-h-screen">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">Our Products</h2>
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center space-x-2 md:space-x-4 mb-12">
            {TemplateCategorySample.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 my-2 rounded-full font-medium transition-all ${selectedCategory === category
                  ? 'bg-yellow-400 text-gray-900 shadow-md'
                  : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                  }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="p-4 rounded-xl bg-gray-900 shadow-xl border border-gray-800 flex flex-col items-center text-center">
                  <Image src={product.imageUrl} alt={product.name} height={80} width={80} className="w-full h-48 object-cover rounded-lg mb-4" />
                  <h3 className="text-xl font-semibold text-white">{product.name}</h3>
                  <p className="text-gray-400 mt-2 line-clamp-2">{product.description}</p>
                  <div className="mt-4 text-2xl font-bold text-green-400">${product.price.toFixed(2)}</div>
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-4 w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 text-lg col-span-full">No products found in this category.</p>
            )}
          </div>
        </div>
      </section>
    );
  };

  const CartPage = () => (
    <section className="py-12 md:py-20 px-4 md:px-8 bg-gray-950 min-h-screen">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">Your Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <div className="text-center p-8 border border-gray-700 rounded-xl">
            <p className="text-gray-400 text-lg">Your cart is empty. Start shopping now!</p>
            <button
              onClick={() => setCurrentPage('products')}
              className="mt-6 px-6 py-3 text-lg font-semibold text-gray-900 transition-all bg-yellow-300 rounded-full shadow-lg hover:bg-yellow-400"
            >
              Go to Products
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 rounded-xl bg-gray-900 border border-gray-800 shadow-md">
                <Image src={item.imageUrl} alt={item.name} height={80} width={80} className="w-20 h-20 object-cover rounded-md" />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                  <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                  <p className="text-lg font-bold text-green-400">${item.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex flex-col md:flex-row justify-between items-center p-6 bg-gray-900 rounded-xl border border-gray-700 mt-8">
              <span className="text-2xl font-bold text-white mb-4 md:mb-0">Total: ${calculateTotal()}</span>
              <button
                onClick={handleCheckout}
                className="px-8 py-3 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-all"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );

  return (
    <div className="bg-gray-950 text-white min-h-screen font-sans">
      {/* <style> */}
      {/*   {` */}
      {/*     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'); */}
      {/*     body { font-family: 'Inter', sans-serif; } */}
      {/*   `} */}
      {/* </style> */}
      {/* <script src="https://cdn.tailwindcss.com"></script> */}
      {/* <script src="https://unpkg.com/lucide@latest"></script> */}

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-md z-[55] md:hidden" onClick={() => setIsSidebarOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 p-6 space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <h3 className="text-xl font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              {TemplateCategorySample.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setCurrentPage('products');
                      setIsSidebarOpen(false);
                    }}
                    className="w-full text-left py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <nav className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-3xl text-yellow-400">☀️</span>
            <span className="text-2xl font-bold tracking-tight">Solar Store</span>
          </div>
          <div className="flex-grow hidden md:flex justify-center space-x-6">
            <button onClick={() => setCurrentPage('home')} className="nav-link">Home</button>
            <button onClick={() => { setCurrentPage('products'); setSelectedCategory('all'); }} className="nav-link">All Products</button>
            <button onClick={() => { setCurrentPage('products'); setSelectedCategory('panels'); }} className="nav-link">Panels</button>
            <button onClick={() => { setCurrentPage('products'); setSelectedCategory('batteries'); }} className="nav-link">Batteries</button>
            <button onClick={() => { setCurrentPage('products'); setSelectedCategory('inverters'); }} className="nav-link">Inverters</button>
            <button onClick={() => setCurrentPage('admin')} className="nav-link text-red-400">Admin</button>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setCurrentPage('cart')} className="relative nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1" /><path d="M10 21h4" /><path d="M2.5 2h2.25L7 13.5h11.5L21.4 6.5H5.1" /><path d="M12 2v2" /><path d="M17 2v2" /><path d="M22 6.5l-2.2-4.5" /><path d="M19 13.5L18 21" /></svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-[10px] text-gray-900 font-bold">
                  {cartItems.length}
                </span>
              )}
            </button>
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content Area (renders the current page) */}
      <main>
        {(() => {
          switch (currentPage) {
            case 'home':
              return <HomePage />;
            case 'products':
              return <ProductsPage />;
            case 'cart':
              return <CartPage />;
            case 'admin':
              return <AdminPage />;
            default:
              return <HomePage />;
          }
        })()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8 px-4 md:px-8">
        <div className="container mx-auto text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-400">
            <div>
              <h4 className="text-xl font-semibold text-white mb-4">Solar Store</h4>
              <p>Your one-stop shop for all things solar power. Sustainable energy, smarter living.</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setCurrentPage('home')} className="hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => setCurrentPage('products')} className="hover:text-white transition-colors">Products</button></li>
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-white mb-4">Contact Info</h4>
              <p>123 Solar Street, Green City, 90210</p>
              <p>Email: info@solarstore.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500">
          <p>&copy; 2024 Solar Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
