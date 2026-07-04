<template>
  <v-navigation-drawer
    v-model="cartStore.isOpen"
    location="right"
    :width="380"
    temporary
    class="cart-sidebar"
  >
    <!-- Header -->
    <div class="cart-sidebar-header">
      <div class="cart-header-left">
        <v-icon color="primary" size="22">mdi-cart-outline</v-icon>
        <h3 class="cart-sidebar-title">Your Cart</h3>
        <v-chip v-if="cartStore.totalItems > 0" size="small" color="primary" variant="flat" class="ml-2">
          {{ cartStore.totalItems }}
        </v-chip>
      </div>
      <v-btn icon variant="text" size="small" @click="cartStore.closeCart()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <v-divider></v-divider>

    <!-- Empty state -->
    <div v-if="cartStore.items.length === 0" class="cart-empty">
      <v-icon size="64" color="grey-lighten-2">mdi-cart-off</v-icon>
      <p class="cart-empty-text">Your cart is empty</p>
      <v-btn color="primary" variant="flat" rounded="lg" @click="cartStore.closeCart(); $router.push('/products')">
        Browse Products
      </v-btn>
    </div>

    <!-- Items list -->
    <div v-else class="cart-items-list">
      <div
        v-for="item in cartStore.items"
        :key="item._id"
        class="cart-sidebar-item"
      >
        <v-avatar size="64" rounded="12" class="item-avatar">
          <v-img
            :src="item.image || `https://picsum.photos/seed/${item._id}/80/80`"
            :alt="item.name"
            cover
          ></v-img>
        </v-avatar>

        <div class="item-body">
          <p class="item-name">{{ item.name }}</p>
          <p class="item-price">${{ Number(item.price).toFixed(2) }}</p>

          <div class="item-qty-row">
            <v-btn icon size="x-small" variant="outlined" @click="decrease(item)" :disabled="item.quantity <= 1">
              <v-icon size="14">mdi-minus</v-icon>
            </v-btn>
            <span class="item-qty">{{ item.quantity }}</span>
            <v-btn icon size="x-small" variant="outlined" @click="increase(item)">
              <v-icon size="14">mdi-plus</v-icon>
            </v-btn>
          </div>
        </div>

        <div class="item-right">
          <p class="item-subtotal">${{ (item.price * item.quantity).toFixed(2) }}</p>
          <v-btn icon size="x-small" variant="text" color="error" @click="cartStore.removeFromCart(item._id)">
            <v-icon size="16">mdi-delete-outline</v-icon>
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <template v-slot:append v-if="cartStore.items.length > 0">
      <div class="cart-sidebar-footer">
        <v-divider></v-divider>
        <div class="cart-total-row">
          <span class="total-label">Total</span>
          <span class="total-amount">${{ cartStore.totalPrice.toFixed(2) }}</span>
        </div>
        <div class="cart-actions">
          <v-btn
            variant="outlined"
            color="primary"
            block
            class="mb-2"
            @click="cartStore.closeCart(); $router.push('/cart')"
          >
            View Cart
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            block
            class="checkout-btn"
            @click="cartStore.closeCart(); $router.push('/checkout')"
          >
            <v-icon start>mdi-credit-card-outline</v-icon>
            Checkout
          </v-btn>
        </div>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { useCartStore } from '@/stores/cart';

const cartStore = useCartStore();

const increase = (item) => cartStore.updateQuantity(item._id, item.quantity + 1);
const decrease = (item) => {
  if (item.quantity > 1) cartStore.updateQuantity(item._id, item.quantity - 1);
};
</script>

<style scoped>
.cart-sidebar {
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12) !important;
}

.cart-sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
}

.cart-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cart-sidebar-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1E293B;
  margin: 0;
}

/* Empty */
.cart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 300px;
  padding: 32px;
  text-align: center;
}

.cart-empty-text {
  color: #64748B;
  font-size: 1rem;
  margin: 0;
}

/* Items */
.cart-items-list {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  max-height: calc(100vh - 220px);
}

.cart-sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #F8FAFC;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.item-avatar {
  flex-shrink: 0;
}

.item-body {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1E293B;
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-price {
  font-size: 0.8rem;
  color: #64748B;
  margin: 0 0 8px;
}

.item-qty-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-qty {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1E293B;
  min-width: 20px;
  text-align: center;
}

.item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.item-subtotal {
  font-size: 0.95rem;
  font-weight: 800;
  color: #2563EB;
  margin: 0;
}

/* Footer */
.cart-sidebar-footer {
  background: white;
}

.cart-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px 12px;
}

.total-label {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.total-amount {
  font-size: 1.3rem;
  font-weight: 800;
  color: #1E293B;
}

.cart-actions {
  padding: 0 16px 20px;
}

.checkout-btn {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%) !important;
  color: white !important;
  font-weight: 700;
  text-transform: none;
  border-radius: 12px !important;
}
</style>
