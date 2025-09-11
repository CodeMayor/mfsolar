'use client'
import Image from "next/image"
import React, { useState, useEffect } from 'react';

// Mock data for the product and related content
const mockProduct = {
  name: 'Arduino Uno R3',
  price: '11,000',
  images: [
    'https://placehold.co/300x200/E0E0E0/white?text=Product+Image+1',
    'https://placehold.co/300x200/E0E0E0/white?text=Product+Image+2',
    'https://placehold.co/300x200/E0E0E0/white?text=Product+Image+3',
  ],
  description: 'The Arduino Uno R3 is a compact microcontroller board powered by the ATmega328P. It features 14 digital pins, 6 analog inputs, and a 16MHz clock, making it perfect for DIY electronics, prototyping, and learning embedded systems.',
  specifications: [
    { title: 'Reliable Microcontroller for Projects', details: 'The Arduino Uno R3 is a compact microcontroller board powered by the ATmega328P. It features 14 digital pins, 6 analog inputs, and a 16MHz clock, making it perfect for DIY electronics, prototyping, and learning embedded systems.' },
    { title: 'ESP 82', details: 'Enables seamless Wi-Fi connectivity for IoT projects.', imageUrl: 'https://placehold.co/60x60/E0E0E0/white?text=ESP82' },
    { title: 'Arduino Nano', details: 'Arduino Nano packs powerful microcontroller features in a tiny board for compact projects.', imageUrl: 'https://placehold.co/60x60/E0E0E0/white?text=Nano' },
  ],
};

// Mock data for reviews
const mockReviews = [
  { id: 1, name: 'Madelina', rating: 4, review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', avatar: 'https://placehold.co/40x40/6B7280/white?text=M', time: '1 month ago' },
  { id: 2, name: 'Irfan', rating: 5, review: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', avatar: 'https://placehold.co/40x40/6B7280/white?text=I', time: '1 month ago' },
  { id: 3, name: 'Ravi Putra', rating: 3, review: 'Excepteur sint occaecat cupidatat non proident.', avatar: 'https://placehold.co/40x40/6B7280/white?text=R', time: '1 month ago' },
];

const Item = () => {
  const [activeTab, setActiveTab] = useState('Overview');
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
      <div className="w-full max-w-sm bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
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

          <span className="text-sm font-medium text-gray-900">NGN {mockProduct.price}</span>

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

        {/* Product Title and Tabs */}
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900">{mockProduct.name}</h1>
          <div className="flex justify-around border-b border-gray-200 mt-4">
            {['Overview', 'Features', 'Specification'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-4 font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-teal-500 border-b-2 border-teal-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 overflow-y-auto" style={{ paddingBottom: '72px' }}>
          {/* Overview Tab Content */}
          {activeTab === 'Overview' && (
            <>
              {isLoading ? (
                // Skeleton UI for image carousel
                <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse mb-6"></div>
              ) : (
                // Product image carousel
                <div className="overflow-x-auto flex gap-4 mb-6 -mx-4 px-4">
                  {mockProduct.images.map((img, index) => (
                    <div key={index} className="flex-shrink-0 w-64 h-48 rounded-lg overflow-hidden shadow-md bg-gray-100 flex items-center justify-center">
                      <Image src={img} alt={`${mockProduct.name} ${index + 1}`} height={80} width={80} className="max-w-full max-h-full object-contain" />
                    </div>
                  ))}
                </div>
              )}

              {/* Review Section */}
              <h2 className="text-lg font-bold text-gray-800 mb-4">Review (102)</h2>
              {isLoading ? (
                // Skeleton UI for reviews
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-start mb-4 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-4"></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                        <div className="h-4 w-1/6 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
                      <div className="h-4 w-11/12 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))
              ) : (
                // Actual reviews
                mockReviews.map((review) => (
                  <div key={review.id} className="flex items-start mb-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                      <Image src={review.avatar} alt={`${review.name}'s avatar`} height={80} width={80} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span className="font-medium text-gray-800">{review.name}</span>
                        <span className="text-gray-500">{review.time}</span>
                      </div>
                      <div className="flex items-center text-yellow-400 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-700">{review.review}</p>
                    </div>
                  </div>
                ))
              )}
              <button className="text-teal-500 font-medium text-sm w-full text-center mt-2">See All Reviews</button>
            </>
          )}

          {/* Features Tab Content (placeholder) */}
          {activeTab === 'Features' && (
            <div className="text-gray-700">
              <h2 className="text-lg font-bold mb-2">Product Features</h2>
              <p>This is a placeholder for the product features. You can add a list of features here.</p>
            </div>
          )}

          {/* Specification Tab Content */}
          {activeTab === 'Specification' && (
            <div className="text-gray-700">
              <h2 className="text-lg font-bold mb-4">Reliable Microcontroller for Projects</h2>
              <p className="mb-6">{mockProduct.description}</p>
              {mockProduct.specifications.map((spec, index) => (
                <div key={index} className="flex items-start mb-6">
                  {spec.imageUrl && (
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center mr-4">
                      <Image src={spec.imageUrl} alt={spec.title} height={80} width={80} className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-800">{spec.title}</h3>
                    <p className="text-sm text-gray-600">{spec.details}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fixed "Add To Cart" button */}
        <div className="fixed bottom-0 left-0 w-full max-w-sm bg-white p-4 shadow-top">
          <button className="w-full bg-teal-500 text-white py-3 rounded-full flex items-center justify-center font-bold text-lg shadow-lg hover:bg-teal-600 transition-colors">
            Add To Cart
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Item;

