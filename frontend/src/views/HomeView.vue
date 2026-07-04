<template>
  <div class="home-container">

    <!-- ── HERO (unchanged) ── -->
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
              :style="{ animationDelay: `${index * 0.3}s` }"
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

    <!-- ── VALUE PROPS STRIP ── -->
    <section class="value-strip">
      <div class="value-strip-inner">
        <div class="value-item">
          <v-icon class="value-icon">mdi-truck-fast-outline</v-icon>
          <span class="value-label">Free Shipping</span>
        </div>
        <div class="value-item">
          <v-icon class="value-icon">mdi-refresh</v-icon>
          <span class="value-label">Easy Returns</span>
        </div>
        <div class="value-item">
          <v-icon class="value-icon">mdi-shield-check-outline</v-icon>
          <span class="value-label">Secure Payment</span>
        </div>
        <div class="value-item">
          <v-icon class="value-icon">mdi-headset</v-icon>
          <span class="value-label">24/7 Support</span>
        </div>
      </div>
    </section>

    <!-- ── FEATURED PRODUCTS ── -->
    <section
      ref="productsSection"
      class="featured-section"
      v-if="!loading && featuredProducts.length > 0"
      id="featured"
    >
      <div class="featured-header">
        <div>
          <p class="featured-eyebrow">Our Collection</p>
          <h2 class="featured-title">Featured Products</h2>
        </div>
        <v-btn
          variant="outlined"
          class="browse-btn"
          to="/products"
        >
          Browse All
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
      </div>

      <v-carousel
        height="460"
        show-arrows="hover"
        hide-delimiter-background
        class="dark-carousel"
        cycle
        interval="5000"
      >
        <v-carousel-item
          v-for="(chunk, idx) in productChunks"
          :key="idx"
        >
          <div class="dark-product-grid">
            <div
              v-for="product in chunk"
              :key="product._id || product.id"
              class="dark-product-card"
              @click="goToProduct(product._id || product.id)"
            >
              <div class="dark-card-image-wrap">
                <v-img
                  :src="product.image || `https://picsum.photos/seed/${product._id || product.id}/300/300`"
                  :alt="product.name || product.title"
                  aspect-ratio="1"
                  cover
                  class="dark-card-img"
                >
                  <template v-slot:placeholder>
                    <div class="dark-img-placeholder">
                      <v-progress-circular color="primary" indeterminate size="24"></v-progress-circular>
                    </div>
                  </template>
                </v-img>
                <div class="dark-card-overlay">
                  <v-btn size="small" rounded="pill" color="white" variant="elevated" class="overlay-view-btn">
                    <v-icon start size="14">mdi-eye</v-icon>
                    View Details
                  </v-btn>
                </div>
              </div>
              <div class="dark-card-info">
                <span class="dark-card-category">{{ formatCategory(product.category) }}</span>
                <h4 class="dark-card-title">{{ truncateTitle(product.name || product.title) }}</h4>
                <div class="dark-card-price-row">
                  <span class="dark-card-price">${{ Number(product.price || 0).toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </v-carousel-item>
      </v-carousel>
    </section>

    <!-- ── LOADING ── -->
    <section v-if="loading" class="loading-section">
      <div class="loading-container">
        <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
        <p class="loading-text">Loading amazing products...</p>
      </div>
    </section>

    <!-- ── EMPTY ── -->
    <section v-if="!loading && featuredProducts.length === 0" class="empty-section">
      <div class="empty-content">
        <v-icon size="80" color="grey-lighten-2">mdi-package-variant-closed</v-icon>
        <h3 class="empty-title">No Products Available</h3>
        <p class="empty-subtitle">Check back later for new products!</p>
        <v-btn color="primary" variant="outlined" class="retry-btn" @click="refreshProducts">
          <v-icon left>mdi-refresh</v-icon>
          Refresh
        </v-btn>
      </div>
    </section>

    <!-- ── BOTTOM CTA ── -->
    <section class="cta-dark-section">
      <div class="cta-dark-inner">
        <h2 class="cta-dark-title">
          Ready to Upgrade<br>Your Workspace?
        </h2>
        <p class="cta-dark-sub">
          Join thousands of customers who trust us for premium products at unbeatable prices.
        </p>
        <v-btn size="x-large" variant="outlined" class="cta-dark-btn" to="/products">
          Shop All Products
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
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

const productChunks = computed(() => {
  const chunks = [];
  for (let i = 0; i < featuredProducts.value.length; i += 5) {
    chunks.push(featuredProducts.value.slice(i, i + 5));
  }
  return chunks;
});

const refreshProducts = async () => {
  loading.value = true;
  try {
    await productStore.fetchProducts();
    featuredProducts.value = (productStore.products || []).slice(0, 8);
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
  const name = typeof category === 'object' ? category.name : category;
  if (!name) return 'General';
  return name.charAt(0).toUpperCase() + name.slice(1);
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
