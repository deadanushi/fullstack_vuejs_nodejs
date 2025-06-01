<template>
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isOpen" class="overlay" @click="closeModal">
          <div class="modal" @click.stop>
            <h3 class="modal-title">{{ title }}?</h3>
            <p class="modal-message">{{ message }}</p>
            <div class="modal-buttons">
              <button @click="closeModal">Cancel</button>
              <button @click="confirm">Delete</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  
 <script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'Confirm Delete'
  },
  message: {
    type: String,
    default: 'Are you sure you want to delete this item? This action cannot be undone.'
  },
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'confirm']);

function closeModal() {
  emit('close');
}

function confirm() {
  emit('confirm');
  closeModal();
}
</script>

  
  <style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.modal-title {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: bold;
}

.modal-message {
  margin-bottom: 1rem;
  font-size: 1rem;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.modal-buttons button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.modal-buttons button:last-child {
  background-color:rgb(114, 144, 104);
  color: #fff;
  border: none;
  border-radius: 5px;
  color: rgb(255, 255, 255);
}

.modal-buttons button:first-child {
  background-color:  rgb(110, 127, 143);
  color: #fff;
  border: none;
  border-radius: 5px;
  color: rgb(255, 255, 255);
}
</style>
