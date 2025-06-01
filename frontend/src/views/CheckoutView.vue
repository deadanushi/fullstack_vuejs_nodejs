<template>
  <div class="checkout-container">
    <!-- Hero Header -->
    <section class="checkout-hero">
      <div class="hero-content">
        <h1 class="hero-title">
          Complete Your <span class="gradient-text">Order</span>
        </h1>
        <p class="hero-subtitle">
          Just a few more steps to get your products delivered
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <div class="checkout-content">
      <v-container fluid class="px-6">
        <!-- Authentication Check -->
        <div v-if="!isLoggedIn" class="auth-required">
          <v-card class="auth-card" elevation="0">
            <div class="auth-content">
              <v-icon size="80" color="warning">mdi-account-alert</v-icon>
              <h2 class="auth-title">Authentication Required</h2>
              <p class="auth-subtitle">Please log in to continue with your checkout</p>
              <v-btn
                color="primary"
                size="large"
                class="auth-btn"
                @click="$router.push('/login')"
              >
                <v-icon left>mdi-login</v-icon>
                Log In to Continue
              </v-btn>
            </div>
          </v-card>
        </div>

        <!-- Checkout Form -->
        <v-row v-else class="checkout-layout">
          <!-- Left Column - Forms -->
          <v-col cols="12" lg="8" md="7">
            <div class="checkout-forms">
              <!-- Order Summary -->
              <v-card class="checkout-card order-summary-card" elevation="0">
                <div class="card-header">
                  <div class="section-indicator">
                    <div class="section-icon">
                      <v-icon color="white">mdi-cart</v-icon>
                    </div>
                    <div class="section-info">
                      <h3 class="section-title">Order Review</h3>
                      <p class="section-subtitle">{{ cartStore.items.length }} item(s) in your cart</p>
                    </div>
                  </div>
                </div>

                <v-card-text class="form-content">
                  <div v-if="cartStore.items.length > 0" class="order-items">
                    <div
                      v-for="item in cartStore.items"
                      :key="item._id"
                      class="order-item"
                    >
                      <div class="item-image">
                        <v-avatar size="60" rounded="12">
                          <v-img 
                            :src="item.image || item.imageUrl || `https://picsum.photos/60/60?random=${item._id}`" 
                            :alt="item.name"
                            cover
                          ></v-img>
                        </v-avatar>
                      </div>
                      <div class="item-details">
                        <h4 class="item-name">{{ item.name }}</h4>
                        <p class="item-price">${{ item.price.toFixed(2) }} each</p>
                        <p class="item-quantity">Quantity: {{ item.quantity }}</p>
                      </div>
                      <div class="item-total">
                        ${{ (item.price * item.quantity).toFixed(2) }}
                      </div>
                    </div>
                  </div>
                  
                  <v-alert v-else type="warning" class="empty-cart-alert">
                    <v-icon start>mdi-cart-remove</v-icon>
                    Your cart is empty. Add some items before checkout.
                  </v-alert>
                  
                  <v-divider class="my-4"></v-divider>
                  
                  <div class="order-total">
                    <div class="total-line">
                      <span class="total-label">Total Amount</span>
                      <span class="total-value">${{ cartStore.totalPrice.toFixed(2) }}</span>
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Shipping Address Form -->
              <v-card class="checkout-card shipping-card" elevation="0">
                <div class="card-header">
                  <div class="section-indicator">
                    <div class="section-icon">
                      <v-icon color="white">mdi-truck</v-icon>
                    </div>
                    <div class="section-info">
                      <h3 class="section-title">Shipping Address</h3>
                      <p class="section-subtitle">Where should we deliver your order?</p>
                    </div>
                  </div>
                </div>

                <v-card-text class="form-content">
                  <v-form ref="shippingForm" v-model="shippingValid">
                    <div class="form-group">
                      <label class="form-label">Full Name</label>
                      <v-text-field
                        v-model="shippingDetails.fullName"
                        placeholder="Enter your full name"
                        variant="outlined"
                        density="comfortable"
                        class="modern-input"
                        prepend-inner-icon="mdi-account-outline"
                        :rules="[rules.required, rules.fullName]"
                        hint="Please enter both first and last name"
                      ></v-text-field>
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label">Street Address</label>
                      <v-text-field
                        v-model="shippingDetails.address"
                        placeholder="Enter your street address"
                        variant="outlined"
                        density="comfortable"
                        class="modern-input"
                        prepend-inner-icon="mdi-home-outline"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </div>
                    
                    <v-row>
                      <v-col cols="12" md="6">
                        <div class="form-group">
                          <label class="form-label">City</label>
                          <v-text-field
                            v-model="shippingDetails.city"
                            placeholder="Enter your city"
                            variant="outlined"
                            density="comfortable"
                            class="modern-input"
                            prepend-inner-icon="mdi-city"
                            :rules="[rules.required]"
                          ></v-text-field>
                        </div>
                      </v-col>
                      <v-col cols="12" md="6">
                        <div class="form-group">
                          <label class="form-label">ZIP Code</label>
                          <v-text-field
                            v-model="shippingDetails.zipCode"
                            placeholder="Enter ZIP code"
                            variant="outlined"
                            density="comfortable"
                            class="modern-input"
                            prepend-inner-icon="mdi-mailbox"
                            :rules="[rules.required]"
                          ></v-text-field>
                        </div>
                      </v-col>
                    </v-row>
                    
                    <div class="form-group">
                      <label class="form-label">Phone Number (Optional)</label>
                      <v-text-field
                        v-model="shippingDetails.phone"
                        placeholder="Enter your phone number"
                        variant="outlined"
                        density="comfortable"
                        class="modern-input"
                        prepend-inner-icon="mdi-phone-outline"
                        type="tel"
                      ></v-text-field>
                    </div>
                  </v-form>
                </v-card-text>
              </v-card>

              <!-- Payment Method -->
              <v-card class="checkout-card payment-card" elevation="0">
                <div class="card-header">
                  <div class="section-indicator">
                    <div class="section-icon">
                      <v-icon color="white">mdi-credit-card</v-icon>
                    </div>
                    <div class="section-info">
                      <h3 class="section-title">Payment Method</h3>
                      <p class="section-subtitle">Choose your preferred payment option</p>
                    </div>
                  </div>
                </div>

                <v-card-text class="form-content">
                  <div class="payment-methods">
                    <div 
                      v-for="method in paymentOptions" 
                      :key="method.value"
                      class="payment-option"
                      :class="{ active: paymentMethod === method.value }"
                      @click="paymentMethod = method.value"
                    >
                      <v-radio
                        :value="method.value"
                        v-model="paymentMethod"
                        class="payment-radio"
                      ></v-radio>
                      <div class="payment-info">
                        <v-icon :color="method.color" class="payment-icon">{{ method.icon }}</v-icon>
                        <div class="payment-details">
                          <h4 class="payment-title">{{ method.title }}</h4>
                          <p class="payment-description">{{ method.description }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-col>

          <!-- Right Column - Order Summary Sidebar -->
          <v-col cols="12" lg="4" md="5">
            <div class="summary-sticky">
              <v-card class="summary-card" elevation="0">
                <div class="summary-header">
                  <h3 class="summary-title">
                    <v-icon left color="primary">mdi-receipt-text</v-icon>
                    Order Summary
                  </h3>
                </div>

                <v-card-text class="summary-content">
                  <!-- Pricing Breakdown -->
                  <div class="pricing-breakdown">
                    <div class="price-line">
                      <span class="label">Subtotal</span>
                      <span class="value">${{ cartStore.totalPrice.toFixed(2) }}</span>
                    </div>
                    <div class="price-line">
                      <span class="label">Shipping</span>
                      <span class="value shipping-free">Free</span>
                    </div>
                  </div>

                  <v-divider class="my-4"></v-divider>

                  <!-- Total -->
                  <div class="total-section">
                    <div class="total-line">
                      <span class="total-label">Total</span>
                      <span class="total-value">${{ cartStore.totalPrice.toFixed(2) }}</span>
                    </div>
                  </div>

                  <!-- User Info -->
                  <v-divider class="my-4"></v-divider>
                  <div class="user-info">
                    <h4 class="user-info-title">Account Information</h4>
                    <p class="user-name">{{ userStore.user?.name || userStore.user?.email || 'User' }}</p>
                    <p class="user-id">ID: {{ userStore.user?._id }}</p>
                  </div>
                </v-card-text>
                
                <!-- Place Order Button -->
                <v-card-actions class="summary-actions">
                  <v-btn
                    color="primary"
                    size="x-large"
                    block
                    class="place-order-btn"
                    :disabled="!canPlaceOrder"
                    :loading="orderStore.loading"
                    @click="placeOrder"
                  >
                    <v-icon left v-if="!orderStore.loading">mdi-credit-card-check</v-icon>
                    {{ orderStore.loading ? 'Processing...' : 'Place Order' }}
                  </v-btn>

                  <!-- Security Info -->
                  <div class="security-info">
                    <div class="security-badges">
                      <div class="security-item">
                        <v-icon color="success" size="16">mdi-lock</v-icon>
                        <span>SSL Encrypted</span>
                      </div>
                      <div class="security-item">
                        <v-icon color="info" size="16">mdi-shield-check</v-icon>
                        <span>Secure Payment</span>
                      </div>
                    </div>
                  </div>
                </v-card-actions>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useOrderStore } from '../stores/order';
