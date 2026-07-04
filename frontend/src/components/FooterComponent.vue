<template>
  <footer class="site-footer">
    <div class="footer-main">
      <div class="footer-inner">
        <!-- Brand -->
        <div class="footer-brand">
          <div class="footer-logo">
            <span class="logo-primary">MY</span><span class="logo-secondary">STORE</span>
          </div>
          <p class="footer-tagline">Your one-stop shop for everything you need.</p>
        </div>

        <!-- Links -->
        <div class="footer-links-group">
          <h4 class="footer-heading">Shop</h4>
          <ul class="footer-links">
            <li><router-link to="/products">All Products</router-link></li>
            <li><router-link to="/cart">Cart</router-link></li>
            <li><router-link to="/checkout">Checkout</router-link></li>
          </ul>
        </div>

        <div class="footer-links-group">
          <h4 class="footer-heading">Company</h4>
          <ul class="footer-links">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>

        <div class="footer-links-group">
          <h4 class="footer-heading">Support</h4>
          <ul class="footer-links">
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">Track Order</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p class="footer-copy">&copy; {{ year }} MyStore. All rights reserved.</p>
      <div class="footer-social">
        <v-btn icon variant="text" size="small" class="social-btn">
          <v-icon size="18">mdi-twitter</v-icon>
        </v-btn>
        <v-btn icon variant="text" size="small" class="social-btn">
          <v-icon size="18">mdi-instagram</v-icon>
        </v-btn>
        <v-btn icon variant="text" size="small" class="social-btn">
          <v-icon size="18">mdi-facebook</v-icon>
        </v-btn>
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear();
</script>

<style scoped>
.site-footer {
  background: #0F172A;
  color: #CBD5E1;
}

.footer-main {
  padding: 60px 24px 40px;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
}

/* Brand */
.footer-logo {
  font-family: 'Arial Black', Arial, sans-serif;
  font-weight: 900;
  font-size: 1.8rem;
  letter-spacing: -0.5px;
  margin-bottom: 12px;
}

.logo-primary {
  color: #F1F5F9;
}

.logo-secondary {
  color: #2563EB;
}

.footer-tagline {
  color: #94A3B8;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
  max-width: 240px;
}

/* Links */
.footer-heading {
  color: #F1F5F9;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 16px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links a {
  color: #94A3B8;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #93C5FD;
}

/* Bottom bar */
.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 20px 24px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-copy {
  color: #64748B;
  font-size: 0.85rem;
  margin: 0;
}

.social-btn {
  color: #64748B !important;
  transition: color 0.2s;
}

.social-btn:hover {
  color: #93C5FD !important;
}

@media (max-width: 960px) {
  .footer-inner {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  .footer-brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 600px) {
  .footer-inner {
    grid-template-columns: 1fr;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}
</style>
