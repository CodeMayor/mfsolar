import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

// 1. Define the core type for a product
export type Product = {
  id: number;
  name: string;
  category: 'panels' | 'batteries' | 'inverters' | 'generators' | 'streetlights' | 'charge-controllers';
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
  isLoading: boolean;
  adminPassword: string;

  // Actions
  fetchProducts: () => Promise<void>;
  setAdminPassword: (password: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  addProduct: (newProduct: Omit<Product, 'id'>, imageFile?: File) => Promise<void>;
  updateProduct: (updatedProduct: Product, imageFile?: File) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;
  setSelectedCategory: (category: StoreState['selectedCategory']) => void;
};

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // State
      products: [],
      cartItems: [],
      selectedCategory: 'all',
      isLoading: false,
      adminPassword: '',

      setAdminPassword: (password: string) => set({ adminPassword: password }),

      // Fetch products from Supabase
      fetchProducts: async () => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: true });

          if (error) throw error;

          const products: Product[] = data.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category as Product['category'],
            description: item.description,
            price: Number(item.price),
            imageUrl: item.image_url,
          }));

          set({ products, isLoading: false });
        } catch (error) {
          console.error('Error fetching products:', error);
          set({ isLoading: false });
        }
      },

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

      // Actions for the admin panel (CRUD via secure server-side API)
      addProduct: async (newProduct: Omit<Product, 'id'>, imageFile?: File) => {
        const { adminPassword } = get();
        try {
          let imageBase64: string | undefined;
          let imageExtension: string | undefined;

          if (imageFile) {
            imageExtension = imageFile.name.split('.').pop();
            imageBase64 = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(imageFile);
            });
          }

          const res = await fetch('/api/admin/products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-admin-password': adminPassword,
            },
            body: JSON.stringify({
              name: newProduct.name,
              category: newProduct.category,
              description: newProduct.description,
              price: newProduct.price,
              imageUrl: newProduct.imageUrl,
              imageBase64,
              imageExtension,
            }),
          });

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to add product');
          }

          const { product: data } = await res.json();
          const product: Product = {
            id: data.id,
            name: data.name,
            category: data.category as Product['category'],
            description: data.description,
            price: Number(data.price),
            imageUrl: data.image_url,
          };

          set((state) => ({ products: [...state.products, product] }));
        } catch (error) {
          console.error('Error adding product:', error);
          throw error;
        }
      },

      updateProduct: async (updatedProduct: Product, imageFile?: File) => {
        const { adminPassword } = get();
        try {
          let imageBase64: string | undefined;
          let imageExtension: string | undefined;

          if (imageFile) {
            imageExtension = imageFile.name.split('.').pop();
            imageBase64 = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(imageFile);
            });
          }

          const res = await fetch('/api/admin/products', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-admin-password': adminPassword,
            },
            body: JSON.stringify({
              id: updatedProduct.id,
              name: updatedProduct.name,
              category: updatedProduct.category,
              description: updatedProduct.description,
              price: updatedProduct.price,
              imageUrl: updatedProduct.imageUrl,
              imageBase64,
              imageExtension,
            }),
          });

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to update product');
          }

          const { imageUrl } = await res.json();
          set((state) => ({
            products: state.products.map((product) =>
              product.id === updatedProduct.id
                ? { ...updatedProduct, imageUrl }
                : product
            ),
          }));
        } catch (error) {
          console.error('Error updating product:', error);
          throw error;
        }
      },

      deleteProduct: async (productId: number) => {
        const { adminPassword } = get();
        try {
          const res = await fetch('/api/admin/products', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'x-admin-password': adminPassword,
            },
            body: JSON.stringify({ id: productId }),
          });

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to delete product');
          }

          set((state) => ({
            products: state.products.filter((product) => product.id !== productId),
          }));
        } catch (error) {
          console.error('Error deleting product:', error);
          throw error;
        }
      },

      // Action for category filtering
      setSelectedCategory: (category: StoreState['selectedCategory']) => set({ selectedCategory: category }),
    }),
    {
      name: 'mf-solar-cart-storage', // unique name for localStorage key
      partialize: (state) => ({ cartItems: state.cartItems }), // only persist cart items
    }
  )
);

export default useStore;