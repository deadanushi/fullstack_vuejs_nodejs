<template>
  <div class="pd-container">

    <!-- ── BREADCRUMB ── -->
    <div class="pd-breadcrumb">
      <v-container>
        <v-btn prepend-icon="mdi-arrow-left" variant="text" to="/products" class="pd-back-btn">
          Back to Products
        </v-btn>
        <div class="pd-breadcrumb-trail">
          <router-link to="/" class="pd-crumb-link">Home</router-link>
          <v-icon size="15" color="#cbd5e1">mdi-chevron-right</v-icon>
          <router-link to="/products" class="pd-crumb-link">Products</router-link>
          <v-icon size="15" color="#cbd5e1">mdi-chevron-right</v-icon>
          <span class="pd-crumb-current">{{ product?.name || product?.title || 'Product' }}</span>
        </div>
      </v-container>
    </div>

    <!-- ── LOADING ── -->
    <div v-if="loading" class="pd-loading">
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
      <p class="pd-loading-text">Loading product details...</p>
    </div>

    <!-- ── NOT FOUND ── -->
    <div v-else-if="!product" class="pd-not-found">
      <v-icon size="120" color="grey-lighten-2">mdi-package-variant-closed</v-icon>
      <h2 class="pd-nf-title">Product Not Found</h2>
      <p class="pd-nf-text">The product you're looking for doesn't exist or has been removed.</p>
      <v-btn color="primary" size="large" to="/products" class="pd-nf-btn">
        <v-icon left>mdi-arrow-left</v-icon>
        Back to Products
      </v-btn>
    </div>

    <!-- ── MAIN CONTENT ── -->
    <div v-else class="pd-content">
      <v-container>
        <v-row class="pd-main-row">

          <!-- IMAGE COLUMN -->
          <v-col cols="12" lg="5" md="6">
            <!-- Main image card -->
            <div class="pd-image-card">
              <v-img
                :src="product.image || 'https://picsum.photos/600/600'"
                :alt="product.name || product.title"
                aspect-ratio="1"
                cover
                class="pd-main-img"
              ></v-img>

              <!-- Overlay actions (visible on hover) -->
              <div class="pd-img-actions">
                <v-btn icon size="small" class="pd-action-btn" @click="toggleWishlist">
                  <v-icon :color="isWishlisted ? 'red' : '#2563EB'">
                    {{ isWishlisted ? 'mdi-heart' : 'mdi-heart-outline' }}
                  </v-icon>
                </v-btn>
                <v-btn icon size="small" class="pd-action-btn" @click="shareProduct">
                  <v-icon color="#2563EB">mdi-share-variant</v-icon>
                </v-btn>
                <v-btn icon size="small" class="pd-action-btn" @click="openImageModal">
                  <v-icon color="#2563EB">mdi-magnify</v-icon>
                </v-btn>
              </div>

              <!-- Bestseller / Popular badges -->
              <div class="pd-badges">
                <v-chip
                  v-if="product.rating?.rate > 4.5 || (product.rating && product.rating > 4.5)"
                  color="error"
                  size="small"
                  class="pd-badge"
                >🔥 Bestseller</v-chip>
                <v-chip
                  v-else-if="product.rating?.rate > 4 || (product.rating && product.rating > 4)"
                  color="warning"
                  size="small"
                  class="pd-badge"
                >⭐ Popular</v-chip>
              </div>
            </div>

            <!-- Specs card below image -->
            <div class="pd-specs-card">
              <h3 class="pd-specs-title">Product Specifications</h3>
              <div class="pd-spec-row">
                <span class="pd-spec-label">Category</span>
                <span class="pd-spec-value">{{ formatCategory(product.category) }}</span>
              </div>
              <div class="pd-spec-row">
                <span class="pd-spec-label">Stock Level</span>
                <span class="pd-spec-value pd-spec-blue">{{ product.stock ?? 'N/A' }} units available</span>
              </div>
              <div class="pd-spec-row pd-spec-row--last">
                <span class="pd-spec-label">Status</span>
                <span class="pd-spec-value">{{ stockStatus.text }}</span>
              </div>
            </div>
          </v-col>

          <!-- INFO COLUMN -->
          <v-col cols="12" lg="7" md="6">
            <div class="pd-info">

              <!-- Category chip -->
              <div class="pd-category-wrap">
                <v-chip color="primary" variant="tonal" size="small" class="pd-cat-chip">
                  {{ formatCategory(product.category) }}
                </v-chip>
              </div>

              <!-- Title -->
              <h1 class="pd-title">{{ product.name || product.title }}</h1>

              <!-- Rating -->
              <div v-if="product.rating" class="pd-rating-row">
                <v-rating
                  :model-value="getRatingValue()"
                  readonly
                  color="warning"
                  size="small"
                  density="comfortable"
                  half-increments
                  class="pd-rating"
                ></v-rating>
                <span class="pd-rating-text">
                  {{ getRatingValue().toFixed(1) }} ({{ getRatingCount() }} reviews)
                </span>
              </div>

              <!-- Price -->
              <div class="pd-price-block">
                <span class="pd-price">${{ (product.price || 0).toFixed(2) }}</span>
                <span v-if="originalPrice" class="pd-original-price">
                  ${{ originalPrice.toFixed(2) }}
                </span>
                <v-chip v-if="discountPercentage > 0" color="red" size="small" class="pd-discount-chip">
                  Save {{ discountPercentage }}%
                </v-chip>
              </div>
              <p class="pd-price-note">Tax included. Shipping calculated at checkout.</p>

              <!-- Description -->
              <p class="pd-description">{{ product.description }}</p>

              <!-- Stock badge -->
              <div class="pd-stock-badge">
                <span class="pd-stock-dot" :class="`pd-stock-dot--${stockStatus.color}`"></span>
                <span class="pd-stock-label" :class="`pd-stock-label--${stockStatus.color}`">
                  {{ stockStatus.text }}
                </span>
              </div>

              <!-- Quantity selector -->
              <div class="pd-qty-row">
                <span class="pd-qty-label">Quantity:</span>
                <div class="pd-qty-controls">
                  <v-btn icon size="small" variant="text" class="pd-qty-btn" @click="decreaseQuantity" :disabled="quantity <= 1">
                    <v-icon size="18">mdi-minus</v-icon>
                  </v-btn>
                  <span class="pd-qty-display">{{ quantity }}</span>
                  <v-btn icon size="small" variant="text" class="pd-qty-btn" @click="increaseQuantity" :disabled="quantity >= maxStock">
                    <v-icon size="18">mdi-plus</v-icon>
                  </v-btn>
                </div>
              </div>

              <!-- Action buttons -->
              <div class="pd-actions">
                <v-btn
                  color="primary"
                  size="x-large"
                  class="pd-cart-btn"
                  @click="addToCart"
                  :disabled="userStore.isAdmin || !isInStock"
                  block
                >
                  <v-icon start>mdi-cart-plus</v-icon>
                  Add to Cart — ${{ totalPrice.toFixed(2) }}
                </v-btn>

                <div class="pd-secondary-actions">
                  <v-btn
                    variant="outlined"
                    color="primary"
                    size="large"
                    class="pd-buy-btn"
                    @click="buyNow"
                    :disabled="userStore.isAdmin || !isInStock"
                  >
                    <v-icon start>mdi-lightning-bolt</v-icon>
                    Buy Now
                  </v-btn>

                  <v-btn
                    variant="text"
                    size="large"
                    class="pd-wishlist-btn"
                    @click="toggleWishlist"
                  >
                    <v-icon start :color="isWishlisted ? 'red' : '#64748B'">
                      {{ isWishlisted ? 'mdi-heart' : 'mdi-heart-outline' }}
                    </v-icon>
                    {{ isWishlisted ? 'Wishlisted' : 'Wishlist' }}
                  </v-btn>
                </div>
              </div>

            </div>
          </v-col>
        </v-row>

        <!-- ── KEY FEATURES BENTO ── -->
        <div class="pd-features-section">
          <h2 class="pd-features-title">Why Shop With Us</h2>
          <div class="pd-features-grid">
            <div class="pd-feature-card pd-feature-card--accent">
              <v-icon class="pd-feat-icon" color="#2563EB">mdi-medal-outline</v-icon>
              <h4 class="pd-feat-title">Quality Guarantee</h4>
              <p class="pd-feat-desc">Every product is verified for quality and authenticity before it reaches you.</p>
            </div>
            <div class="pd-feature-card">
              <v-icon class="pd-feat-icon" color="#2563EB">mdi-truck-fast-outline</v-icon>
              <h4 class="pd-feat-title">Fast Delivery</h4>
              <p class="pd-feat-desc">Express shipping available. Most orders arrive within 2–5 business days.</p>
            </div>
            <div class="pd-feature-card">
              <v-icon class="pd-feat-icon" color="#2563EB">mdi-refresh</v-icon>
              <h4 class="pd-feat-title">Easy Returns</h4>
              <p class="pd-feat-desc">30-day hassle-free returns. No questions asked, full refund guaranteed.</p>
            </div>
          </div>
        </div>

      </v-container>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '../stores/product';
