<template>
  <div class="order-summary-sticky">
    <div class="order-summary">
      <h3 class="summary-title">Order Summary</h3>
      
      <div class="summary-content">
        <div class="order-items">
          <div 
            v-for="item in orderItems" 
            :key="item.id" 
            class="order-item"
          >
            <div class="item-image">
              <img 
                v-if="item.image" 
                :src="item.image" 
                :alt="item.name"
              >
              <span v-else class="placeholder-text">IMG</span>
            </div>
            <div class="item-details">
              <p class="item-name">{{ item.name }}</p>
              <p class="item-quantity">Qty: {{ item.quantity }}</p>
            </div>
            <div class="item-price">${{ formatPrice(item.price * item.quantity) }}</div>
          </div>
        </div>

        <div class="pricing-breakdown">
          <div class="price-line">
            <span class="label">Subtotal</span>
            <span class="value">${{ formatPrice(subtotal) }}</span>
          </div>
          
          <div class="price-line">
            <span class="label">Shipping</span>
            <span class="value" :class="{ 'shipping-free': shippingCost === 0 }">
              {{ shippingCost === 0 ? 'FREE' : `$${formatPrice(shippingCost)}` }}
            </span>
          </div>
          
          <div v-if="discount > 0" class="price-line discount">
            <span class="label">Discount{{ discountCode ? ` (${discountCode})` : '' }}</span>
            <span class="value">-${{ formatPrice(discount) }}</span>
          </div>
          
          <div class="price-line">
            <span class="label">Tax</span>
            <span class="value">${{ formatPrice(tax) }}</span>
          </div>
        </div>

        <div class="total-section">
          <div class="total-line">
            <span class="total-label">Total</span>
            <span class="total-value">${{ formatPrice(total) }}</span>
          </div>
        </div>
      </div>

      <div class="summary-actions">
        <div class="actions-content">
          <button 
            class="place-order-btn" 
            :disabled="isLoading || orderItems.length === 0"
            @click="handlePlaceOrder"
          >
            <span v-if="isLoading">Processing...</span>
            <span v-else>Place Order</span>
          </button>
          
          <div class="order-security">
            <div class="security-badges">
              <div class="security-item">
                <span>🔒</span>
                <span>SSL Secure</span>
              </div>
              <div class="security-item">
                <span>🛡️</span>
                <span>Protected</span>
              </div>
              <div class="security-item">
                <span>✅</span>
                <span>Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/styles/orderSummary.css'
export default {
  name: 'OrderSummary',
  props: {
    orderItems: {
      type: Array
    },
    shippingCost: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    discountCode: {
      type: String,
      default: 'SAVE20'
    },
    taxRate: {
      type: Number,
      default: 0.10 
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    subtotal() {
      return this.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    tax() {
      const taxableAmount = this.subtotal + this.shippingCost - this.discount;
      return Math.max(0, taxableAmount * this.taxRate);
    },
    total() {
      return this.subtotal + this.shippingCost + this.tax - this.discount;
    }
  },
  methods: {
    formatPrice(price) {
      return price.toFixed(2);
    },
    handlePlaceOrder() {
      this.$emit('place-order', {
        items: this.orderItems,
        subtotal: this.subtotal,
        shipping: this.shippingCost,
        discount: this.discount,
        tax: this.tax,
        total: this.total
      });
    }
  }
}
</script>

