<template>
  <div 
    class="product-card"
    :style="{ animationDelay: `${index * 0.1}s` }"
  >
    <v-card 
      class="modern-product-card"
      elevation="0"
      @click="goToProduct"
    >
      <div class="product-image-wrapper">
        <v-img
          :src="product.image"
          :alt="product.name || product.title"
          aspect-ratio="1"
          class="product-image"
          cover
        >
          <div class="product-actions-overlay">
            <v-btn 
              icon 
              size="small" 
              class="action-btn wishlist-btn"
              @click.stop="toggleWishlist"
            >
              <v-icon :color="isWishlisted ? 'red' : 'white'">
                {{ isWishlisted ? 'mdi-heart' : 'mdi-heart-outline' }}
              </v-icon>
            </v-btn>
            <v-btn 
              icon 
              size="small" 
              class="action-btn share-btn"
              @click.stop="shareProduct"
            >
              <v-icon color="white">mdi-share-variant</v-icon>
            </v-btn>
          </div>

        </v-img>

        <div class="product-badges">
          <v-chip 
            v-if="product.rating?.rate > 4.5 || (product.rating && product.rating > 4.5)"
            size="small" 
            color="error" 
            class="product-badge bestseller"
          >
            🔥 Bestseller
          </v-chip>
          <v-chip 
            v-else-if="product.rating?.rate > 4 || (product.rating && product.rating > 4)"
            size="small" 
            color="warning" 
            class="product-badge popular"
          >
            ⭐ Popular
          </v-chip>
          <v-chip 
            v-if="isNewProduct"
            size="small" 
            color="success" 
            class="product-badge new"
          >
            ✨ New
          </v-chip>
        </div>

        <v-chip 
          v-if="discountPercentage > 0"
          size="small" 
          color="red-darken-2" 
          class="discount-badge"
        >
          -{{ discountPercentage }}%
        </v-chip>
      </div>

      <v-card-text class="product-info">
        <div class="product-category">
          {{ formatCategory(product.category) }}
        </div>

        <h3 class="product-title">
          {{ truncateTitle(product.name || product.title) }}
        </h3>

        <p class="product-description">
          {{ truncateDescription(product.description) }}
        </p>

        <div 
          v-if="product.rating" 
          class="product-rating-section"
        >
          <v-rating
            :model-value="getRatingValue()"
            readonly
            size="small"
            color="warning"
            density="compact"
            half-increments
            class="product-rating"
          ></v-rating>
          <span class="rating-text">
            ({{ getRatingCount() }} reviews)
          </span>
        </div>

        <div class="product-pricing">
          <div class="price-container">
            <span 
              v-if="originalPrice && originalPrice !== product.price"
              class="original-price"
            >
              ${{ originalPrice.toFixed(2) }}
            </span>
            <span class="current-price">
              ${{ getProductPrice().toFixed(2) }}
            </span>
          </div>
          
          <div class="stock-status">
            <v-chip 
              :color="stockStatus.color" 
              size="x-small" 
              variant="flat"
              class="stock-chip"
            >
              {{ stockStatus.text }}
            </v-chip>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="product-card-actions">
        <v-btn
          color="primary"
          variant="outlined"
          class="details-btn"
          @click.stop="goToProduct"
        >
          <v-icon left size="16">mdi-eye</v-icon>
          View Details
        </v-btn>
        
        <v-spacer></v-spacer>
        
        <v-btn
          color="primary"
          variant="elevated"
          class="cart-btn"
          @click.stop="handleAddToCart"
          :disabled="!userStore.isLoggedIn || userStore.isAdmin"
        >
          <v-icon size="18">mdi-cart-plus</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import '@/assets/styles/productcard.css'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['add-to-cart']);

const userStore = useUserStore();
const router = useRouter();

const isWishlisted = ref(false);

const isNewProduct = computed(() => {
  return Math.random() > 0.7; 
});

const discountPercentage = computed(() => {
  if (originalPrice.value && originalPrice.value > props.product.price) {
    return Math.round(((originalPrice.value - props.product.price) / originalPrice.value) * 100);
  }
  return 0;
});

const originalPrice = computed(() => {
  if (Math.random() > 0.6) {
    return props.product.price * 1.2;
  }
  return null;
});

const stockStatus = computed(() => {
  const random = Math.random();
  if (random > 0.8) {
    return { color: 'red', text: 'Low Stock' };
  } else if (random > 0.9) {
    return { color: 'grey', text: 'Out of Stock' };
  }
  return { color: 'green', text: 'In Stock' };
});

const truncateTitle = (title) => {
  if (!title) return '';
  return title.length > 45 ? title.substring(0, 45) + '...' : title;
};

const truncateDescription = (description) => {
  if (!description) return '';
  return description.length > 80 ? description.substring(0, 80) + '...' : description;
};

const formatCategory = (category) => {
  if (!category) return '';
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const getProductPrice = () => {
  return props.product.price || 0;
};

const getRatingValue = () => {
  if (props.product.rating?.rate) {
    return props.product.rating.rate;
  }
  if (typeof props.product.rating === 'number') {
    return props.product.rating;
  }
  return 0;
};


const goToProduct = () => {
  router.push(`/products/${props.product._id || props.product.id}`);
};

const handleAddToCart = () => {
  emit('add-to-cart', props.product);
};

const toggleWishlist = () => {
  isWishlisted.value = !isWishlisted.value;
};

const shareProduct = () => {
  console.log('Sharing product:', props.product.name || props.product.title);
};
</script>
