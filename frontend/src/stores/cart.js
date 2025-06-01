import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  
  getters: {
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },
    
    totalPrice: (state) => {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
  },
  
  actions: {
    addToCart(product, quantity = 1) {
      const existingItem = this.items.find(item => item._id === product._id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({
          ...product,
          quantity
        });
      }
      
      this.saveCart();
    },
    
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item._id === productId);
      if (item) {
        item.quantity = quantity;
        this.saveCart();
      }
    },
    
    removeFromCart(productId) {
      this.items = this.items.filter(item => item._id !== productId);
      this.saveCart();
    },
    
    clearCart() {
      this.items = [];
      this.saveCart();
    },
    
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    },
    
    loadCart() {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.items = JSON.parse(savedCart);
      }
    }
  }
});