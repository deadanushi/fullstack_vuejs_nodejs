<template>
  <div class="admin-products">
    <div class="page-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="page-title">
            <v-icon class="title-icon">mdi-package-variant</v-icon>
            Product Management
          </h1>
          <p class="page-subtitle">
            Manage your product catalog and inventory
          </p>
        </div>
        <v-btn
          color="primary"
          size="large"
          class="add-product-btn"
          @click="openProductDialog()"
        >
          <v-icon left>mdi-plus</v-icon>
          Add Product
        </v-btn>
      </div>
    </div>

    <div class="stats-section">
      <v-row>
        <v-col cols="12" md="3" sm="6">
          <v-card class="stats-card" elevation="0">
            <div class="stats-content">
              <div class="stats-icon primary">
                <v-icon color="white">mdi-package-variant</v-icon>
              </div>
              <div class="stats-info">
                <h3 class="stats-number">{{ products.length }}</h3>
                <p class="stats-label">Total Products</p>
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
                <h3 class="stats-number">{{ inStockProducts }}</h3>
                <p class="stats-label">In Stock</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-card class="stats-card" elevation="0">
            <div class="stats-content">
              <div class="stats-icon warning">
                <v-icon color="white">mdi-alert-circle</v-icon>
              </div>
              <div class="stats-info">
                <h3 class="stats-number">{{ lowStockProducts }}</h3>
                <p class="stats-label">Low Stock</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-card class="stats-card" elevation="0">
            <div class="stats-content">
              <div class="stats-icon error">
                <v-icon color="white">mdi-close-circle</v-icon>
              </div>
              <div class="stats-info">
                <h3 class="stats-number">{{ outOfStockProducts }}</h3>
                <p class="stats-label">Out of Stock</p>
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
            <p class="loading-text">Loading products...</p>
          </div>
        </v-card>
      </div>

      <v-card v-else class="products-table-card" elevation="0">
        <div class="table-header">
          <div class="table-title">
            <h2>Products List</h2>
            <p class="table-subtitle">Manage all your products and inventory</p>
          </div>
          <div class="table-actions">
            <v-text-field
              v-model="searchQuery"
              placeholder="Search products..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              class="search-field"
              hide-details
            ></v-text-field>
            <v-select
              v-model="categoryFilter"
              :items="categoryFilterOptions"
              placeholder="Filter by category"
              variant="outlined"
              density="compact"
              class="category-filter"
              hide-details
              clearable
            ></v-select>
          </div>
        </div>

        <v-data-table
          :headers="headers"
          :items="filteredProducts"
          :items-per-page="10"
          class="modern-table"
          :loading="loading"
        >
          <template #[`item.image`]="{ item }">
            <div class="product-image">
              <v-avatar size="50" rounded="8">
                <v-img 
                  :src="item.image || `https://picsum.photos/50/50?random=${item._id}`" 
                  :alt="item.name"
                  cover
                ></v-img>
              </v-avatar>
            </div>
          </template>

          <template #[`item.name`]="{ item }">
            <div class="product-name">
              <div class="product-info">
                <h4 class="name">{{ item.name }}</h4>
                <p class="description">{{ truncateText(item.description, 50) }}</p>
              </div>
            </div>
          </template>

          <template #[`item.category`]="{ item }">
            <v-chip
              color="info"
              variant="tonal"
              size="small"
            >
              <v-icon start size="14">mdi-folder</v-icon>
              {{ item.category || 'Uncategorized' }}
            </v-chip>
          </template>

          <template #[`item.price`]="{ item }">
            <div class="price-cell">
              <span class="price">${{ (item.price || 0).toFixed(2) }}</span>
            </div>
          </template>

          <template #[`item.stock`]="{ item }">
            <v-chip
              :color="getStockColor(item.stock || 0)"
              variant="tonal"
              size="small"
            >
              <v-icon start size="14">
                {{ getStockIcon(item.stock || 0) }}
              </v-icon>
              {{ item.stock || 0 }} units
            </v-chip>
          </template>

          <template #[`item.status`]="{ item }">
            <v-chip
              :color="getStatusColor(item)"
              variant="tonal"
              size="small"
            >
              <v-icon start size="14">
                {{ getStatusIcon(item) }}
              </v-icon>
              {{ getStatusText(item) }}
            </v-chip>
          </template>

          <template #[`item.actions`]="{ item }">
            <div class="action-buttons">
              <v-btn
                icon
                variant="text"
                color="primary"
                size="small"
                @click="openProductDialog(item)"
              >
                <v-icon>mdi-pencil</v-icon>
                <v-tooltip activator="parent" location="top">Edit Product</v-tooltip>
              </v-btn>
              <v-btn
                icon
                variant="text"
                color="info"
                size="small"
                @click="viewProduct(item)"
              >
                <v-icon>mdi-eye</v-icon>
                <v-tooltip activator="parent" location="top">View Details</v-tooltip>
              </v-btn>
              <v-btn
                icon
                variant="text"
                color="error"
                size="small"
                @click="confirmDeleteProduct(item)"
              >
                <v-icon>mdi-delete</v-icon>
                <v-tooltip activator="parent" location="top">Delete Product</v-tooltip>
              </v-btn>
            </div>
          </template>

          <template #no-data>
            <div class="empty-state">
              <v-icon size="80" color="grey-lighten-2">mdi-package-variant-plus</v-icon>
              <h3 class="empty-title">No Products Found</h3>
              <p class="empty-subtitle">Start by adding your first product</p>
              <v-btn
                color="primary"
                @click="openProductDialog()"
                class="mt-4"
              >
                <v-icon left>mdi-plus</v-icon>
                Add First Product
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </div>

    <v-dialog v-model="productDialog" max-width="700px" persistent>
      <v-card class="product-dialog">
        <div class="dialog-header">
          <h2 class="dialog-title">
            <v-icon class="dialog-icon">
              {{ editedProduct._id ? 'mdi-pencil' : 'mdi-plus' }}
            </v-icon>
            {{ editedProduct._id ? 'Edit Product' : 'Add New Product' }}
          </h2>
          <v-btn
            icon
            variant="text"
            @click="productDialog = false"
            class="close-btn"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="dialog-content">
          <v-form ref="form" @submit.prevent="saveProduct">
            <v-row>
              <v-col cols="12" md="6">
                <div class="form-group">
                  <label class="form-label">Product Name</label>
                  <v-text-field
                    v-model="editedProduct.name"
                    placeholder="Enter product name"
                    variant="outlined"
                    density="comfortable"
                    class="modern-input"
                    prepend-inner-icon="mdi-package-variant"
                    :rules="nameRules"
                  ></v-text-field>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="form-group">
                  <label class="form-label">Category</label>
                  <v-select
                    v-model="editedProduct.category"
                    :items="categoryOptions"
                    placeholder="Select category"
                    variant="outlined"
                    density="comfortable"
                    class="modern-input"
                    prepend-inner-icon="mdi-folder"
                    :rules="categoryRules"
                  ></v-select>
                </div>
              </v-col>
            </v-row>

            <div class="form-group">
              <label class="form-label">Description</label>
              <v-textarea
                v-model="editedProduct.description"
                placeholder="Enter product description"
                variant="outlined"
                density="comfortable"
                class="modern-input"
                prepend-inner-icon="mdi-text"
                rows="3"
                no-resize
                :rules="descriptionRules"
              ></v-textarea>
            </div>

            <v-row>
              <v-col cols="12" md="4">
                <div class="form-group">
                  <label class="form-label">Price</label>
                  <v-text-field
                    v-model.number="editedProduct.price"
                    placeholder="0.00"
                    variant="outlined"
                    density="comfortable"
                    class="modern-input"
                    prepend-inner-icon="mdi-currency-usd"
                    type="number"
                    step="0.01"
                    min="0"
                    :rules="priceRules"
                  ></v-text-field>
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="form-group">
                  <label class="form-label">Stock Quantity</label>
                  <v-text-field
                    v-model.number="editedProduct.stock"
                    placeholder="0"
                    variant="outlined"
                    density="comfortable"
                    class="modern-input"
                    prepend-inner-icon="mdi-package"
                    type="number"
                    min="0"
                    :rules="stockRules"
                  ></v-text-field>
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="form-group">
                  <label class="form-label">Status</label>
                  <v-select
                    v-model="editedProduct.status"
                    :items="statusOptions"
                    item-title="text"
                    item-value="value"
                    variant="outlined"
                    density="comfortable"
                    class="modern-input"
                    prepend-inner-icon="mdi-check-circle"
                  ></v-select>
                </div>
              </v-col>
            </v-row>

            <div class="form-group">
              <label class="form-label">Image URL</label>
              <v-text-field
                v-model="editedProduct.image"
                placeholder="https://example.com/image.jpg (optional)"
                variant="outlined"
                density="comfortable"
                class="modern-input"
                prepend-inner-icon="mdi-image"
              ></v-text-field>
              <p class="form-hint">Leave empty to use a placeholder image</p>
            </div>

            <div v-if="editedProduct.image" class="image-preview">
              <label class="form-label">Image Preview</label>
              <v-card class="preview-card" elevation="1">
                <v-img
                  :src="editedProduct.image"
                  aspect-ratio="16/9"
                  cover
                  class="preview-image"
                >
                  <template #error>
                    <div class="error-placeholder">
                      <v-icon size="40" color="error">mdi-image-broken</v-icon>
                      <p>Invalid image URL</p>
                    </div>
                  </template>
                </v-img>
              </v-card>
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions class="dialog-actions">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="productDialog = false"
            class="cancel-btn"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="saveProduct"
            :loading="saving"
            class="save-btn"
          >
            <v-icon left v-if="!saving">
              {{ editedProduct._id ? 'mdi-content-save' : 'mdi-plus' }}
            </v-icon>
            {{ editedProduct._id ? 'Update Product' : 'Create Product' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card class="delete-dialog">
        <div class="delete-header">
          <div class="delete-icon">
            <v-icon color="error" size="40">mdi-alert-circle</v-icon>
          </div>
          <h2 class="delete-title">Delete Product</h2>
        </div>

        <v-card-text class="delete-content">
          <p class="delete-message">
            Are you sure you want to delete the product 
            <strong>"{{ editedProduct.name }}"</strong>?
          </p>
          <div class="delete-warning">
            <v-icon color="warning" size="16">mdi-alert</v-icon>
            <span>This action cannot be undone and will remove the product from all orders.</span>
          </div>
        </v-card-text>

        <v-card-actions class="delete-actions">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            @click="deleteProduct"
            :loading="deleting"
          >
            <v-icon left v-if="!deleting">mdi-delete</v-icon>
            Delete Product
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useProductStore } from '../../stores/product';
import { useToastStore } from '../../stores/toast';
import '@/assets/styles/adminProducts.css'

const productStore = useProductStore();
const toastStore = useToastStore();

const form = ref(null);
const searchQuery = ref('');
const categoryFilter = ref('');
const loading = ref(false);
const products = computed(() => productStore.products || []);
const categories = computed(() => productStore.categories || []);

const headers = [
  { title: 'Image', key: 'image', sortable: false, width: '80px' },
  { title: 'Product', key: 'name', width: '25%' },
  { title: 'Category', key: 'category', width: '15%' },
  { title: 'Price', key: 'price', width: '10%' },
  { title: 'Stock', key: 'stock', width: '15%' },
  { title: 'Status', key: 'status', width: '10%' },
  { title: 'Actions', key: 'actions', sortable: false, width: '15%' }
];

const statusOptions = [
  { text: 'Active', value: 'active' },
  { text: 'Inactive', value: 'inactive' },
  { text: 'Draft', value: 'draft' }
];

const productDialog = ref(false);
const deleteDialog = ref(false);
const saving = ref(false);
const deleting = ref(false);
const editedProduct = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  image: '',
  status: 'active'
});
const defaultProduct = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  image: '',
  status: 'active'
};