import { useCartStore } from '../stores/cart';
import { useUserStore } from '../stores/user';
import { useToastStore } from '../stores/toast';
import '@/assets/styles/prodDetail.css'

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();
const userStore = useUserStore();
const toastStore = useToastStore();

const loading = ref(true);
const product = ref(null);
const quantity = ref(1);
const isWishlisted = ref(false);

const maxStock = computed(() => product.value?.stock || 99);
const isInStock = computed(() => (product.value?.stock || 1) > 0);

const totalPrice = computed(() => {
  return (product.value?.price || 0) * quantity.value;
});

const originalPrice = computed(() => {
  if (Math.random() > 0.7) {
    return (product.value?.price || 0) * 1.25;
  }
  return null;
});

const discountPercentage = computed(() => {
  if (originalPrice.value && product.value?.price) {
    return Math.round(((originalPrice.value - product.value.price) / originalPrice.value) * 100);
  }
  return 0;
});

const stockStatus = computed(() => {
  const stock = product.value?.stock || 0;
  if (stock === 0) {
    return { color: 'error', icon: 'mdi-close-circle', text: 'Out of Stock' };
  } else if (stock < 10) {
    return { color: 'warning', icon: 'mdi-alert-circle', text: `Only ${stock} left in stock` };
  }
  return { color: 'success', icon: 'mdi-check-circle', text: 'In Stock & Ready to Ship' };
});

