<template>
  <div class="admin-categories">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="page-title">
            <v-icon class="title-icon">mdi-folder-multiple</v-icon>
            Category Management
          </h1>
          <p class="page-subtitle">
            Organize your products with categories
          </p>
        </div>
        <v-btn
          color="primary"
          size="large"
          class="add-category-btn"
          @click="openCategoryDialog()"
        >
          <v-icon left>mdi-plus</v-icon>
          Add Category
        </v-btn>
      </div>
    </div>

    <div class="stats-section">
      <v-row>
        <v-col cols="12" md="3" sm="6">
          <v-card class="stats-card" elevation="0">
            <div class="stats-content">
              <div class="stats-icon primary">
                <v-icon color="white">mdi-folder</v-icon>
              </div>
              <div class="stats-info">
                <h3 class="stats-number">{{ categories.length }}</h3>
                <p class="stats-label">Total Categories</p>
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
                <h3 class="stats-number">{{ activeCategories }}</h3>
                <p class="stats-label">Active Categories</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-card class="stats-card" elevation="0">
            <div class="stats-content">
              <div class="stats-icon info">
                <v-icon color="white">mdi-package-variant</v-icon>
              </div>
              <div class="stats-info">
                <h3 class="stats-number">{{ totalProducts }}</h3>
                <p class="stats-label">Total Products</p>
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
                <h3 class="stats-number">{{ recentlyAdded }}</h3>
                <p class="stats-label">Recently Added</p>
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
            <p class="loading-text">Loading categories...</p>
          </div>
        </v-card>
      </div>

      <v-card v-else class="categories-table-card" elevation="0">
        <div class="table-header">
          <div class="table-title">
            <h2>Categories List</h2>
            <p class="table-subtitle">Manage all your product categories</p>
          </div>
          <div class="table-actions">
            <v-text-field
              v-model="searchQuery"
              placeholder="Search categories..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              class="search-field"
              hide-details
            ></v-text-field>
          </div>
        </div>

        <v-data-table
          :headers="headers"
          :items="filteredCategories"
          :items-per-page="10"
          class="modern-table"
          :loading="loading"
        >
          <template #[`item.name`]="{ item }">
            <div class="category-name">
              <div class="category-avatar">
                {{ item.name.charAt(0).toUpperCase() }}
              </div>
              <div class="category-info">
                <h4 class="name">{{ item.name }}</h4>
                <p class="created-date">Created {{ formatDate(item.createdAt) }}</p>
              </div>
            </div>
          </template>

          <template #[`item.description`]="{ item }">
            <div class="description-cell">
              <p class="description-text">
                {{ item.description || 'No description provided' }}
              </p>
            </div>
          </template>

          <template #[`item.productsCount`]="{ item }">
            <v-chip
              :color="getProductCountColor(item.productsCount || 0)"
              variant="tonal"
              size="small"
            >
              {{ item.productsCount || 0 }} products
            </v-chip>
          </template>

          <template #[`item.status`]="{ item }">
            <v-chip
              :color="item.status === 'active' ? 'success' : 'warning'"
              variant="tonal"
              size="small"
            >
              <v-icon start size="16">
                {{ item.status === 'active' ? 'mdi-check-circle' : 'mdi-clock' }}
              </v-icon>
              {{ item.status || 'active' }}
            </v-chip>
          </template>

          <template #[`item.actions`]="{ item }">
            <div class="action-buttons">
              <v-btn
                icon
                variant="text"
                color="primary"
                size="small"
                @click="openCategoryDialog(item)"
              >
                <v-icon>mdi-pencil</v-icon>
                <v-tooltip activator="parent" location="top">Edit Category</v-tooltip>
              </v-btn>
              <v-btn
                icon
                variant="text"
                color="error"
                size="small"
                @click="confirmDeleteCategory(item)"
              >
                <v-icon>mdi-delete</v-icon>
                <v-tooltip activator="parent" location="top">Delete Category</v-tooltip>
              </v-btn>
            </div>
          </template>

          <template #no-data>
            <div class="empty-state">
              <v-icon size="80" color="grey-lighten-2">mdi-folder-plus</v-icon>
              <h3 class="empty-title">No Categories Found</h3>
              <p class="empty-subtitle">Start by creating your first category</p>
              <v-btn
                color="primary"
                @click="openCategoryDialog()"
                class="mt-4"
              >
                <v-icon left>mdi-plus</v-icon>
                Add First Category
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </div>

    <v-dialog v-model="categoryDialog" max-width="600px" persistent>
      <v-card class="category-dialog">
        <div class="dialog-header">
          <h2 class="dialog-title">
            <v-icon class="dialog-icon">
              {{ editedCategory._id ? 'mdi-pencil' : 'mdi-plus' }}
            </v-icon>
            {{ editedCategory._id ? 'Edit Category' : 'Add New Category' }}
          </h2>
          <v-btn
            icon
            variant="text"
            @click="categoryDialog = false"
            class="close-btn"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="dialog-content">
          <v-form ref="form" @submit.prevent="saveCategory">
            <div class="form-group">
              <label class="form-label">Category Name</label>
              <v-text-field
                v-model="editedCategory.name"
                placeholder="Enter category name"
                variant="outlined"
                density="comfortable"
                class="modern-input"
                prepend-inner-icon="mdi-folder-outline"
                :rules="nameRules"
              ></v-text-field>
            </div>
            
            <div class="form-group">
              <label class="form-label">Description</label>
              <v-textarea
                v-model="editedCategory.description"
                placeholder="Enter category description (optional)"
                variant="outlined"
                density="comfortable"
                class="modern-input"
                prepend-inner-icon="mdi-text"
                rows="3"
                no-resize
              ></v-textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Status</label>
              <v-select
                v-model="editedCategory.status"
                :items="statusOptions"
                item-title="text"
                item-value="value"
                variant="outlined"
                density="comfortable"
                class="modern-input"
                prepend-inner-icon="mdi-check-circle"
              ></v-select>
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions class="dialog-actions">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="categoryDialog = false"
            class="cancel-btn"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="saveCategory"
            :loading="saving"
            class="save-btn"
          >
            <v-icon left v-if="!saving">
              {{ editedCategory._id ? 'mdi-content-save' : 'mdi-plus' }}
            </v-icon>
            {{ editedCategory._id ? 'Update Category' : 'Create Category' }}
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
          <h2 class="delete-title">Delete Category</h2>
        </div>

        <v-card-text class="delete-content">
          <p class="delete-message">
            Are you sure you want to delete the category 
            <strong>"{{ editedCategory.name }}"</strong>?
          </p>
          <div class="delete-warning">
            <v-icon color="warning" size="16">mdi-alert</v-icon>
            <span>This action cannot be undone and may affect associated products.</span>
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
            @click="deleteCategory"
            :loading="deleting"
          >
            <v-icon left v-if="!deleting">mdi-delete</v-icon>
            Delete Category
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
import '@/assets/styles/adminCategories.css';

