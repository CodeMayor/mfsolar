import { create } from 'zustand';

// 1. Define the core type for a product
export type Product = {
  id: number;
  name: string;
  category: 'panels' | 'batteries' | 'inverters' | 'generators' | 'streetlights' | 'charge-controllers'; // Added new categories
  description: string;
  price: number;
  imageUrl: string;
};

// 2. Define the type for a cart item, which extends the Product type
export type CartItem = Product & {
  quantity: number;
};

// 3. Define the type for the entire store's state
export type StoreState = {
  products: Product[];
  cartItems: CartItem[];
  selectedCategory: 'all' | Product['category'];

  // Actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  addProduct: (newProduct: Omit<Product, 'id'>) => void;
  updateProduct: (updatedProduct: Product) => void;
  deleteProduct: (productId: number) => void;
  setSelectedCategory: (category: StoreState['selectedCategory']) => void;
};

// Sample product data, now explicitly typed
const initialProducts: Product[] = [
  {
    id: 1,
    name: 'High-Efficiency Monocrystalline Panel',
    category: 'panels',
    description: 'A durable and highly efficient solar panel with excellent low-light performance.',
    price: 250,
    imageUrl: '/sp1.jpg',
  },
  {
    id: 2,
    name: 'Lithium-Ion Solar Battery (5 kWh)',
    category: 'batteries',
    description: 'Long-lasting and reliable battery for residential energy storage.',
    price: 1800,
    imageUrl: 'https://placehold.co/400x300/fde047/000000.png?text=Solar+Battery',
  },
  {
    id: 3,
    name: 'Pure Sine Wave Inverter (3 kW)',
    category: 'inverters',
    description: 'Converts DC power from panels to AC power for household use with high efficiency.',
    price: 550,
    imageUrl: '/iv1.jpg',
  },
  {
    id: 4,
    name: 'Deep Cycle AGM Battery (100 Ah)',
    category: 'batteries',
    description: 'Robust and maintenance-free battery for off-grid systems and backups.',
    price: 320,
    imageUrl: 'https://placehold.co/400x300/fde047/000000.png?text=AGM+Battery',
  },
  {
    id: 5,
    name: 'Polycrystalline Solar Panel (300W)',
    category: 'panels',
    description: 'An economical option for solar power generation with good performance.',
    price: 180,
    imageUrl: '/sp2.jpg',
  },
  {
    id: 6,
    name: 'Hybrid Solar Inverter (5 kW)',
    category: 'inverters',
    description: 'Combines a charge controller and an inverter for simplified system setup.',
    price: 900,
    imageUrl: '/iv2.jpg',
  },
  // --- New Products ---
  {
    id: 7,
    name: 'Portable Solar Generator',
    category: 'generators',
    description: 'Portable solar generator for backup power.',
    price: 120000,
    imageUrl: '/sg1.jpg',
  },
  {
    id: 8,
    name: 'Solar Streetlight',
    category: 'streetlights',
    description: 'Solar-powered streetlight for outdoor lighting.',
    price: 35000,
    imageUrl: '/sl1.jpg',
  },
  {
    id: 9,
    name: 'Solar Charge Controller',
    category: 'charge-controllers',
    description: 'Efficient charge controller for solar systems.',
    price: 18000,
    imageUrl: '/cc1.jpg',
  },
];

const useStore = create<StoreState>((set) => ({
  // State
  products: initialProducts,
  cartItems: [],
  selectedCategory: 'all',

  // Actions for the cart
  addToCart: (product: Product) =>
    set((state) => {
      const itemExists = state.cartItems.find((item) => item.id === product.id);
      if (itemExists) {
        return {
          cartItems: state.cartItems.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      } else {
        return {
          cartItems: [...state.cartItems, { ...product, quantity: 1 }],
        };
      }
    }),

  removeFromCart: (productId: number) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== productId),
    })),

  clearCart: () => set({ cartItems: [] }),

  // Actions for the admin panel (CRUD)
  addProduct: (newProduct: Omit<Product, 'id'>) =>
    set((state) => ({
      products: [...state.products, { ...newProduct, id: state.products.length + 1 }],
    })),

  updateProduct: (updatedProduct: Product) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      ),
    })),

  deleteProduct: (productId: number) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== productId),
    })),

  // Action for category filtering
  setSelectedCategory: (category: StoreState['selectedCategory']) => set({ selectedCategory: category }),
}));

export default useStore; 