const loadProduct = async () => {
  loading.value = true;
  try {
    await productStore.fetchProducts();
    product.value = productStore.products.find(p =>
      (p._id || p.id) === route.params.id
    );
  } catch (error) {
    console.error('Error loading product:', error);
  } finally {
    loading.value = false;
  }
};

const increaseQuantity = () => {
  if (quantity.value < maxStock.value) {
    quantity.value++;
  }
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const addToCart = () => {
  if (userStore.isAdmin) {
    toastStore.show({ message: 'Admins cannot add items to cart', color: 'warning' });
    return;
  }
  cartStore.addToCart(product.value, quantity.value);
  toastStore.show({ message: `${product.value.name || product.value.title} added to cart`, color: 'success' });
};

const buyNow = () => {
  addToCart();
  router.push('/cart');
};

const toggleWishlist = () => {
  isWishlisted.value = !isWishlisted.value;
  toastStore.show({
    message: isWishlisted.value ? 'Added to wishlist' : 'Removed from wishlist',
    color: 'info'
  });
};

const shareProduct = () => {
  console.log('Sharing product');
};

const openImageModal = () => {
  console.log('Opening image modal');
};

const formatCategory = (category) => {
  if (!category) return '';
  const name = typeof category === 'object' ? category.name : category;
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const getRatingValue = () => {
  if (product.value?.rating?.rate) return product.value.rating.rate;
  if (typeof product.value?.rating === 'number') return product.value.rating;
  return 0;
};

const getRatingCount = () => {
  if (product.value?.rating?.count) return product.value.rating.count;
  return Math.floor(Math.random() * 500) + 10;
};

onMounted(async () => {
  await loadProduct();
  if (cartStore.loadCart) {
    cartStore.loadCart();
  }
});
</script>
