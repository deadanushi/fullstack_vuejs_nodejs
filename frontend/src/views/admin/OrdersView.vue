<template>
  <div class="admin-orders">
    <div class="page-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="page-title">
            <v-icon class="title-icon">mdi-package-variant</v-icon>
            Order Management
          </h1>
          <p class="page-subtitle">
            Track and manage customer orders
          </p>
        </div>
        <v-btn
          color="primary"
          size="large"
          class="refresh-btn"
          @click="refreshOrders"
          :loading="loading"
        >
          <v-icon left>mdi-refresh</v-icon>
          Refresh Orders
        </v-btn>
      </div>
    </div>

    <div class="stats-section">
      <v-row>
        <v-col cols="12" md="3" sm="6">
          <v-card class="stats-card" elevation="0">
            <div class="stats-content">
              <div class="stats-icon primary">
                <v-icon color="white">mdi-package</v-icon>
              </div>
              <div class="stats-info">
                <h3 class="stats-number">{{ orders.length }}</h3>
                <p class="stats-label">Total Orders</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-card class="stats-card" elevation="0">
            <div class="stats-content">
              <div class="stats-icon warning">
                <v-icon color="white">mdi-clock</v-icon>
              </div>
              <div class="stats-info">
                <h3 class="stats-number">{{ pendingOrders }}</h3>
                <p class="stats-label">Pending Orders</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-card class="stats-card" elevation="0">
            <div class="stats-content">
              <div class="stats-icon info">
                <v-icon color="white">mdi-truck</v-icon>
              </div>
              <div class="stats-info">
                <h3 class="stats-number">{{ processingOrders }}</h3>
                <p class="stats-label">Processing</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-card class="stats-card" elevation="0">
            <div class="stats-content">
              <div class="stats-icon success">
                <v-icon color="white">mdi-check-circle</v-icon>
              </div>
              <div class="stats-info">
                <h3 class="stats-number">${{ totalRevenue.toFixed(0) }}</h3>
                <p class="stats-label">Total Revenue</p>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div class="main-content">
      <div v-if="loading" class="loading-container">
        <v-card class="loading-card" elevation="0">
          <div class="loading-content">
            <v-progress-circular 
              indeterminate 
              color="primary" 
              size="60"
            ></v-progress-circular>
            <p class="loading-text">Loading orders...</p>
          </div>
        </v-card>
      </div>

      <div v-else-if="orders.length === 0" class="empty-state">
        <v-card class="empty-card" elevation="0">
          <div class="empty-content">
            <v-icon size="80" color="grey-lighten-2">mdi-package-variant-plus</v-icon>
            <h3 class="empty-title">No Orders Found</h3>
            <p class="empty-subtitle">Orders will appear here when customers place them</p>
          </div>
        </v-card>
      </div>

      <div v-else class="orders-section">
        <div class="section-header">
          <div class="section-title">
            <h2>Recent Orders</h2>
            <p class="section-subtitle">Manage and track all customer orders</p>
          </div>
          <div class="section-actions">
            <v-text-field
              v-model="searchQuery"
              placeholder="Search orders..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              class="search-field"
              hide-details
            ></v-text-field>
            <v-select
              v-model="statusFilter"
              :items="statusFilterOptions"
              placeholder="Filter by status"
              variant="outlined"
              density="compact"
              class="filter-select"
              hide-details
              clearable
            ></v-select>
          </div>
        </div>

        <div class="orders-grid">
          <v-card 
            v-for="order in filteredOrders" 
            :key="order._id" 
            class="order-card"
            elevation="0"
          >
            <div class="order-header">
              <div class="order-info">
                <div class="order-id">
                  <v-icon class="order-icon">mdi-receipt</v-icon>
                  <span class="order-number">Order #{{ order._id.substring(0, 8) }}</span>
                </div>
                <div class="order-meta">
                  <span class="order-date">{{ formatDate(order.createdAt) }}</span>
                  <span class="order-customer">{{ order.shippingAddress?.fullName || 'N/A' }}</span>
                </div>
              </div>
              <v-chip
                :color="getStatusColor(order.status)"
                variant="tonal"
                size="small"
                class="status-chip"
              >
                <v-icon start size="16">{{ getStatusIcon(order.status) }}</v-icon>
                {{ order.status }}
              </v-chip>
            </div>

            <v-divider class="order-divider"></v-divider>

            <div class="order-items">
              <div class="items-header">
                <h4 class="items-title">Order Items</h4>
                <v-chip
                  :color="order.canProcess ? 'success' : 'error'"
                  variant="tonal"
                  size="x-small"
                >
                  {{ order.canProcess ? 'In Stock' : 'Out of Stock' }}
                </v-chip>
              </div>
              
              <div class="items-list">
                <div
                  v-for="item in order.items"
                  :key="item.productId"
                  class="order-item"
                >
                  <div class="item-image">
                    <v-img 
                      :src="item.image || 'https://picsum.photos/40/40'" 
                      :alt="item.name"
                      cover
                    ></v-img>
                  </div>
                  <div class="item-details">
                    <h5 class="item-name">{{ item.name }}</h5>
                    <p class="item-info">Qty: {{ item.quantity }} × ${{ item.price.toFixed(2) }}</p>
                  </div>
                  <div class="item-total">
                    ${{ (item.price * item.quantity).toFixed(2) }}
                  </div>
                </div>
              </div>
            </div>

            <v-divider class="order-divider"></v-divider>

            <div class="order-total">
              <div class="total-info">
                <span class="total-label">Total Amount</span>
                <span class="total-amount">${{ order.totalAmount.toFixed(2) }}</span>
              </div>
            </div>

            <div v-if="order.shippingAddress" class="shipping-info">
              <h4 class="shipping-title">
                <v-icon size="16">mdi-map-marker</v-icon>
                Shipping Address
              </h4>
              <div class="shipping-details">
                <p class="shipping-name">{{ order.shippingAddress.fullName }}</p>
                <p class="shipping-address">{{ order.shippingAddress.address }}</p>
                <p class="shipping-location">
                  {{ order.shippingAddress.city }}, {{ order.shippingAddress.zipCode }}
                </p>
                <p v-if="order.shippingAddress.phone" class="shipping-phone">
                  <v-icon size="12">mdi-phone</v-icon>
                  {{ order.shippingAddress.phone }}
                </p>
              </div>
            </div>
            <div v-else class="shipping-warning">
              <v-alert type="warning" density="compact" class="warning-alert">
                <v-icon>mdi-alert</v-icon>
                Shipping details unavailable
              </v-alert>
            </div>

            <div class="order-actions">
              <v-btn
                v-if="order.status === 'pending'"
                color="primary"
                variant="flat"
                size="small"
                @click="updateOrderStatus(order._id, 'processing')"
                :disabled="!order.canProcess"
                class="action-btn"
              >
                <v-icon left size="16">mdi-play</v-icon>
                Process Order
              </v-btn>
              <v-btn
                v-if="order.status === 'processing'"
                color="success"
                variant="flat"
                size="small"
                @click="updateOrderStatus(order._id, 'shipped')"
                class="action-btn"
              >
                <v-icon left size="16">mdi-truck</v-icon>
                Mark as Shipped
              </v-btn>
              <v-btn
                v-if="order.status === 'shipped'"
                color="success"
                variant="flat"
                size="small"
                @click="updateOrderStatus(order._id, 'delivered')"
                class="action-btn"
              >
                <v-icon left size="16">mdi-check</v-icon>
                Mark as Delivered
              </v-btn>
              <v-btn
                v-if="['pending', 'processing'].includes(order.status)"
                color="error"
                variant="outlined"
                size="small"
                @click="updateOrderStatus(order._id, 'cancelled')"
                class="cancel-btn"
              >
                <v-icon left size="16">mdi-close</v-icon>
                Cancel Order
              </v-btn>
            </div>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useOrderStore } from '../../stores/order';
