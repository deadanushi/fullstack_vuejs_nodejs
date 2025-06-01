<!-- Cart Page Usage Example -->
<template>
  <div class="cart-container">
    <section class="cart-hero">
      <div class="hero-content">
        <h1 class="hero-title">
          Your <span class="gradient-text">Shopping Cart</span>
        </h1>
        <p class="hero-subtitle">
          Review your items and proceed to checkout
        </p>
      </div>
    </section>

    <div class="cart-content">
      <v-container fluid class="px-6">
        <div v-if="cartItems.length === 0" class="empty-cart">
          <div class="empty-cart-content">
            <v-icon size="120" color="grey-lighten-2">mdi-cart-remove</v-icon>
            <h2 class="empty-title">Your cart is empty</h2>
            <p class="empty-subtitle">
              Start shopping to add items to your cart
            </p>
            <v-btn
              color="primary"
              size="x-large"
              to="/products"
              class="continue-shopping-btn"
            >
              <v-icon left>mdi-shopping</v-icon>
              Start Shopping
            </v-btn>
          </div>
        </div>

        <v-row v-else class="cart-layout">
          <v-col cols="12" lg="8" md="7">
            <v-card class="cart-items-card" elevation="0">
              <v-card-title class="cart-items-title">
                <v-icon left color="primary">mdi-cart</v-icon>
                Cart Items ({{ cartItems.length }})
              </v-card-title>
              
              <v-card-text class="cart-items-content">
                <div 
                  v-for="item in cartItems" 
                  :key="item.id || item._id"
                  class="cart-item"
                >
                  <div class="item-image">
                    <v-img
                      :src="item.image || `https://picsum.photos/80/80?random=${item.id}`"
                      :alt="item.name || item.title"
                      aspect-ratio="1"
                      cover
                    ></v-img>
                  </div>
                  
                  <div class="item-details">
                    <h3 class="item-name">{{ item.name || item.title }}</h3>
                    <p class="item-description">{{ item.description || 'Premium quality item' }}</p>
                    <div class="item-price">${{ (item.price || 0).toFixed(2) }}</div>
                  </div>

                  <div class="item-actions">
                    <div class="quantity-controls">
                      <v-btn
                        icon="mdi-minus"
                        size="small"
                        variant="outlined"
                        @click="decreaseQuantity(item)"
                        :disabled="(item.quantity || 1) <= 1"
                      ></v-btn>
                      <span class="quantity">{{ item.quantity || 1 }}</span>
                      <v-btn
                        icon="mdi-plus"
                        size="small"
                        variant="outlined"
                        @click="increaseQuantity(item)"
                      ></v-btn>
                    </div>
                    
                    <v-btn
                      icon="mdi-delete"
                      size="small"
                      color="error"
                      variant="text"
                      @click="removeItem(item)"
                    ></v-btn>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" lg="4" md="5">
            <OrderSummary
              :order-items="formattedCartItems"
              :shipping-cost="0"
              :discount="discount"
              discount-code="CART10"
              :tax-rate="0.08"
              :is-loading="checkoutLoading"
              @place-order="proceedToCheckout"
            />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useToastStore } from '../stores/toast';
import OrderSummary from '../components/OrderSummary.vue';
import '@/assets/styles/cartView.css'

const router = useRouter();
const cartStore = useCartStore();
const toastStore = useToastStore();

const checkoutLoading = ref(false);

const cartItems = computed(() => cartStore.items || []);
const discount = computed(() => {
  const subtotal = cartItems.value.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
  return subtotal > 100 ? subtotal * 0.1 : 0; 
});

const formattedCartItems = computed(() => {
  return cartItems.value.map(item => ({
    id: item._id || item.id,
    name: item.name || item.title,
    quantity: item.quantity || 1,
    price: item.price || 0,
    image: item.image || `https://picsum.photos/60/60?random=${item.id}`
  }));
});

const increaseQuantity = (item) => {
  if (cartStore.updateQuantity) {
    cartStore.updateQuantity(item.id || item._id, (item.quantity || 1) + 1);
  }
  toastStore.show({
    message: `Updated ${item.name || item.title} quantity`,
    color: 'success',
    timeout: 2000
  });
};

const decreaseQuantity = (item) => {
  if ((item.quantity || 1) > 1 && cartStore.updateQuantity) {
    cartStore.updateQuantity(item.id || item._id, (item.quantity || 1) - 1);
    toastStore.show({
      message: `Updated ${item.name || item.title} quantity`,
      color: 'success',
      timeout: 2000
    });
  }
};

const removeItem = (item) => {
  if (cartStore.removeFromCart) {
    cartStore.removeFromCart(item.id || item._id);
  }
  toastStore.show({
    message: `Removed ${item.name || item.title} from cart`,
    color: 'info',
    timeout: 3000
  });
};

const proceedToCheckout = async (orderData) => {
  checkoutLoading.value = true;
  
  try {
    console.log('Order data:', orderData); 
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toastStore.show({
      message: 'Proceeding to checkout...',
      color: 'info',
      timeout: 2000
    });
    
    router.push('/checkout');
  } catch (error) {
    toastStore.show({
      message: 'Error proceeding to checkout. Please try again.',
      color: 'error'
    });
  } finally {
    checkoutLoading.value = false;
  }
};
</script>

