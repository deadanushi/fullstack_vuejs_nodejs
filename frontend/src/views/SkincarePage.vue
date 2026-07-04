<template>
  <div class="sk-container">

    <!-- ── HERO ── -->
    <section class="sk-hero">
      <div class="sk-hero-glow sk-hero-glow--left"></div>
      <div class="sk-hero-glow sk-hero-glow--right"></div>
      <div class="sk-hero-inner">
        <span class="sk-hero-eyebrow">Clean Beauty · Science-Backed</span>
        <h1 class="sk-hero-title">
          Your Skin Deserves<br>
          <span class="sk-hero-accent">The Best Routine</span>
        </h1>
        <p class="sk-hero-sub">
          Dermatologist-tested formulas crafted with clinically proven actives.
          No fillers. No compromise.
        </p>
        <div class="sk-hero-actions">
          <button class="sk-btn-primary" @click="activeCategory = 'All'">
            Shop All Products
          </button>
          <button class="sk-btn-ghost" @click="scrollToRoutine">
            Build Your Routine
          </button>
        </div>
        <div class="sk-hero-badges">
          <div class="sk-badge"><v-icon size="15" color="#7BA39A">mdi-leaf</v-icon> Vegan &amp; Cruelty-Free</div>
          <div class="sk-badge"><v-icon size="15" color="#7BA39A">mdi-flask-outline</v-icon> Dermatologist Tested</div>
          <div class="sk-badge"><v-icon size="15" color="#7BA39A">mdi-recycle</v-icon> Sustainable Packaging</div>
        </div>
      </div>
    </section>

    <!-- ── CATEGORY FILTER ── -->
    <section class="sk-filter-bar">
      <div class="sk-filter-inner">
        <button
          v-for="cat in categories"
          :key="cat"
          class="sk-filter-pill"
          :class="{ 'sk-filter-pill--active': activeCategory === cat }"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
    </section>

    <!-- ── PRODUCT GRID ── -->
    <section class="sk-products-section">
      <div class="sk-products-header">
        <h2 class="sk-products-title">
          {{ activeCategory === 'All' ? 'All Products' : activeCategory }}
        </h2>
        <span class="sk-products-count">{{ filteredProducts.length }} products</span>
      </div>

      <div class="sk-products-grid">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="sk-card"
        >
          <!-- Badge -->
          <div v-if="product.badge" class="sk-card-badge" :class="`sk-card-badge--${product.badgeType}`">
            {{ product.badge }}
          </div>

          <!-- Image -->
          <div class="sk-card-image-wrap">
            <v-img
              :src="product.image"
              :alt="product.name"
              aspect-ratio="1"
              cover
              class="sk-card-img"
            >
              <template v-slot:placeholder>
                <div class="sk-img-placeholder">
                  <v-icon size="40" color="#C4896B">mdi-image-outline</v-icon>
                </div>
              </template>
              <template v-slot:error>
                <div class="sk-img-placeholder">
                  <v-icon size="40" color="#C4896B">mdi-flower-outline</v-icon>
                </div>
              </template>
            </v-img>
            <div class="sk-card-overlay">
              <button class="sk-overlay-btn">
                <v-icon size="16">mdi-eye-outline</v-icon>
                Quick View
              </button>
            </div>
          </div>

          <!-- Info -->
          <div class="sk-card-info">
            <span class="sk-card-category">{{ product.category }}</span>
            <h3 class="sk-card-name">{{ product.name }}</h3>
            <p class="sk-card-desc">{{ product.tagline }}</p>
            <div class="sk-card-footer">
              <div class="sk-card-price-row">
                <span class="sk-card-price">${{ product.price.toFixed(2) }}</span>
                <span v-if="product.originalPrice" class="sk-card-original">
                  ${{ product.originalPrice.toFixed(2) }}
                </span>
              </div>
              <div class="sk-card-rating">
                <v-icon size="14" color="#F59E0B">mdi-star</v-icon>
                <span class="sk-rating-val">{{ product.rating }}</span>
              </div>
            </div>
            <button class="sk-add-btn">
              <v-icon start size="16">mdi-cart-plus</v-icon>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ── ROUTINE BUILDER ── -->
    <section class="sk-routine-section" ref="routineSection">
      <div class="sk-routine-inner">
        <div class="sk-routine-header">
          <span class="sk-routine-eyebrow">Step by Step</span>
          <h2 class="sk-routine-title">Build Your Perfect Routine</h2>
          <p class="sk-routine-sub">
            A consistent routine is the foundation of healthy skin.
            Layer these steps morning and night for best results.
          </p>
        </div>
        <div class="sk-routine-steps">
          <div class="sk-step">
            <div class="sk-step-number">01</div>
            <v-icon class="sk-step-icon" color="#C4896B">mdi-water-outline</v-icon>
            <h4 class="sk-step-title">Cleanse</h4>
            <p class="sk-step-desc">Remove impurities and prep your skin to absorb the next steps effectively.</p>
            <button class="sk-step-link" @click="activeCategory = 'Cleansers'">
              Shop Cleansers →
            </button>
          </div>
          <div class="sk-step-connector"></div>
          <div class="sk-step">
            <div class="sk-step-number">02</div>
            <v-icon class="sk-step-icon" color="#C4896B">mdi-flask-outline</v-icon>
            <h4 class="sk-step-title">Treat</h4>
            <p class="sk-step-desc">Target specific concerns with serums packed with active ingredients.</p>
            <button class="sk-step-link" @click="activeCategory = 'Serums'">
              Shop Serums →
            </button>
          </div>
          <div class="sk-step-connector"></div>
          <div class="sk-step">
            <div class="sk-step-number">03</div>
            <v-icon class="sk-step-icon" color="#C4896B">mdi-shield-sun-outline</v-icon>
            <h4 class="sk-step-title">Protect</h4>
            <p class="sk-step-desc">Lock in hydration with moisturizer and defend with SPF during the day.</p>
            <button class="sk-step-link" @click="activeCategory = 'Moisturizers'">
              Shop Moisturizers →
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ── TRUST STRIP ── -->
    <section class="sk-trust-strip">
      <div class="sk-trust-inner">
        <div class="sk-trust-item">
          <v-icon color="#C4896B" size="28">mdi-truck-fast-outline</v-icon>
          <div>
            <p class="sk-trust-label">Free Shipping</p>
            <p class="sk-trust-sub">On orders over $50</p>
          </div>
        </div>
        <div class="sk-trust-divider"></div>
        <div class="sk-trust-item">
          <v-icon color="#C4896B" size="28">mdi-refresh</v-icon>
          <div>
            <p class="sk-trust-label">30-Day Returns</p>
            <p class="sk-trust-sub">No questions asked</p>
          </div>
        </div>
        <div class="sk-trust-divider"></div>
        <div class="sk-trust-item">
          <v-icon color="#C4896B" size="28">mdi-medal-outline</v-icon>
          <div>
            <p class="sk-trust-label">Results Guarantee</p>
            <p class="sk-trust-sub">Or your money back</p>
          </div>
        </div>
        <div class="sk-trust-divider"></div>
        <div class="sk-trust-item">
          <v-icon color="#C4896B" size="28">mdi-leaf</v-icon>
          <div>
            <p class="sk-trust-label">Clean Ingredients</p>
            <p class="sk-trust-sub">No harmful chemicals</p>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import '@/assets/styles/skincare.css';