const nameRules = [
  v => !!v || 'Product name is required',
  v => v.length >= 2 || 'Name must be at least 2 characters'
];

const descriptionRules = [
  v => !!v || 'Description is required',
  v => v.length >= 10 || 'Description must be at least 10 characters'
];

const priceRules = [
  v => v !== null && v !== undefined && v !== '' || 'Price is required',
  v => v > 0 || 'Price must be greater than 0'
];

const stockRules = [
  v => v !== null && v !== undefined && v !== '' || 'Stock is required',
  v => v >= 0 || 'Stock cannot be negative'
];

const categoryRules = [
  v => !!v || 'Category is required'
];

const categoryOptions = computed(() => {
  return categories.value.map(cat => cat.name || cat);
});

const categoryFilterOptions = computed(() => {
  const options = ['All Categories'];
  const categoryNames = categories.value.map(cat => cat.name || cat);
  return options.concat(categoryNames);
});

const filteredProducts = computed(() => {
  let filtered = products.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query)) ||
      (product.category && product.category.toLowerCase().includes(query))
    );
  }

  if (categoryFilter.value && categoryFilter.value !== 'All Categories') {
    filtered = filtered.filter(product => product.category === categoryFilter.value);
  }

  return filtered;
});

const inStockProducts = computed(() => {
  return products.value.filter(product => (product.stock || 0) > 0).length;
});

