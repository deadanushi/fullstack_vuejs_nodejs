<template>
  <div class="auth-container">
    <div class="auth-background">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
    </div>

    <v-container class="auth-content">
      <v-row justify="center" align="center" class="min-height-screen">
        <v-col cols="12" sm="10" md="8" lg="6" xl="4">
          <div class="auth-logo">
            <div class="logo-container">
              <span class="logo-text-primary">BEAU</span>
              <span class="logo-text-secondary">TIFY</span>
            </div>
            <p class="logo-subtitle">Welcome back to your account</p>
          </div>

          <v-card class="auth-card" elevation="0">
            <div class="auth-card-content">
              <div class="auth-header">
                <h1 class="auth-title">Sign In</h1>
                <p class="auth-subtitle">
                  Enter your credentials to access your account
                </p>
              </div>

              <v-form ref="form" @submit.prevent="login" class="auth-form">
                <div class="form-group">
                  <label class="form-label">Email Address</label>
                  <v-text-field
                    v-model="email"
                    type="email"
                    placeholder="Enter your email"
                    variant="outlined"
                    density="comfortable"
                    class="modern-input"
                    prepend-inner-icon="mdi-email-outline"
                    :rules="emailRules"
                    :error-messages="emailErrors"
                  ></v-text-field>
                </div>

                <div class="form-group">
                  <label class="form-label">Password</label>
                  <v-text-field
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Enter your password"
                    variant="outlined"
                    density="comfortable"
                    class="modern-input"
                    prepend-inner-icon="mdi-lock-outline"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showPassword = !showPassword"
                    :rules="passwordRules"
                    :error-messages="passwordErrors"
                  ></v-text-field>
                </div>

                <div class="form-options">
                  <v-checkbox
                    v-model="rememberMe"
                    label="Remember me"
                    density="compact"
                    class="remember-checkbox"
                  ></v-checkbox>
                  <v-btn
                    variant="text"
                    color="primary"
                    size="small"
                    class="forgot-password-btn"
                  >
                    Forgot Password?
                  </v-btn>
                </div>

                <v-alert
                  v-if="error"
                  type="error"
                  variant="tonal"
                  class="error-alert"
                  closable
                  @click:close="error = ''"
                >
                  {{ error }}
                </v-alert>

                <v-btn
                  color="primary"
                  size="x-large"
                  block
                  class="login-btn"
                  @click="login"
                  :loading="loading"
                  :disabled="!isFormValid"
                >
                  <v-icon left v-if="!loading">mdi-login</v-icon>
                  {{ loading ? 'Signing In...' : 'Sign In' }}
                </v-btn>

                <div class="social-login">
                  <div class="divider">
                    <span class="divider-text">Or continue with</span>
                  </div>
                  
                  <div class="social-buttons">
                    <v-btn
                      variant="outlined"
                      class="social-btn google-btn"
                      @click="loginWithGoogle"
                    >
                      <v-icon left>mdi-google</v-icon>
                      Google
                    </v-btn>
                    <v-btn
                      variant="outlined"
                      class="social-btn facebook-btn"
                      @click="loginWithFacebook"
                    >
                      <v-icon left>mdi-facebook</v-icon>
                      Facebook
                    </v-btn>
                  </div>
                </div>

                <div class="auth-footer">
                  <p class="footer-text">
                    Don't have an account?
                    <router-link to="/register" class="auth-link">
                      Create one here
                    </router-link>
                  </p>
                </div>
              </v-form>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { useToastStore } from '../stores/toast';
import '@/assets/styles/login.css'

const router = useRouter();
const userStore = useUserStore();
const toastStore = useToastStore();

const form = ref(null);
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const loading = ref(false);
const error = ref('');

const emailRules = [
  v => !!v || 'Email is required',
  v => /.+@.+\..+/.test(v) || 'Please enter a valid email address'
];

const passwordRules = [
  v => !!v || 'Password is required',
  v => v.length >= 6 || 'Password must be at least 6 characters'
];

const emailErrors = computed(() => {
  if (!email.value) return [];
  return emailRules.map(rule => rule(email.value)).filter(result => result !== true);
});

const passwordErrors = computed(() => {
  if (!password.value) return [];
  return passwordRules.map(rule => rule(password.value)).filter(result => result !== true);
});

const isFormValid = computed(() => {
  return email.value && 
         password.value && 
         emailErrors.value.length === 0 && 
         passwordErrors.value.length === 0;
});

const login = async () => {
  if (!isFormValid.value) {
    error.value = 'Please fill in all required fields correctly';
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    const result = await userStore.login({
      email: email.value,
      password: password.value
    });
    
    if (result.success) {
      toastStore.show({
        message: 'Welcome back! Login successful',
        color: 'success'
      });
      
      if (userStore.isAdmin) {
        router.push('/admin/products');
      } else {
        router.push('/');
      }
    } else {
      error.value = result.message || 'Invalid email or password';
    }
  } catch (err) {
    error.value = 'Something went wrong. Please try again.';
    console.error('Login error:', err);
  } finally {
    loading.value = false;
  }
};

const loginWithGoogle = () => {
  console.log('Login with Google');
};

const loginWithFacebook = () => {
  console.log('Login with Facebook');
};
</script>

