<template>
  <div class="home-container">
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            Discover Amazing
            <span class="gradient-text">Products</span>
          </h1>
          <p class="hero-subtitle">
            Explore our curated collection of premium items designed to elevate your lifestyle
          </p>
          <div class="cta-buttons">
            <v-btn 
              size="large" 
              class="cta-primary"
              @click="scrollToProducts"
            >
              <v-icon left>mdi-rocket-launch</v-icon>
              Explore Collection
            </v-btn>
            <v-btn 
              size="large" 
              variant="outlined" 
              class="cta-secondary"
              @click="$router.push('/products')"
            >
              <v-icon left>mdi-shopping</v-icon>
              Shop All
            </v-btn>
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="floating-cards">
            <div 
              v-for="(product, index) in featuredProducts.slice(0, 3)"   
              :key="product._id || product.id"
              class="floating-card"
              :style="{ 
                animationDelay: `${index * 0.3}s`
              }"
            >
              <v-img
                :src="product.image || `https://picsum.photos/200/200?random=${product._id || product.id}`"
                :alt="product.name || product.title"
                aspect-ratio="1"
                class="floating-card-image"
              ></v-img>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section 
      ref="productsSection" 
      class="carousel-section" 
      v-if="!loading && featuredProducts.length > 0"
    >
      <div class="section-header">
        <h2 class="section-title">Featured Products</h2>
        <p class="section-subtitle">Discover our most popular items</p>
      </div>
      
      <v-carousel 
        height="450" 
        show-arrows="hover"
        hide-delimiter-background
        class="modern-carousel"
        cycle
        interval="4000"
      >
        <v-carousel-item
          v-for="(chunk, index) in productChunks"
          :key="index"
          class="carousel-slide"
        >
          <div class="carousel-content">
            <div class="product-grid">
              <v-card
                v-for="product in chunk"
                :key="product._id || product.id"
                class="product-carousel-card"
                elevation="0"
                @click="goToProduct(product._id || product.id)"
              >
                <div class="product-image-container">
                  <v-img
                    :src="product.image || `https://picsum.photos/280/280?random=${product._id || product.id}`"
                    :alt="product.name || product.title"
                    aspect-ratio="1"
                    class="product-carousel-image"
                    cover
                  >
                    <template v-slot:placeholder>
                      <div class="image-placeholder">
                        <v-progress-circular
                          color="primary"
                          indeterminate
                          size="40"
                        ></v-progress-circular>
                      </div>
                    </template>
                    <template v-slot:error>
                      <div class="image-error">
                        <v-icon size="40" color="grey-lighten-2">mdi-image-broken</v-icon>
                      </div>
                    </template>
                  </v-img>
                  
                  <div class="product-hover-overlay">
                    <v-btn
                      color="primary"
                      variant="elevated"
                      class="view-product-btn"
                      @click.stop="goToProduct(product._id || product.id)"
                    >
                      <v-icon left size="16">mdi-eye</v-icon>
                      View Product
                    </v-btn>
                  </div>
                </div>
                
                <v-card-text class="product-carousel-info">
                  <div class="product-category">
                    {{ formatCategory(product.category) }}
                  </div>
                  <h4 class="product-carousel-title">
                    {{ truncateTitle(product.name || product.title) }}
                  </h4>
                  <div class="product-price-section">
                    <span class="product-carousel-price">
                      ${{ Number(product.price || 0).toFixed(2) }}
                    </span>
                    <v-chip
                      size="x-small"
                      color="success"
                      variant="tonal"
                      class="stock-chip"
                    >
                      In Stock
                    </v-chip>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </v-carousel-item>
      </v-carousel>
    </section>

    <section v-if="loading" class="loading-section">
      <div class="loading-container">
        <v-progress-circular
          color="primary"
          indeterminate
          size="64"
        ></v-progress-circular>
        <p class="loading-text">Loading amazing products...</p>
      </div>
    </section>

    <section v-if="!loading && featuredProducts.length === 0" class="empty-section">
      <div class="empty-content">
        <v-icon size="80" color="grey-lighten-2">mdi-package-variant-closed</v-icon>
        <h3 class="empty-title">No Products Available</h3>
        <p class="empty-subtitle">Check back later for new products!</p>
        <v-btn 
          color="primary" 
          variant="outlined"
          class="retry-btn"
          @click="refreshProducts"
        >
          <v-icon left>mdi-refresh</v-icon>
          Refresh
        </v-btn>
      </div>
    </section>

    <section class="cta-section">
      <div class="cta-content">
        <h2 class="cta-title">Ready to Shop?</h2>
        <p class="cta-subtitle">Explore our full collection and find exactly what you're looking for</p>
        <v-btn 
          size="x-large" 
          class="final-cta"
          to="/products"
        >
          <v-icon left>mdi-shopping</v-icon>
          Browse All Products
        </v-btn>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '../stores/product';
import { useToastStore } from '../stores/toast';
import '@/assets/styles/home.css'

const router = useRouter();
const productStore = useProductStore();
const toastStore = useToastStore();

const loading = ref(false);
const featuredProducts = ref([]);
const productsSection = ref(null);

const productChunks = ref([]);

const computedProductChunks = computed(() => {
  const chunks = [];
  if (featuredProducts.value) {
    for (let i = 0; i < featuredProducts.value.length; i += 3) {
      chunks.push(featuredProducts.value.slice(i, i + 3));
    }
  }
  return chunks;
});

const refreshProducts = async () => {
  loading.value = true;
  try {
    await productStore.fetchProducts();
    featuredProducts.value = (productStore.products || []).slice(0, 9); 
    productChunks.value = computedProductChunks.value;
  } catch (error) {
    console.error('Error fetching products:', error);
    toastStore.show({
      message: 'Failed to load products. Please try again.',
      color: 'error'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await refreshProducts();
});

const truncateTitle = (title) => {
  if (!title) return 'Untitled Product';
  return title.length > 30 ? title.substring(0, 30) + '...' : title;
};

const formatCategory = (category) => {
  if (!category) return 'General';
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const goToProduct = (productId) => {
  if (productId) {
    router.push(`/products/${productId}`);
  }
};

const scrollToProducts = () => {
  if (productsSection.value) {
    productsSection.value.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

