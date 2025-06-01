<template>
  <div class="auth-container">
    <div class="auth-background">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
      </div>
    </div>

    <v-container class="auth-content">
      <v-row justify="center" align="center" class="min-height-screen">
        <v-col cols="12" sm="10" md="8" lg="6" xl="5">
          <div class="auth-logo">
            <div class="logo-container">
              <span class="logo-text-primary">BEAU</span>
              <span class="logo-text-secondary">TIFY</span>
            </div>
            <p class="logo-subtitle">Join thousands of happy customers</p>
          </div>

          <v-card class="auth-card" elevation="0">
            <div class="auth-card-content">
              <div class="auth-header">
                <h1 class="auth-title">Create Account</h1>
                <p class="auth-subtitle">
                  Start your journey with us today
                </p>
              </div>

              <v-form ref="form" @submit.prevent="register" class="auth-form">
                <div class="form-group">
                  <label class="form-label">Full Name</label>
                  <v-text-field
                    v-model="name"
                    placeholder="Enter your full name"
                    variant="outlined"
                    density="comfortable"
                    class="modern-input"
                    prepend-inner-icon="mdi-account-outline"
                    :rules="nameRules"
                    :error-messages="nameErrors"
                  ></v-text-field>
                </div>

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
                    placeholder="Create a secure password"
                    variant="outlined"
                    density="comfortable"
                    class="modern-input"
                    prepend-inner-icon="mdi-lock-outline"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showPassword = !showPassword"
                    :rules="passwordRules"
                    :error-messages="passwordErrors"
                  ></v-text-field>
                  
                  <div class="password-strength" v-if="password">
                    <div class="strength-meter">
                      <div 
                        class="strength-bar"
                        :class="passwordStrengthClass"
                        :style="{ width: passwordStrengthWidth }"
                      ></div>
                    </div>
                    <span class="strength-text" :class="passwordStrengthClass">
                      {{ passwordStrengthText }}
                    </span>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Confirm Password</label>
                  <v-text-field
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="Confirm your password"
                    variant="outlined"
                    density="comfortable"
                    class="modern-input"
                    prepend-inner-icon="mdi-lock-check-outline"
                    :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showConfirmPassword = !showConfirmPassword"
                    :rules="confirmPasswordRules"
                    :error-messages="confirmPasswordErrors"
                  ></v-text-field>
                </div>

                <div class="terms-section">
                  <v-checkbox
                    v-model="acceptTerms"
                    density="compact"
                    class="terms-checkbox"
                  >
                    <template v-slot:label>
                      <span class="terms-text">
                        I agree to the 
                        <a href="#" class="terms-link">Terms of Service</a> 
                        and 
                        <a href="#" class="terms-link">Privacy Policy</a>
                      </span>
                    </template>
                  </v-checkbox>
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
                  class="register-btn"
                  @click="register"
                  :loading="loading"
                  :disabled="!isFormValid"
                >
                  <v-icon left v-if="!loading">mdi-account-plus</v-icon>
                  {{ loading ? 'Creating Account...' : 'Create Account' }}
                </v-btn>

                <div class="social-login">
                  <div class="divider">
                    <span class="divider-text">Or sign up with</span>
                  </div>
                  
                  <div class="social-buttons">
                    <v-btn
                      variant="outlined"
                      class="social-btn google-btn"
                      @click="registerWithGoogle"
                    >
                      <v-icon left>mdi-google</v-icon>
                      Google
                    </v-btn>
                    <v-btn
                      variant="outlined"
                      class="social-btn facebook-btn"
                      @click="registerWithFacebook"
                    >
                      <v-icon left>mdi-facebook</v-icon>
                      Facebook
                    </v-btn>
                  </div>
                </div>

                <div class="auth-footer">
                  <p class="footer-text">
                    Already have an account?
                    <router-link to="/login" class="auth-link">
                      Sign in here
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
import '@/assets/styles/register.css'

const router = useRouter();
const userStore = useUserStore();
const toastStore = useToastStore();

const form = ref(null);
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const acceptTerms = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const error = ref('');

const nameRules = [
  v => !!v || 'Full name is required',
  v => v.length >= 2 || 'Name must be at least 2 characters'
];

const emailRules = [
  v => !!v || 'Email is required',
  v => /.+@.+\..+/.test(v) || 'Please enter a valid email address'
];

const passwordRules = [
  v => !!v || 'Password is required',
  v => v.length >= 8 || 'Password must be at least 8 characters',
  v => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
  v => /[0-9]/.test(v) || 'Password must contain at least one number'
];

const confirmPasswordRules = [
  v => !!v || 'Please confirm your password',
  v => v === password.value || 'Passwords do not match'
];

const nameErrors = computed(() => {
  if (!name.value) return [];
  return nameRules.map(rule => rule(name.value)).filter(result => result !== true);
});

const emailErrors = computed(() => {
  if (!email.value) return [];
  return emailRules.map(rule => rule(email.value)).filter(result => result !== true);
});

const passwordErrors = computed(() => {
  if (!password.value) return [];
  return passwordRules.map(rule => rule(password.value)).filter(result => result !== true);
});

const confirmPasswordErrors = computed(() => {
  if (!confirmPassword.value) return [];
  return confirmPasswordRules.map(rule => rule(confirmPassword.value)).filter(result => result !== true);
});

const passwordStrength = computed(() => {
  let strength = 0;
  const pwd = password.value;
  
  if (pwd.length >= 8) strength++;
  if (/[a-z]/.test(pwd)) strength++;
  if (/[A-Z]/.test(pwd)) strength++;
  if (/[0-9]/.test(pwd)) strength++;
  if (/[^A-Za-z0-9]/.test(pwd)) strength++;
  
  return strength;
});

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value;
  if (strength <= 1) return 'weak';
  if (strength <= 2) return 'fair';
  if (strength <= 3) return 'good';
  return 'strong';
});

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value;
  if (!password.value) return '';
  if (strength <= 1) return 'Weak';
  if (strength <= 2) return 'Fair';
  if (strength <= 3) return 'Good';
  return 'Strong';
});

const passwordStrengthWidth = computed(() => {
  return `${(passwordStrength.value / 5) * 100}%`;
});

const isFormValid = computed(() => {
  return name.value && 
         email.value && 
         password.value && 
         confirmPassword.value &&
         acceptTerms.value &&
         nameErrors.value.length === 0 && 
         emailErrors.value.length === 0 && 
         passwordErrors.value.length === 0 && 
         confirmPasswordErrors.value.length === 0;
});

const register = async () => {
  if (!isFormValid.value) {
    error.value = 'Please fill in all required fields correctly and accept the terms';
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    const result = await userStore.register({
      name: name.value,
      email: email.value,
      password: password.value
    });
    
    if (result.success) {
      toastStore.show({
        message: 'Account created successfully! Welcome aboard!',
        color: 'success'
      });
      router.push('/');
    } else {
      error.value = result.message || 'Failed to create account';
    }
  } catch (err) {
    error.value = 'Something went wrong. Please try again.';
    console.error('Registration error:', err);
  } finally {
    loading.value = false;
  }
};

const registerWithGoogle = () => {
  console.log('Register with Google');
};

const registerWithFacebook = () => {
  console.log('Register with Facebook');
};
</script>
