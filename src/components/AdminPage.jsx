// components/AdminPage.jsx
"use client"

import React, { useState } from 'react';
import useStore from '../store/useStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu, ShoppingCart, Sun, Moon, Upload, X } from 'lucide-react';

const AdminPage = () => {
  const router = useRouter();
  const { products, addProduct, updateProduct, deleteProduct, cartItems } = useStore();
  const [formData, setFormData] = useState({ id: null, name: '', category: 'panels', description: '', price: '', imageUrl: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDark, setIsDark] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync with localStorage on mount
  React.useEffect(() => {
    try {
      const v = localStorage.getItem('mf-solar-dark-mode');
      if (v !== null) {
        setIsDark(v === 'true');
      }
    } catch {}
  }, []);

  // Persist/apply theme
  React.useEffect(() => {
    try {
      localStorage.setItem('mf-solar-dark-mode', String(isDark));
    } catch {}
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData({ ...formData, imageUrl: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      updateProduct(formData);
    } else {
      addProduct({ ...formData, price: parseFloat(formData.price) });
    }
    // Clear form
    setFormData({ id: null, name: '', category: 'panels', description: '', price: '', imageUrl: '' });
    setImageFile(null);
    setImagePreview('');
  };

  const handleEdit = (product) => {
    setFormData({ ...product, price: product.price.toString() });
    setImagePreview(product.imageUrl);
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

  return (
    <div className={`min-h-screen font-body ${isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      {/* Mobile menu slide-over */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className={`${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} absolute left-0 top-0 h-full w-72 p-6 shadow-2xl`}>
            <button className="absolute right-4 top-4 text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
              ✕
            </button>
            <h3 className="text-xl font-heading font-semibold mb-4">Menu</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => router.push('/')}
                  className="w-full text-left py-2 px-4 rounded-lg hover:bg-yellow-400 hover:text-gray-900"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push('/products')}
                  className="w-full text-left py-2 px-4 rounded-lg hover:bg-yellow-400 hover:text-gray-900"
                >
                  Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push('/cart')}
                  className="w-full text-left py-2 px-4 rounded-lg hover:bg-yellow-400 hover:text-gray-900"
                >
                  Cart ({cartItems.length})
                </button>
              </li>
            </ul>
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
              onClick={() => router.push('/')}
              className="focus:outline-none"
            >
              <span className="text-3xl text-yellow-400">☀️</span>
            </button>
            <span
              className="text-2xl font-heading font-bold tracking-tight cursor-pointer"
              onClick={() => router.push('/')}
            >
              Solar Store
            </span>
          </div>

          {/* Center nav (desktop) */}
          <div className="flex-grow hidden md:flex justify-center space-x-6">
            <button
              onClick={() => router.push('/')}
              className={`px-4 py-2 rounded-md transition-colors ${isDark ? 'hover:bg-yellow-400 hover:text-gray-900 bg-transparent text-white' : 'hover:bg-yellow-400 hover:text-gray-900 bg-transparent text-gray-900'}`}
            >
              Home
            </button>
            <button
              onClick={() => router.push('/products')}
              className={`px-4 py-2 rounded-md transition-colors ${isDark ? 'hover:bg-yellow-400 hover:text-gray-900 bg-transparent text-white' : 'hover:bg-yellow-400 hover:text-gray-900 bg-transparent text-gray-900'}`}
            >
              Products
            </button>
            <button
              className={`px-4 py-2 rounded-md transition-colors bg-yellow-400 text-gray-900 font-semibold`}
            >
              Admin
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

            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden px-2 py-1 rounded-md">
              <Menu />
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className={`py-12 md:py-20 px-4 md:px-8 ${isDark ? 'bg-gray-950' : 'bg-gray-50'} min-h-screen`}>
        <div className="container mx-auto max-w-6xl">
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-3xl md:text-4xl font-heading font-bold text-center mb-8`}>
            Admin Panel
          </h2>

          {/* Add/Edit Product Form */}
          <form onSubmit={handleSubmit} className={`${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-yellow-50 border-gray-300 text-gray-900'} p-6 rounded-xl mb-12 border shadow-lg`}>
            <h3 className="text-2xl font-semibold mb-6">{formData.id ? 'Edit Product' : 'Add New Product'}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Product Name</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Enter product name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                />
              </div>

              <div>
                <label className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  required 
                  className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                >
                  <option value="panels">Panels</option>
                  <option value="batteries">Batteries</option>
                  <option value="inverters">Inverters</option>
                </select>
              </div>

              <div>
                <label className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Price ($)</label>
                <input 
                  type="number" 
                  name="price" 
                  placeholder="0.00" 
                  value={formData.price} 
                  onChange={handleChange} 
                  required 
                  className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  step="0.01" 
                />
              </div>

              <div>
                <label className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Product Image</label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label 
                    htmlFor="image-upload"
                    className={`flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'} cursor-pointer transition-colors`}
                  >
                    <Upload size={20} />
                    <span>{imageFile ? imageFile.name : 'Upload Image'}</span>
                  </label>
                </div>
              </div>

              <div className="col-span-full">
                <label className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                <textarea 
                  name="description" 
                  placeholder="Enter product description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  required 
                  className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  rows="3"
                ></textarea>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="col-span-full">
                  <label className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Image Preview</label>
                  <div className="relative inline-block">
                    <Image 
                      src={imagePreview} 
                      alt="Preview" 
                      width={200} 
                      height={200} 
                      className="rounded-lg border border-gray-300 object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-semibold text-lg">
              {formData.id ? 'Update Product' : 'Add Product'}
            </button>
          </form>

          {/* Product List */}
          <div className="space-y-4">
            <h3 className={`text-2xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Current Products ({products.length})</h3>
            {products.map((product) => (
              <div key={product.id} className={`${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-yellow-50 border-gray-300 text-gray-900'} flex flex-col md:flex-row items-center justify-between p-4 rounded-xl border shadow-md`}>
                <div className="flex items-center gap-4 flex-grow">
                  <Image 
                    src={product.imageUrl} 
                    alt={product.name} 
                    width={80} 
                    height={80} 
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="text-lg font-semibold">{product.name}</h4>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{product.category}</p>
                    <p className={`${isDark ? 'text-green-400' : 'text-green-600'} font-bold`}>${product.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <button onClick={() => handleEdit(product)} className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 font-semibold transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
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
                  <button onClick={() => router.push('/')} className="hover:underline">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/products')} className="hover:underline">
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
    </div>
  );
};

export default AdminPage;