import { useUserStore } from '../stores/user';
import { useToastStore } from '../stores/toast';

const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();
const userStore = useUserStore();
const toastStore = useToastStore();

// Form refs and validation
const shippingForm = ref(null);
const shippingValid = ref(false);

// Form data
const shippingDetails = ref({
  fullName: '',
  address: '',
  city: '',
  zipCode: '',
  phone: ''
});

const paymentMethod = ref('');

// Payment options
const paymentOptions = [
  {
    value: 'creditCard',
    title: 'Credit Card',
    description: 'Visa, Mastercard, American Express',
    icon: 'mdi-credit-card',
    color: 'primary'
  },
  {
    value: 'paypal',
    title: 'PayPal',
    description: 'Pay with your PayPal account',
    icon: 'mdi-paypal',
    color: 'blue'
  },
  {
    value: 'cashOnDelivery',
    title: 'Cash on Delivery',
    description: 'Pay when you receive your order',
    icon: 'mdi-cash',
    color: 'green'
  }
];

// Validation rules
const rules = {
  required: value => !!value || 'This field is required',
  fullName: value => {
    if (!value) return 'Full name is required'
    const parts = value.trim().split(' ')
    return parts.length >= 2 || 'Please enter both first and last name'
  }
};

// Computed properties
const isLoggedIn = ref(false);
const canPlaceOrder = computed(() => {
  return shippingValid.value && 
         paymentMethod.value && 
         cartStore.items.length > 0 &&
         isLoggedIn.value;
});

