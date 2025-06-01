<template>
  <div class="products-container">
    <section class="products-hero">
      <div class="hero-content">
        <h1 class="hero-title">
          Our <span class="gradient-text">Products</span>
        </h1>
        <p class="hero-subtitle">
          Discover amazing products tailored just for you
        </p>
      </div>
    </section>

    <div class="products-content">
      <v-container fluid class="px-6">
        <v-row>
          <v-col cols="12" lg="3" md="4">
            <div class="filters-sticky">
              <v-card class="filters-card" elevation="0">
                <v-card-title class="filters-title">
                  <v-icon left color="primary">mdi-filter-variant</v-icon>
                  Filters
                </v-card-title>
                
                <v-card-text class="filters-content">
                  <div class="filter-section">
                    <v-text-field
                      v-model="searchTerm"
                      label="Search products..."
                      prepend-inner-icon="mdi-magnify"
                      variant="outlined"
                      density="comfortable"
                      class="search-field"
                      @update:model-value="applyFilters"
                    ></v-text-field>
                  </div>

                  <div class="filter-section">
                    <h4 class="filter-label">Category</h4>
                    <v-select
                      v-model="selectedCategory"
                      :items="['All', ...categories]"
                      variant="outlined"
                      density="comfortable"
                      class="category-select"
                      @update:model-value="applyFilters"
                    ></v-select>
                  </div>

                  <div class="filter-section">
                    <h4 class="filter-label">Price Range</h4>
                    <div class="price-display">
                      ${{ priceRange[0] }} - ${{ priceRange[1] }}
                    </div>
                    <v-range-slider
                      v-model="priceRange"
                      :min="0"
                      :max="1000"
                      :step="10"
                      thumb-label="always"
                      color="primary"
                      track-color="grey-lighten-3"
                      class="price-slider"
                      @update:model-value="applyFilters"
                    ></v-range-slider>
                  </div>

                  <div class="filter-section">
                    <v-btn
                      variant="outlined"
                      color="primary"
                      block
                      @click="clearFilters"
                      class="clear-filters-btn"
                    >
                      <v-icon left>mdi-filter-remove</v-icon>
                      Clear Filters
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-col>

          <v-col cols="12" lg="9" md="8">
            <div v-if="loading" class="loading-container">
              <v-progress-circular 
                indeterminate 
                size="64" 
                color="primary"
                class="loading-spinner"
              ></v-progress-circular>
              <p class="loading-text">Loading amazing products...</p>
            </div>

            <div v-else-if="filteredProducts.length === 0" class="empty-state">
              <v-icon size="80" color="grey-lighten-2">mdi-package-variant-closed</v-icon>
              <h3 class="empty-title">No products found</h3>
              <p class="empty-subtitle">Try adjusting your filters or search terms</p>
              <v-btn 
                color="primary" 
                variant="outlined"
                @click="clearFilters"
                class="retry-btn"
              >
                Clear Filters
              </v-btn>
            </div>

            <div v-else class="products-grid">
              <ProductCard
                v-for="(product, index) in filteredProducts"
                :key="product._id || product.id"
                :product="product"
                :index="index"
                @add-to-cart="addToCart"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useProductStore } from '../stores/product';
import { useUserStore } from '../stores/user';
import { useCartStore } from '../stores/cart';
import { useToastStore } from '../stores/toast';
import ProductCard from '@/components/ProductCard.vue';
import '@/assets/styles/productView.css'

const productStore = useProductStore();
const userStore = useUserStore();
const cartStore = useCartStore();
const toastStore = useToastStore();

const loading = ref(false);
const selectedCategory = ref('All');
const searchTerm = ref('');
const priceRange = ref([0, 1000]);

const categories = computed(() => productStore.categories || []);
const filteredProducts = computed(() => productStore.filteredProducts || []);


onMounted(async () => {
  loading.value = true;
  try {
    await productStore.fetchCategories();
    await productStore.fetchProducts();

    if (productStore.filters) {
      selectedCategory.value = productStore.filters.category.name || 'All';
      searchTerm.value = productStore.filters.search || '';
      priceRange.value = [...(productStore.filters.priceRange || [0, 1000])];
    }
  } catch (error) {
    console.error('Error loading products:', error);
    toastStore.show({
      message: 'Failed to load products. Please try again.',
      color: 'error'
    });
  } finally {
    loading.value = false;
  }
});

watch([selectedCategory, searchTerm, priceRange], () => {
  applyFilters();
}, { immediate: true });

function applyFilters() {
  if (productStore.setFilters) {
    productStore.setFilters({
      category: selectedCategory.value === 'All' ? null : selectedCategory.value,
      search: searchTerm.value,
      priceRange: priceRange.value,
    });
  }
}


function clearFilters() {
  selectedCategory.value = 'All';
  searchTerm.value = '';
  priceRange.value = [0, 1000];
  applyFilters();
}

function addToCart(product) {
  if (!userStore.isLoggedIn) {
    toastStore.show({
      message: 'Please log in to add items to cart',
      color: 'warning'
    });
    return;
  }
  
  if (userStore.isAdmin) {
    toastStore.show({
      message: 'Admin accounts cannot add items to cart',
      color: 'info'
    });
    return;
  }

  if ((product.stock || 0) === 0) {
    toastStore.show({
      message: 'This product is out of stock',
      color: 'error'
    });
    return;
  }
  
  cartStore.addToCart(product);
  toastStore.show({
    message: `${product.name || product.title} added to cart!`,
    color: 'success'
  });
}

</script>

