// components/AdminPage.jsx
"use client"

import React, { useState } from 'react';
import useStore from '../store/useStore';

const AdminPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [formData, setFormData] = useState({ id: null, name: '', category: 'panels', description: '', price: '', imageUrl: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
  };

  const handleEdit = (product) => {
    setFormData({ ...product, price: product.price.toString() });
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

  return (
    <section className="py-12 px-4 bg-gray-950 min-h-screen">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">Admin Panel</h2>

        {/* Add/Edit Product Form */}
        <form onSubmit={handleSubmit} className="p-6 bg-gray-900 rounded-xl mb-12 border border-gray-800">
          <h3 className="text-2xl font-semibold mb-4 text-white">{formData.id ? 'Edit Product' : 'Add New Product'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required className="input-field" />
            <select name="category" value={formData.category} onChange={handleChange} required className="input-field">
              <option value="panels">Panels</option>
              <option value="batteries">Batteries</option>
              <option value="inverters">Inverters</option>
            </select>
            <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required className="input-field" step="0.01" />
            <input type="text" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} required className="input-field" />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="input-field col-span-full" rows="3"></textarea>
          </div>
          <button type="submit" className="mt-4 w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all">
            {formData.id ? 'Update Product' : 'Add Product'}
          </button>
        </form>

        {/* Product List */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold mb-4 text-white">Current Products</h3>
          {products.map((product) => (
            <div key={product.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-800">
              <div className="flex-grow">
                <h4 className="text-lg font-semibold text-white">{product.name}</h4>
                <p className="text-gray-400">${product.price.toFixed(2)}</p>
              </div>
              <div className="flex space-x-2 mt-2 md:mt-0">
                <button onClick={() => handleEdit(product)} className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500">Edit</button>
                <button onClick={() => handleDelete(product.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