import { useToastStore } from '../../stores/toast';
import '@/assets/styles/adminOrders.css'

const orderStore = useOrderStore();
const toastStore = useToastStore();

const searchQuery = ref('');
const statusFilter = ref('');

const statusFilterOptions = [
  'pending',
  'processing', 
  'shipped',
  'delivered',
  'cancelled'
];

onMounted(async () => {
  await orderStore.fetchAdminOrders();
});

const loading = computed(() => orderStore.loading);
const orders = computed(() => {
  return orderStore.orders.map(order => ({
    ...order,
    shippingAddress: order.shippingAddress || {},
    canProcess: orderStore.canProcessOrder(order)
  }));
});

const filteredOrders = computed(() => {
  let filtered = orders.value;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(order => 
      order._id.toLowerCase().includes(query) ||
      order.shippingAddress?.fullName?.toLowerCase().includes(query) ||
      order.status.toLowerCase().includes(query)
    );
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(order => order.status === statusFilter.value);
  }
  
  return filtered;
});

const pendingOrders = computed(() => {
  return orders.value.filter(order => order.status === 'pending').length;
});

const processingOrders = computed(() => {
  return orders.value.filter(order => order.status === 'processing').length;
});

const totalRevenue = computed(() => {
  return orders.value.reduce((sum, order) => sum + order.totalAmount, 0);
});

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'processing':
      return 'info';
    case 'shipped':
    case 'delivered':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending':
      return 'mdi-clock';
    case 'processing':
      return 'mdi-cog';
    case 'shipped':
      return 'mdi-truck';
    case 'delivered':
      return 'mdi-check-circle';
    case 'cancelled':
      return 'mdi-close-circle';
    default:
      return 'mdi-help-circle';
  }
};

const refreshOrders = async () => {
  await orderStore.fetchAdminOrders();
};

const updateOrderStatus = async (orderId, status) => {
  const result = await orderStore.updateOrderStatus(orderId, status);
  
  if (result.success) {
    toastStore.show({
      message: `Order status updated to ${status}`,
      color: 'success'
    });
  } else {
    toastStore.show({
      message: result.message || 'Failed to update order status',
      color: 'error'
    });
  }
};
</script>