// Methods
const validateForm = async () => {
  if (!shippingForm.value) return false;
  
  const { valid } = await shippingForm.value.validate();
  return valid;
};

const validateShippingDetails = () => {
  const required = ['fullName', 'address', 'city', 'zipCode'];
  const isValid = required.every(field => shippingDetails.value[field]?.trim());
  
  // Also validate that fullName has at least 2 parts
  const nameParts = shippingDetails.value.fullName?.trim().split(' ') || [];
  const hasValidName = nameParts.length >= 2;
  
  return isValid && hasValidName;
};

onMounted(() => {
  // Check authentication
  userStore.checkAuth();
  isLoggedIn.value = userStore.isLoggedIn;
  
  // Load cart items
  cartStore.loadCart();
  
  // Check if cart is empty
  if (cartStore.items.length === 0) {
    toastStore.show({
      message: 'Your cart is empty. Add some items before checkout.',
      color: 'warning'
    });
    router.push('/products');
  }

  // Pre-fill shipping details if available
  if (userStore.user) {
    shippingDetails.value.fullName = userStore.user.name || userStore.user.fullName || '';
  }
});

const placeOrder = async () => {
  try {
    // Check authentication first
    if (!isLoggedIn.value) {
      toastStore.show({
        message: 'Please log in to place an order',
        color: 'error'
      });
      router.push('/login');
      return;
    }

    // Validate form
    const isValid = await validateForm();
    if (!isValid || !validateShippingDetails()) {
      toastStore.show({
        message: 'Please fill in all required fields correctly',
        color: 'error'
      });
      return;
    }

    // Check if cart has items
    if (cartStore.items.length === 0) {
      toastStore.show({
        message: 'Your cart is empty',
        color: 'error'
      });
      return;
    }

    // Validate cart items structure
    const hasValidItems = cartStore.items.every(item => 
      item._id && item.name && item.price && item.quantity
    );

    if (!hasValidItems) {
      console.error('Invalid cart items:', cartStore.items);
      toastStore.show({
        message: 'Some cart items are missing required information',
        color: 'error'
      });
      return;
    }

    // Check payment method
    if (!paymentMethod.value) {
      toastStore.show({
        message: 'Please select a payment method',
        color: 'error'
      });
      return;
    }

    // Validate payment method enum
    const validPaymentMethods = ['creditCard', 'paypal', 'cashOnDelivery'];
    if (!validPaymentMethods.includes(paymentMethod.value)) {
      toastStore.show({
        message: 'Invalid payment method selected',
        color: 'error'
      });
      return;
    }

    console.log('Placing order with:', {
      shippingDetails: shippingDetails.value,
      paymentMethod: paymentMethod.value,
      cartItems: cartStore.items,
      user: userStore.user,
    });

    // Place the order
    const result = await orderStore.createOrder(shippingDetails.value, paymentMethod.value);

    if (result && result.success) {
      // Clear cart
      cartStore.clearCart();
      
      toastStore.show({
        message: 'Order placed successfully!',
        color: 'success',
        timeout: 5000
      });

      router.push('/');
    } else {
      throw new Error(result?.message || 'Failed to place order');
    }

  } catch (error) {
    console.error('Order placement error:', error);
    toastStore.show({
      message: error.message || 'Failed to place order. Please try again.',
      color: 'error'
    });
  }
};
</script>

