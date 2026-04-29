// components/AdminPage.jsx
"use client"

import React, { useState } from 'react';
import useStore from '../store/useStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import { Upload, X } from 'lucide-react';

const AdminPage = () => {
  const router = useRouter();
  const { products, addProduct, updateProduct, deleteProduct, fetchProducts, setAdminPassword } = useStore();
  const [formData, setFormData] = useState({ id: null, name: '', category: 'panels', description: '', price: '', imageUrl: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDark, setIsDark] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Sync with localStorage on mount + check sessionStorage for saved auth
  React.useEffect(() => {
    try {
      const v = localStorage.getItem('mf-solar-dark-mode');
      if (v !== null) {
        setIsDark(v === 'true');
      }
      const savedPassword = sessionStorage.getItem('mf-solar-admin-auth');
      if (savedPassword) {
        setAdminPassword(savedPassword);
        setIsAuthenticated(true);
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
    const submitAsync = async () => {
      try {
        if (formData.id) {
          await updateProduct({ ...formData, price: parseFloat(formData.price) }, imageFile || undefined);
        } else {
          await addProduct({ ...formData, price: parseFloat(formData.price) }, imageFile || undefined);
        }
        // Clear form
        setFormData({ id: null, name: '', category: 'panels', description: '', price: '', imageUrl: '' });
        setImageFile(null);
        setImagePreview('');
        alert('Product saved successfully!');
      } catch (error) {
        console.error('Error saving product:', error);
        alert('Failed to save product. Please try again.');
      }
    };
    submitAsync();
  };

  const handleEdit = (product) => {
    setFormData({ ...product, price: product.price.toString() });
    setImagePreview(product.imageUrl);
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId).catch((error) => {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      });
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // We optimistically set the password and let the first API call confirm it
    if (!passwordInput.trim()) {
      setPasswordError('Please enter a password.');
      return;
    }
    setAdminPassword(passwordInput);
    try { sessionStorage.setItem('mf-solar-admin-auth', passwordInput); } catch {}
    setIsAuthenticated(true);
    setPasswordError('');
  };

  // Fetch products on mount (only after authenticated)
  React.useEffect(() => {
    if (isAuthenticated) fetchProducts();
  }, [isAuthenticated]);

  // ── Password Gate ──────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className={`w-full max-w-sm p-8 rounded-2xl shadow-2xl border ${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
          <div className="text-center mb-8">
            <span className="text-5xl">🔒</span>
            <h2 className="mt-4 text-2xl font-bold font-heading">Admin Access</h2>
            <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Enter your admin password to continue</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(''); }}
              placeholder="Admin password"
              autoFocus
              className={`w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'}`}
            />
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Unlock Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-body ${isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      <Navbar isDark={isDark} setIsDark={setIsDark} showCategoryNav={false} />

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
                  <option value="generators">Generators</option>
                  <option value="streetlights">Streetlights</option>
                  <option value="charge-controllers">Charge Controllers</option>
                </select>
              </div>

              <div>
                <label className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Price (₦)</label>
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
                    <p className={`${isDark ? 'text-green-400' : 'text-green-600'} font-bold`}>₦{product.price.toFixed(2)}</p>
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

      <Footer isDark={isDark} />
    </div>
  );
};

export default AdminPage;