const productStore = useProductStore();
const toastStore = useToastStore();

const form = ref(null);
const searchQuery = ref('');
const loading = computed(() => productStore.loading);
const categories = computed(() => productStore.categories || []);

const headers = [
  { title: 'Category', key: 'name', width: '30%' },
  { title: 'Description', key: 'description', width: '35%' },
  { title: 'Products', key: 'productsCount', width: '15%' },
  { title: 'Status', key: 'status', width: '10%' },
  { title: 'Actions', key: 'actions', sortable: false, width: '10%' }
];

const statusOptions = [
  { text: 'Active', value: 'active' },
  { text: 'Inactive', value: 'inactive' }
];

const categoryDialog = ref(false);
const deleteDialog = ref(false);
const saving = ref(false);
const deleting = ref(false);
const editedCategory = ref({
  name: '',
  description: '',
  status: 'active'
});
const defaultCategory = {
  name: '',
  description: '',
  status: 'active'
};

const nameRules = [
  v => !!v || 'Category name is required',
  v => v.length >= 2 || 'Name must be at least 2 characters'
];

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value;
  
  return categories.value.filter(category =>
    category.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});

const activeCategories = computed(() => {
  return categories.value.filter(cat => cat.status === 'active' || !cat.status).length;
});

const totalProducts = computed(() => {
  return categories.value.reduce((sum, cat) => sum + (cat.productsCount || 0), 0);
});

const recentlyAdded = computed(() => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return categories.value.filter(cat => 
    cat.createdAt && new Date(cat.createdAt) > oneWeekAgo
  ).length;
});

onMounted(async () => {
  await productStore.fetchCategories();
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

const getProductCountColor = (count) => {
  if (count === 0) return 'grey';
  if (count < 5) return 'warning';
  if (count < 20) return 'info';
  return 'success';
};

const openCategoryDialog = (category = null) => {
  if (category) {
    editedCategory.value = { ...category };
  } else {
    editedCategory.value = { ...defaultCategory };
  }
  categoryDialog.value = true;
};

const saveCategory = async () => {
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
    
    if (editedCategory.value._id) {
      result = await productStore.updateCategory(
        editedCategory.value._id,
        editedCategory.value
      );
    } else {
      result = await productStore.addCategory(editedCategory.value);
    }
    
    if (result.success) {
      toastStore.show({
        message: `Category ${editedCategory.value._id ? 'updated' : 'created'} successfully!`,
        color: 'success'
      });
      categoryDialog.value = false;
    } else {
      toastStore.show({
        message: result.message || 'Operation failed',
        color: 'error'
      });
    }
  } catch (error) {
    console.error('Category save error:', error);
    toastStore.show({
      message: 'An unexpected error occurred',
      color: 'error'
    });
  } finally {
    saving.value = false;
  }
};

const confirmDeleteCategory = (category) => {
  editedCategory.value = { ...category };
  deleteDialog.value = true;
};

const deleteCategory = async () => {
  deleting.value = true;
  
  try {
    const result = await productStore.deleteCategory(editedCategory.value._id);
    
    if (result.success) {
      toastStore.show({
        message: 'Category deleted successfully!',
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
    console.error('Category delete error:', error);
    toastStore.show({
      message: 'An unexpected error occurred',
      color: 'error'
    });
  } finally {
    deleting.value = false;
  }
};
</script>