const activeCategory = ref('All');
const routineSection = ref(null);

const categories = ['All', 'Moisturizers', 'Serums', 'Cleansers', 'SPF', 'Toners', 'Treatments', 'Eye Care'];

const scrollToRoutine = () => {
  routineSection.value?.scrollIntoView({ behavior: 'smooth' });
};

const products = [
  {
    id: 1,
    name: 'Hydra Glow Daily Moisturizer',
    tagline: '72-hour hydration with ceramides & hyaluronic acid',
    category: 'Moisturizers',
    price: 38.00,
    originalPrice: 48.00,
    rating: 4.8,
    badge: 'Best Seller',
    badgeType: 'warm',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=80'
  },
  {
    id: 2,
    name: 'Vitamin C Brightening Serum',
    tagline: '20% L-ascorbic acid for visible radiance in 2 weeks',
    category: 'Serums',
    price: 65.00,
    originalPrice: null,
    rating: 4.9,
    badge: 'New',
    badgeType: 'sage',
    image: 'https://images.unsplash.com/photo-1571781418606-70265b9cce90?w=600&q=80'
  },
  {
    id: 3,
    name: 'Gentle Foam Cleanser',
    tagline: 'pH-balanced formula that cleanses without stripping',
    category: 'Cleansers',
    price: 24.00,
    originalPrice: null,
    rating: 4.7,
    badge: null,
    badgeType: null,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80'
  },
  {
    id: 4,
    name: 'SPF 50+ Daily Shield',
    tagline: 'Lightweight broad-spectrum sunscreen, no white cast',
    category: 'SPF',
    price: 32.00,
    originalPrice: null,
    rating: 4.8,
    badge: 'Best Seller',
    badgeType: 'warm',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa68a?w=600&q=80'
  },
  {
    id: 5,
    name: 'Hyaluronic Acid Toner',
    tagline: 'Multi-molecular HA plumps and balances for all skin types',
    category: 'Toners',
    price: 28.00,
    originalPrice: null,
    rating: 4.6,
    badge: null,
    badgeType: null,
    image: 'https://images.unsplash.com/photo-1570194065348-9a89e97bd42c?w=600&q=80'
  },
  {
    id: 6,
    name: 'Retinol Night Repair Cream',
    tagline: '0.5% encapsulated retinol for smoothing fine lines overnight',
    category: 'Treatments',
    price: 72.00,
    originalPrice: 89.00,
    rating: 4.9,
    badge: 'New',
    badgeType: 'sage',
    image: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=600&q=80'
  },
  {
    id: 7,
    name: 'Under Eye Revival Gel',
    tagline: 'Caffeine & peptides de-puff and brighten dark circles',
    category: 'Eye Care',
    price: 45.00,
    originalPrice: null,
    rating: 4.7,
    badge: null,
    badgeType: null,
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=600&q=80'
  },
  {
    id: 8,
    name: 'Rose Hip Facial Oil',
    tagline: 'Cold-pressed rosehip seed oil rich in omega fatty acids',
    category: 'Treatments',
    price: 55.00,
    originalPrice: 65.00,
    rating: 4.8,
    badge: null,
    badgeType: null,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&q=80'
  }
];

const filteredProducts = computed(() => {
  if (activeCategory.value === 'All') return products;
  return products.filter(p => p.category === activeCategory.value);
});
</script>
