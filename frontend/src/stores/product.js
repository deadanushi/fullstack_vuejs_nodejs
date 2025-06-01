import { defineStore } from 'pinia';
import api from '../api/api';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    categories: [],
    loading: false,
    filters: {
      category: null,
      search: '',
      priceRange: [0, 1000]
    }
  }),
  
  getters: {
    filteredProducts: (state) => {
      return state.products.filter(product => {
        if (state.filters.category && product.category !== state.filters.category) {
          return false;
        }
        
        if (state.filters.search && !product.name.toLowerCase().includes(state.filters.search.toLowerCase())) {
          return false;
        }
        
        if (product.price < state.filters.priceRange[0] || product.price > state.filters.priceRange[1]) {
          return false;
        }
        
        return true;
      });
    }
  },
  
  actions: {
    async fetchProducts() {
  this.loading = true;
  try {
    const response = await api.get('/products');
    this.products = response.data.data || response.data;
    console.log('✅ Products loaded:', this.products);
    console.log('First product:', this.products[0]);  
    return { success: true, products: this.products };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch products' 
    };
  } finally {
    this.loading = false;
  }
}
,
    
    async fetchCategories() {
  try {
    const response = await api.get('/categories');
    this.categories = response.data.data || [];
    return { success: true, categories: this.categories };
  } catch (error) {
    console.error('Error fetching categories:', error);
    this.categories = [];  
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch categories' 
    };
  }
},
    
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters };
    },
    
    async addProduct(product) {
      try {
        const response = await api.post('/products', product);
        const newProduct = response.data.data || response.data;
        this.products.push(newProduct);
        return { success: true, product: newProduct };
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Failed to add product' 
        };
      }
    },
    
    async updateProduct(id, updates) {
      try {
        const response = await api.put(`/products/${id}`, updates);
        const updatedProduct = response.data.data || response.data;
        const index = this.products.findIndex(p => p._id === id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }
        return { success: true, product: updatedProduct };
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Failed to update product' 
        };
      }
    },
    
    async deleteProduct(id) {
      try {
        await api.delete(`/products/${id}`);
        this.products = this.products.filter(p => p._id !== id);
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Failed to delete product' 
        };
      }
    },
    
    async addCategory(category) {
      try {
        const response = await api.post('/categories', category);
        const newCategory = response.data.data || response.data;
        this.categories.push(newCategory);
        return { success: true, category: newCategory };
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Failed to add category' 
        };
      }
    },
    
    async updateCategory(id, updates) {
      try {
        const response = await api.put(`/categories/${id}`, updates);
        const updatedCategory = response.data.data || response.data;
        const index = this.categories.findIndex(c => c._id === id);
        if (index !== -1) {
          this.categories[index] = updatedCategory;
        }
        return { success: true, category: updatedCategory };
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Failed to update category' 
        };
      }
    },
    
    async deleteCategory(id) {
      try {
        await api.delete(`/categories/${id}`);
        this.categories = this.categories.filter(c => c._id !== id);
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Failed to delete category' 
        };
      }
    }
  }
});