'use client'
import Image from "next/image"
import React, { useState, useEffect } from 'react';

// Mock data for the products to display
const mockProducts = [
  { id: 1, name: 'Arduino Uno R3', price: 'NGN 11,000', imageUrl: 'https://placehold.co/150x100/E0E0E0/white?text=Arduino', rating: 4.6, reviews: 86 },
  { id: 2, name: 'Arduino Uno R3', price: 'NGN 11,000', imageUrl: 'https://placehold.co/150x100/E0E0E0/white?text=Arduino', rating: 4.6, reviews: 86 },
  { id: 3, name: 'Arduino Uno R3', price: 'NGN 11,000', imageUrl: 'https://placehold.co/150x100/E0E0E0/white?text=Arduino', rating: 4.6, reviews: 86 },
  { id: 4, name: 'Arduino Uno R3', price: 'NGN 11,000', imageUrl: 'https://placehold.co/150x100/E0E0E0/white?text=Arduino', rating: 4.6, reviews: 86 },
  { id: 5, name: 'Arduino Uno R3', price: 'NGN 11,000', imageUrl: 'https://placehold.co/150x100/E0E0E0/white?text=Arduino', rating: 4.6, reviews: 86 },
  { id: 6, name: 'Arduino Uno R3', price: 'NGN 11,000', imageUrl: 'https://placehold.co/150x100/E0E0E0/white?text=Arduino', rating: 4.6, reviews: 86 },
];

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate a network request with a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2-second delay to show the skeleton UI
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex flex-col items-center">
      <div className="w-full max-w-sm bg-white shadow-xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {/* Back Button */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>

          {/* Spacer to center the title or a place for a title later */}
          <div className="flex-grow"></div>

          {/* Shopping Cart Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.153 1.767.707 1.767H17m0-7a2 2 0 110 4 2 2 0 010-4z" />
          </svg>
        </div>

        {/* Title Section */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 font-medium mb-1">Component</p>
          <h1 className="text-2xl font-bold text-gray-800">Arduino Uno</h1>
        </div>

        {/* Filter and Sort Buttons */}
        <div className="flex overflow-x-auto gap-2 pb-2 mb-6">
          <button className="flex-shrink-0 flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm transition-colors hover:bg-gray-200">
            {/* Filter Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17m0 0a1 1 0 01-1 1H9.83a1 1 0 01-.707-.293l-4.414-4.414A1 1 0 013 12.586V4z" />
            </svg>
            Filter
          </button>
          {['Popularity', 'Newest', 'Most Expensive'].map((option, index) => (
            <button
              key={index}
              className="flex-shrink-0 px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm transition-colors hover:bg-gray-200"
            >
              {option}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4">
          {isLoading ? (
            // Skeleton UI for loading state
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-200"></div>
                <div className="p-3">
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
                  <div className="flex items-center">
                    <div className="h-4 w-1/3 bg-gray-200 rounded mr-2"></div>
                    <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Actual products after loading
            mockProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-40 flex items-center justify-center p-2">
                  <Image src={product.imageUrl} alt={product.name} height={80} width={80} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-700">{product.name}</p>
                  <p className="text-base font-bold text-gray-900 mt-1">{product.price}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-2 justify-between">
                    <div className="flex items-center">
                      {/* Star Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-yellow-400 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{product.rating}</span>
                      <span className="ml-1 text-gray-400">({product.reviews} Reviews)</span>
                    </div>
                    {/* More Options Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