const lowStockProducts = computed(() => {
  return products.value.filter(product => {
    const stock = product.stock || 0;
    return stock > 0 && stock <= 10;
  }).length;
});

const outOfStockProducts = computed(() => {
  return products.value.filter(product => (product.stock || 0) === 0).length;
});

onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([
      productStore.fetchProducts(),
      productStore.fetchCategories()
    ]);
  } catch (error) {
    console.error('Failed to load data:', error);
  } finally {
    loading.value = false;
  }
});

const truncateText = (text, length) => {
  if (!text) return 'No description';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

const getStockColor = (stock) => {
  if (stock === 0) return 'error';
  if (stock <= 10) return 'warning';
  return 'success';
};

const getStockIcon = (stock) => {
  if (stock === 0) return 'mdi-close-circle';
  if (stock <= 10) return 'mdi-alert-circle';
  return 'mdi-check-circle';
};

const getStatusColor = (product) => {
  const stock = product.stock || 0;
  const status = product.status || 'active';
  
  if (status === 'inactive' || status === 'draft') return 'warning';
  if (stock === 0) return 'error';
  return 'success';
};

const getStatusIcon = (product) => {
  const stock = product.stock || 0;
  const status = product.status || 'active';
  
  if (status === 'inactive') return 'mdi-pause-circle';
  if (status === 'draft') return 'mdi-file-document-edit';
  if (stock === 0) return 'mdi-close-circle';
  return 'mdi-check-circle';
};

const getStatusText = (product) => {
  const stock = product.stock || 0;
  const status = product.status || 'active';
  
  if (status === 'inactive') return 'Inactive';
  if (status === 'draft') return 'Draft';
  if (stock === 0) return 'Out of Stock';
  return 'Active';
};

const openProductDialog = (product = null) => {
  if (product) {
    editedProduct.value = { ...product };
  } else {
    editedProduct.value = { ...defaultProduct };
  }
  productDialog.value = true;
};

const viewProduct = (product) => {
  toastStore.show({
    message: `Viewing product: ${product.name}`,
    color: 'info'
  });
};

const saveProduct = async () => {
  if (!form.value || !(await form.value.validate()).valid) {
    toastStore.show({
      message: 'Please fill in all required fields correctly',
      color: 'error'
    });
    return;
  }
  
  saving.value = true;
  
  try {
    let result;
    
    if (editedProduct.value._id) {
      result = await productStore.updateProduct(
        editedProduct.value._id,
        editedProduct.value
      );
    } else {
      result = await productStore.addProduct(editedProduct.value);
    }
    
    if (result.success) {
      toastStore.show({
        message: `Product ${editedProduct.value._id ? 'updated' : 'created'} successfully!`,
        color: 'success'
      });
      productDialog.value = false;
    } else {
      toastStore.show({
        message: result.message || 'Operation failed',
        color: 'error'
      });
    }
  } catch (error) {
    console.error('Product save error:', error);
    toastStore.show({
      message: 'An unexpected error occurred',
      color: 'error'
    });
  } finally {
    saving.value = false;
  }
};

const confirmDeleteProduct = (product) => {
  editedProduct.value = { ...product };
  deleteDialog.value = true;
};

const deleteProduct = async () => {
  deleting.value = true;
  
  try {
    const result = await productStore.deleteProduct(editedProduct.value._id);
    
    if (result.success) {
      toastStore.show({
        message: 'Product deleted successfully!',
        color: 'success'
      });
      deleteDialog.value = false;
    } else {
      toastStore.show({
        message: result.message || 'Delete operation failed',
        color: 'error'
      });
    }
  } catch (error) {
    console.error('Product delete error:', error);
    toastStore.show({
      message: 'An unexpected error occurred',
      color: 'error'
    });
  } finally {
    deleting.value = false;
  }
};
</script>
