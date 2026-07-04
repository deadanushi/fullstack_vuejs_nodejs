<template>
  <footer class="site-footer">
    <div class="footer-main">
      <div class="footer-inner">
        <!-- Brand -->
        <div class="footer-brand">
          <div class="footer-logo">
            <span class="logo-primary">LU</span><span class="logo-secondary">MÉ</span>
          </div>
          <p class="footer-tagline">Science-backed skincare for visibly radiant, healthy skin — every day.</p>
          <p class="footer-cert">🌿 Vegan &nbsp;·&nbsp; 🐰 Cruelty-Free &nbsp;·&nbsp; ♻️ Sustainable</p>
        </div>

        <!-- Links -->
        <div class="footer-links-group">
          <h4 class="footer-heading">Shop</h4>
          <ul class="footer-links">
            <li><router-link to="/products">All Products</router-link></li>
            <li><router-link to="/products">Moisturizers</router-link></li>
            <li><router-link to="/products">Serums</router-link></li>
            <li><router-link to="/cart">Cart</router-link></li>
          </ul>
        </div>

        <div class="footer-links-group">
          <h4 class="footer-heading">Company</h4>
          <ul class="footer-links">
            <li><a href="#">Our Story</a></li>
            <li><a href="#">Ingredients</a></li>
            <li><a href="#">Sustainability</a></li>
            <li><a href="#">Press</a></li>
          </ul>
        </div>

        <div class="footer-links-group">
          <h4 class="footer-heading">Support</h4>
          <ul class="footer-links">
            <li><a href="#">Skin Quiz</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p class="footer-copy">&copy; {{ year }} LUMÉ Skincare. All rights reserved.</p>
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
  background: #2D1F1A;
  color: #D4C4BB;
}

.footer-main {
  padding: 60px 24px 40px;
  border-bottom: 1px solid rgba(196, 137, 107, 0.15);
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
  font-family: 'Hanken Grotesk', sans-serif;
  font-weight: 900;
  font-size: 2rem;
  letter-spacing: -0.5px;
  margin-bottom: 14px;
}

.logo-primary {
  background: linear-gradient(135deg, #F5EDE8 0%, #E8D5CC 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-secondary {
  background: linear-gradient(135deg, #C4896B 0%, #E8A882 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-tagline {
  color: rgba(212, 196, 187, 0.75);
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0 0 12px;
  max-width: 260px;
}

.footer-cert {
  color: rgba(212, 196, 187, 0.5);
  font-size: 0.8rem;
  margin: 0;
  letter-spacing: 0.01em;
}

/* Links */
.footer-heading {
  color: #F5EDE8;
  font-family: 'Geist', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 18px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.footer-links a {
  color: rgba(212, 196, 187, 0.65);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #C4896B;
}

/* Bottom bar */
.footer-bottom {
  padding: 20px 24px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-copy {
  color: rgba(212, 196, 187, 0.4);
  font-size: 0.82rem;
  margin: 0;
}

.social-btn {
  color: rgba(212, 196, 187, 0.45) !important;
  transition: color 0.2s;
}

.social-btn:hover {
  color: #C4896B !important;
}

@media (max-width: 960px) {
  .footer-inner { grid-template-columns: 1fr 1fr; gap: 32px; }
  .footer-brand { grid-column: 1 / -1; }
}

@media (max-width: 600px) {
  .footer-inner { grid-template-columns: 1fr; }
  .footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
}
</style>
