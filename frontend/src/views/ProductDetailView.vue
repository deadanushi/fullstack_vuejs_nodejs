<template>
  <div class="product-detail-container">
    <div class="breadcrumb-section">
      <v-container>
        <v-btn
          prepend-icon="mdi-arrow-left"
          variant="text"
          to="/products"
          class="back-btn"
        >
          Back to Products
        </v-btn>
        
        <div class="breadcrumb-trail">
          <router-link to="/" class="breadcrumb-link">Home</router-link>
          <v-icon size="16" class="breadcrumb-separator">mdi-chevron-right</v-icon>
          <router-link to="/products" class="breadcrumb-link">Products</router-link>
          <v-icon size="16" class="breadcrumb-separator">mdi-chevron-right</v-icon>
          <span class="breadcrumb-current">{{ product?.name || product?.title || 'Product' }}</span>
        </div>
      </v-container>
    </div>

    <div v-if="loading" class="loading-container">
      <v-progress-circular 
        indeterminate 
        size="64" 
        color="primary"
        class="loading-spinner"
      ></v-progress-circular>
      <p class="loading-text">Loading product details...</p>
    </div>

    <div v-else-if="!product" class="not-found-container">
      <v-icon size="120" color="grey-lighten-2">mdi-package-variant-closed</v-icon>
      <h2 class="not-found-title">Product Not Found</h2>
      <p class="not-found-text">The product you're looking for doesn't exist or has been removed.</p>
      <v-btn 
        color="primary" 
        size="large"
        to="/products"
        class="back-to-products-btn"
      >
        <v-icon left>mdi-arrow-left</v-icon>
        Back to Products
      </v-btn>
    </div>

    <div v-else class="product-content">
      <v-container>
        <v-row class="product-main">
          <!-- Product Image Gallery -->
          <v-col cols="12" lg="6" md="6">
            <div class="image-gallery">
              <div class="main-image-container">
                <v-img
                  :src="product.image || 'https://picsum.photos/600/600'"
                  :alt="product.name || product.title"
                  aspect-ratio="1"
                  cover
                  class="main-product-image"
                >
                  <div class="image-actions">
                    <v-btn 
                      icon 
                      size="small" 
                      class="image-action-btn"
                      @click="toggleWishlist"
                    >
                      <v-icon :color="isWishlisted ? 'red' : 'white'">
                        {{ isWishlisted ? 'mdi-heart' : 'mdi-heart-outline' }}
                      </v-icon>
                    </v-btn>
                    <v-btn 
                      icon 
                      size="small" 
                      class="image-action-btn"
                      @click="shareProduct"
                    >
                      <v-icon color="white">mdi-share-variant</v-icon>
                    </v-btn>
                    <v-btn 
                      icon 
                      size="small" 
                      class="image-action-btn"
                      @click="openImageModal"
                    >
                      <v-icon color="white">mdi-magnify</v-icon>
                    </v-btn>
                  </div>

                  <div class="product-badges">
                    <v-chip 
                      v-if="product.rating?.rate > 4.5 || (product.rating && product.rating > 4.5)"
                      color="error" 
                      class="product-badge"
                    >
                      🔥 Bestseller
                    </v-chip>
                    <v-chip 
                      v-else-if="product.rating?.rate > 4 || (product.rating && product.rating > 4)"
                      color="warning" 
                      class="product-badge"
                    >
                      ⭐ Popular
                    </v-chip>
                  </div>
                </v-img>
              </div>

              <div class="thumbnail-gallery">
                <div 
                  v-for="i in 4" 
                  :key="i"
                  class="thumbnail-item"
                  :class="{ active: i === 1 }"
                >
                  <v-img
                    :src="product.image || 'https://picsum.photos/150/150'"
                    aspect-ratio="1"
                    cover
                    class="thumbnail-image"
                  ></v-img>
                </div>
              </div>
            </div>
          </v-col>

          <v-col cols="12" lg="6" md="6">
            <div class="product-info-section">
              <div class="product-category-badge">
                <v-chip 
                  color="primary" 
                  variant="flat"
                  class="category-chip"
                >
                  {{ formatCategory(product.category) }}
                </v-chip>
              </div>

              <h1 class="product-title">
                {{ product.name || product.title }}
              </h1>

              <div v-if="product.rating" class="rating-section">
                <v-rating
                  :model-value="getRatingValue()"
                  readonly
                  color="warning"
                  size="small"
                  density="comfortable"
                  half-increments
                  class="product-rating"
                ></v-rating>
                <span class="rating-text">
                  {{ getRatingValue().toFixed(1) }} ({{ getRatingCount() }} reviews)
                </span>
              </div>

              <div class="price-section">
                <div class="price-container">
                  <span class="current-price">${{ (product.price || 0).toFixed(2) }}</span>
                  <span v-if="originalPrice" class="original-price">
                    ${{ originalPrice.toFixed(2) }}
                  </span>
                  <v-chip 
                    v-if="discountPercentage > 0"
                    color="red" 
                    size="small"
                    class="discount-chip"
                  >
                    Save {{ discountPercentage }}%
                  </v-chip>
                </div>
              </div>

              <div class="description-section">
                <h3 class="section-title">Description</h3>
                <p class="product-description">
                  {{ product.description }}
                </p>
              </div>

              <div class="stock-section">
                <div class="stock-info">
                  <v-icon 
                    :color="stockStatus.color" 
                    class="stock-icon"
                  >
                    {{ stockStatus.icon }}
                  </v-icon>
                  <span 
                    :class="`stock-text text-${stockStatus.color}`"
                  >
                    {{ stockStatus.text }}
                  </span>
                </div>
              </div>

              <div class="purchase-section">
                <div class="quantity-selector">
                  <label class="quantity-label">Quantity</label>
                  <div class="quantity-controls">
                    <v-btn
                      icon
                      size="small"
                      variant="outlined"
                      @click="decreaseQuantity"
                      :disabled="quantity <= 1"
                      class="quantity-btn"
                    >
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                    <span class="quantity-display">{{ quantity }}</span>
                    <v-btn
                      icon
                      size="small"
                      variant="outlined"
                      @click="increaseQuantity"
                      :disabled="quantity >= maxStock"
                      class="quantity-btn"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </div>
                </div>

                <div class="action-buttons">
                  <v-btn
                    color="primary"
                    size="x-large"
                    class="add-to-cart-btn"
                    @click="addToCart"
                    :disabled="!userStore.isLoggedIn || userStore.isAdmin || !isInStock"
                  >
                    <v-icon left>mdi-cart-plus</v-icon>
                    Add to Cart - ${{ totalPrice.toFixed(2) }}
                  </v-btn>

                  <div class="secondary-actions">
                    <v-btn
                      variant="outlined"
                      color="primary"
                      size="large"
                      class="buy-now-btn"
                      @click="buyNow"
                      :disabled="!userStore.isLoggedIn || userStore.isAdmin || !isInStock"
                    >
                      <v-icon left>mdi-lightning-bolt</v-icon>
                      Buy Now
                    </v-btn>
                    
                    <v-btn
                      variant="text"
                      color="primary"
                      size="large"
                      class="wishlist-btn"
                      @click="toggleWishlist"
                    >
                      <v-icon left :color="isWishlisted ? 'red' : 'primary'">
                        {{ isWishlisted ? 'mdi-heart' : 'mdi-heart-outline' }}
                      </v-icon>
                      {{ isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist' }}
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
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
  return { color: 'success', icon: 'mdi-check-circle', text: 'In Stock' };
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
  if (!userStore.isLoggedIn) {
    toastStore.show({
      message: 'Please login to add items to cart',
      color: 'error'
    });
    return;
  }
  
  if (userStore.isAdmin) {
    toastStore.show({
      message: 'Admins cannot add items to cart',
      color: 'warning'
    });
    return;
  }

  cartStore.addToCart(product.value, quantity.value);
  toastStore.show({
    message: `${product.value.name || product.value.title} added to cart`,
    color: 'success'
  });
};

const buyNow = () => {
  addToCart();
  router.push('/cart');
};

const toggleWishlist = () => {
  isWishlisted.value = !isWishlisted.value;
  toastStore.show({
    message: isWishlisted.value 
      ? 'Added to wishlist' 
      : 'Removed from wishlist',
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
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const getRatingValue = () => {
  if (product.value?.rating?.rate) {
    return product.value.rating.rate;
  }
  if (typeof product.value?.rating === 'number') {
    return product.value.rating;
  }
  return 0;
};

const getRatingCount = () => {
  if (product.value?.rating?.count) {
    return product.value.rating.count;
  }
  return Math.floor(Math.random() * 500) + 10;
};

onMounted(async () => {
  await loadProduct();
  if (cartStore.loadCart) {
    cartStore.loadCart();
  }
});
</script>
