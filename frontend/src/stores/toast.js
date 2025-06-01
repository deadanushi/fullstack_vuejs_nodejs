import { defineStore } from 'pinia';

export const useToastStore = defineStore('toast', {
  state: () => ({
    visible: false,
    message: '',
    color: 'info',
    timeout: 3000
  }),
  
  actions: {
    show({ message, color = 'info', timeout = 3000 }) {
      this.message = message;
      this.color = color;
      this.timeout = timeout;
      this.visible = true;
    },
    
    hide() {
      this.visible = false;
    }
  }
});