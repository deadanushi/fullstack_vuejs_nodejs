import { defineStore } from "pinia"
import api from "../api/api"
import { useCartStore } from "../stores/cart"
import { useUserStore } from "../stores/user"

export const useOrderStore = defineStore("order", {
  state: () => ({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
  }),

  getters: {
    canProcessOrder: () => (order) => {
      return order.items.every((item) => item.quantity > 0)
    },
  },

  actions: {
    async createOrder(shippingDetails, paymentMethod) {
      const cartStore = useCartStore()
      const userStore = useUserStore()

      if (cartStore.items.length === 0) {
        return { success: false, message: "Cart is empty" }
      }

      try {
        if (!userStore.isLoggedIn) {
          return { success: false, message: "User not authenticated" }
        }

        const userId = userStore.user?._id || userStore.user?.id

        if (!userId) {
          return { success: false, message: "User ID not found" }
        }

        const orderData = {
          products: cartStore.items.map((item) => ({
            productId: item._id || item.id,
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity),
            image: item.image || item.imageUrl || "",
          })),

          amount: Number(cartStore.totalPrice),

          shippingDetails: {
            fullName: shippingDetails.fullName,
            address: shippingDetails.address,
            city: shippingDetails.city,
            zipCode: shippingDetails.zipCode,
            phone: shippingDetails.phone || "",
          },

          paymentMethod: paymentMethod,
        }

        console.log("FINAL PAYLOAD TO BACKEND:", orderData)

        const response = await api.post("/orders", orderData)

        cartStore.clearCart()

        return { success: true, order: response.data.data || response.data }
      } catch (error) {
        console.error("Order creation error:", error)
        console.error("Error response:", error.response?.data)

        let errorMessage = "Failed to create order"
        if (error.response?.data?.message) {
          if (Array.isArray(error.response.data.message)) {
            errorMessage = error.response.data.message.join(", ")
          } else {
            errorMessage = error.response.data.message
          }
        }

        return {
          success: false,
          message: errorMessage,
        }
      }
    },

    async fetchAdminOrders() {
      try {
        this.loading = true
        const response = await api.get("/orders/admin")
        this.orders = response.data.data || response.data
        return { success: true, orders: this.orders }
      } catch (error) {
        console.error("Fetch orders error:", error)
        this.error = error.response?.data?.message || error.message
        return {
          success: false,
          message: error.response?.data?.message || "Failed to fetch orders",
        }
      } finally {
        this.loading = false
      }
    },

    async updateOrderStatus(orderId, status) {
      try {
        const response = await api.put(`/orders/${orderId}`, { status })

        const index = this.orders.findIndex((order) => order._id === orderId)
        if (index !== -1) {
          this.orders[index] = response.data.data || response.data
        }

        return { success: true, order: response.data.data || response.data }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || "Failed to update order status",
        }
      }
    },

    async fetchUserOrders() {
      try {
        this.loading = true
        const response = await api.get("/orders")
        this.orders = response.data.data || response.data
        return { success: true, orders: this.orders }
      } catch (error) {
        console.error("Fetch user orders error:", error)
        this.error = error.response?.data?.message || error.message
        return {
          success: false,
          message: error.response?.data?.message || "Failed to fetch orders",
        }
      } finally {
        this.loading = false
      }
    },
  },
})
