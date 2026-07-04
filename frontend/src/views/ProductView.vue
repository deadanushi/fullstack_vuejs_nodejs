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
                      :items="categoryItems"
                      item-title="name"
                      item-value="_id"
                      variant="outlined"
                      density="comfortable"
                      class="category-select"
                      :menu-props="{ zIndex: 9999 }"
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
              <div class="empty-state-inner">
                <div class="empty-icon-wrap">
                  <v-icon size="48" color="grey-lighten-1">mdi-magnify-close</v-icon>
                </div>
                <h3 class="empty-title">No products found</h3>
                <p class="empty-subtitle">Try a different search term or clear the filters.</p>
                <v-btn
                  color="primary"
                  variant="flat"
                  rounded="lg"
                  @click="clearFilters"
                >
                  <v-icon start>mdi-filter-off</v-icon>
                  Clear Filters
                </v-btn>
              </div>
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
import { ref, onMounted, computed } from 'vue';
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
const categoryItems = computed(() => [
  { _id: null, name: 'All Categories' },
  ...categories.value
]);

onMounted(async () => {
  loading.value = true;
  try {
    await productStore.fetchCategories();
    await productStore.fetchProducts();
    selectedCategory.value = null;
    searchTerm.value = productStore.filters.search || '';
    priceRange.value = [...(productStore.filters.priceRange || [0, 1000])];
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

function applyFilters() {
  productStore.setFilters({
    category: selectedCategory.value,
    search: searchTerm.value,
    priceRange: priceRange.value,
  });
}


function clearFilters() {
  selectedCategory.value = null;
  searchTerm.value = '';
  priceRange.value = [0, 1000];
  applyFilters();
}

function addToCart(product) {
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

