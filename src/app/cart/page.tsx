"use client"

const Cart = () => (
  <h1>Cart</h1>
)

export default Cart

// "use client"
// import React from 'react';
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import { nanoid } from 'nanoid';
// import { useRouter } from "next/navigation"
// import {useCartStore, CartItem as CartItemType} from "@/store/cartStore"
// import { Button } from "@/components/ui/button"
// import { Trash2, ChevronLeft, Plus, Minus  } from 'lucide-react';
// import FlutterwaveInlineButton from '@/components/FlutterwaveInlineButton';
//
// // 1. Define props interface:
// interface CartItemProps {
//   item: CartItemType;
// }
//
// // CartItem component to display a single product in the cart
//
// // 2. Annotate the component with that interface:
// const CartItem: React.FC<CartItemProps> = ({ item }) => {
//
//   const { updateQuantity, removeFromCart } = useCartStore();
//
//   const handleDecreaseQuantity = () => {
//     updateQuantity(item.id, item.quantity - 1);
//   };
//
//   const handleIncreaseQuantity = () => {
//     updateQuantity(item.id, item.quantity + 1);
//   };
//
//   const handleRemoveItem = () => {
//     removeFromCart(item.id);
//   };
//
//   return (
//     <div className="flex items-center bg-white p-4 rounded-lg shadow-sm mb-4">
//       <img
//         src={item.imageUrl}
//         alt={item.name}
//         className="w-20 h-20 object-contain rounded-md mr-4"
//       />
//       <div className="flex-grow">
//         <h3 className="text-base font-semibold text-gray-800">{item.name}</h3>
//         <p className="text-lg font-bold text-teal-600">{item.price}</p>
//         <div className="flex items-center mt-2">
//           <Button variant="outline" className="h-8 w-8 p-0 rounded-full" onClick={handleDecreaseQuantity}>
//             <Minus className="h-4 w-4" />
//           </Button>
//           <span className="text-sm font-medium mx-3 w-4 text-center">{item.quantity}</span>
//           <Button variant="outline" className="h-8 w-8 p-0 rounded-full" onClick={handleIncreaseQuantity}>
//             <Plus className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//       <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:text-red-500" onClick={handleRemoveItem}>
//         <Trash2 className="h-5 w-5" />
//       </Button>
//     </div>
//   );
// };
//
// // Main component to render the Shopping Cart page
// const App = () => {
//   const { items, clearCart, getTotalPrice, getTotalItems } = useCartStore();
//
//   const router = useRouter()
//
//   const handleGoBack = () => {
//     // This function would typically navigate back in a real application
//     router.back()
//     console.log("Going back...");
//   };
//
//   const handleProceedToCheckout = () => {
//     console.log("Proceeding to checkout...");
//     // Future logic for checkout goes here
//   };
//
//
//   const email = 'customer@example.com';
//   const name = 'Jane Doe';
//
//   const handleSuccess = () => {
//     // e.g. redirect or show a toast
//     // if (resp.status === 'successful') {
//     //   window.location.href = '/thank-you';
//     // }
//     console.log("Transaction Successfull")
//   };
//
//
//   return (
//     <div className="p-4 bg-gray-50 min-h-screen font-sans flex flex-col">
//       {/* Header */}
//       <header className="flex items-center justify-between mb-4">
//         <Button variant="ghost" className="h-10 w-10 p-0" onClick={handleGoBack}>
//           <ChevronLeft className="h-6 w-6 text-gray-800" />
//         </Button>
//         <h1 className="text-xl font-bold text-gray-800">Shopping Cart</h1>
//         <Button variant="ghost" className="h-10 w-10 p-0" onClick={clearCart}>
//           <Trash2 className="h-6 w-6 text-gray-500 hover:text-red-500" />
//         </Button>
//       </header>
//
//       {/* Cart Items List */}
//       <main className="flex-grow">
//         {items.length > 0 ? (
//           items.map(item => (
//             <CartItem key={item.id} item={item} />
//           ))
//         ) : (
//           <div className="text-center text-gray-500 mt-20">Your cart is empty.</div>
//         )}
//       </main>
//
//       {/* Footer / Summary */}
//       {items.length > 0 && (
//         <footer className="bg-white p-4 rounded-lg shadow-sm mt-4">
//           <div className="flex justify-between items-center text-gray-700 font-medium text-sm">
//             <span>Total {getTotalItems()} Items</span>
//             <span className="text-xl font-bold text-gray-800">₦{getTotalPrice().toFixed(2)}</span>
//           </div>
//    <FlutterwaveInlineButton
//         amount={getTotalPrice().toFixed(2)}
//         email={email}
//         name={name}
//         onSuccess={handleSuccess}
//         onClose={() => console.log('Checkout closed')}
//       />
//
//         </footer>
//       )}
//     </div>
//   );
// };
//
// export default App;