<style scoped>
.checkout-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* Hero Section */
.checkout-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 20px;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.checkout-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><polygon fill="rgba(255,255,255,0.05)" points="0,1000 1000,0 1000,1000"/></svg>');
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 16px;
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(45deg, #ffd89b 0%, #19547b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 40px;
}

/* Main Content */
.checkout-content {
  padding: 40px 0;
}

/* Authentication Required */
.auth-required {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
}

.auth-card {
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  max-width: 500px;
  width: 100%;
}

.auth-content {
  text-align: center;
  padding: 48px 32px;
}

.auth-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin: 20px 0 12px;
}

.auth-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0 0 32px;
  line-height: 1.6;
}

.auth-btn {
  border-radius: 16px;
  font-weight: 700;
  text-transform: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

/* Checkout Layout */
.checkout-layout {
  max-width: 1400px;
  margin: 0 auto;
}

/* Checkout Forms */
.checkout-forms {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.checkout-card {
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  padding: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.section-indicator {
  display: flex;
  align-items: center;
  gap: 16px;
}

.section-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.section-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 4px;
}

.section-subtitle {
  color: #666;
  margin: 0;
}

.form-content {
  padding: 32px 24px;
}

/* Order Items */
.order-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(102, 126, 234, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.item-details {
  flex: 1;
}

.item-name {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px;
}

.item-price {
  font-size: 0.9rem;
  color: #667eea;
  margin: 0 0 4px;
  font-weight: 500;
}

.item-quantity {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
}

.item-total {
  font-size: 1.1rem;
  font-weight: 700;
  color: #667eea;
}

.empty-cart-alert {
  border-radius: 12px;
}

.order-total {
  background: rgba(102, 126, 234, 0.05);
  padding: 16px;
  border-radius: 12px;
}

.total-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
}

.total-value {
  font-size: 1.3rem;
  font-weight: 800;
  color: #667eea;
}

/* Form Styling */
.form-group {
  margin-bottom: 24px;
}

.form-label {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
  margin-bottom: 8px;
  display: block;
}

.modern-input :deep(.v-field) {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.modern-input :deep(.v-field:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.modern-input :deep(.v-field--focused) {
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
}

/* Payment Methods */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-option {
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 16px;
}

.payment-option:hover {
  border-color: rgba(102, 126, 234, 0.3);
  background: rgba(102, 126, 234, 0.02);
}

.payment-option.active {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.payment-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.payment-icon {
  font-size: 24px;
}

.payment-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px;
}

.payment-description {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
}

/* Summary Sidebar */
.summary-sticky {
  position: sticky;
  top: 100px;
}

.summary-card {
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.summary-header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.summary-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
}

.summary-content {
  padding: 24px;
}

.pricing-breakdown {
  margin-bottom: 16px;
}

.price-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.price-line .label {
  color: #666;
  font-size: 0.95rem;
}

.price-line .value {
  font-weight: 600;
  color: #333;
}

.shipping-free {
  color: #4caf50;
  font-weight: 700;
}

.total-section {
  background: rgba(102, 126, 234, 0.05);
  padding: 16px;
  border-radius: 12px;
}

.user-info {
  text-align: center;
}

.user-info-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
}

.user-name {
  font-weight: 600;
  color: #667eea;
  margin: 0 0 4px;
}

.user-id {
  font-size: 0.8rem;
  color: #666;
  margin: 0;
}

/* Summary Actions */
.summary-actions {
  padding: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.place-order-btn {
  border-radius: 16px;
  font-weight: 700;
  text-transform: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  margin-bottom: 16px;
}

.place-order-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
}

.place-order-btn:disabled {
  opacity: 0.6;
  transform: none;
  box-shadow: none;
}

.security-info {
  margin-top: 16px;
}

.security-badges {
  display: flex;
  justify-content: space-around;
  padding: 12px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
}

.security-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 960px) {
  .hero-title {
    font-size: 2.2rem;
  }
  
  .summary-sticky {
    position: static;
  }
  
  .checkout-forms {
    margin-bottom: 24px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .checkout-content {
    padding: 20px 0;
  }
  
  .card-header,
  .form-content,
  .summary-content,
  .summary-actions {
    padding: 20px 16px;
  }
  
  .auth-content {
    padding: 32px 20px;
  }
  
  .order-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .item-total {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.8rem;
  }
  
  .section-indicator {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .payment-option {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .payment-info {
    width: 100%;
  }
}
</style>