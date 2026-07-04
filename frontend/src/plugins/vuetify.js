// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'lume',
    themes: {
      lume: {
        dark: false,
        colors: {
          primary: '#C4896B',
          secondary: '#8B5E52',
          info: '#B98B7A',
          success: '#4CAF50',
          warning: '#FF9800',
          error: '#E57373',
          background: '#FEFCFA',
        },
      },
    },
  },
})
