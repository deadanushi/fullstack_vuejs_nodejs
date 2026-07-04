# Full-Stack E-Commerce Template — Vue 3 + Node.js + MongoDB

A production-ready e-commerce starter with a Vue 3 storefront, Express REST API, JWT authentication, and a full admin panel. Swap in your branding and products — everything else is wired up.

---

## Features

| Area | What's included |
|---|---|
| **Storefront** | Home page with featured product carousel, product listing with category / search / price filters, product detail page |
| **Cart & Checkout** | Persistent cart (Pinia store), checkout form with shipping address and payment method selection (credit card, PayPal, cash on delivery) |
| **Auth** | Register, login, JWT-based session, role-based access (user / admin) |
| **Admin panel** | Manage products, categories, and orders; update order status |
| **API** | RESTful Express API — `/api/auth`, `/api/products`, `/api/categories`, `/api/orders` |
| **Database** | MongoDB with Mongoose — seed data included |

---


## Tech stack

- **Frontend:** Vue 3, Vuetify 3, Pinia, Vue Router, Axios
- **Backend:** Node.js, Express, Mongoose, bcryptjs, JSON Web Tokens
- **Database:** MongoDB (local or Atlas)

---

## Prerequisites

- Node.js 18+
- MongoDB — local install **or** [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier works)
- npm

---

## Setup (under 10 minutes)

### 1 — Clone & install dependencies

```bash
git clone <your-repo-url>
cd fullstack_vuejs_nodejs

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2 — Configure environment variables

**Backend:**
```bash
cd backend
cp .env.example .env
```
Open `backend/.env` and set:
```
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/mystore   # or your Atlas URI
JWT_SECRET=replace_with_a_long_random_secret  # openssl rand -hex 64
JWT_EXPIRE=30d
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
```
The default (`VUE_APP_API_URL=http://localhost:3000/api`) works for local dev — no changes needed unless your backend runs on a different port.

### 3 — Seed the database

Make sure MongoDB is running, then import the sample data from the `database/` folder:

```bash
# From the project root
mongoimport --db mystore --collection categories \
  --file database/ecommerce.categories.json --jsonArray

mongoimport --db mystore --collection products \
  --file database/ecommerce.products.json --jsonArray

mongoimport --db mystore --collection users \
  --file database/ecommerce.users.json --jsonArray

mongoimport --db mystore --collection orders \
  --file database/ecommerce.orders.json --jsonArray
```

> **MongoDB Compass users:** Import each `.json` file through the GUI — Collections → Add Data → Import JSON.

**Seed credentials** (all passwords are `password`):
| Email | Role |
|---|---|
| admin@example.com | admin |
| jane@example.com | user |
| john@example.com | user |

### 4 — Run the app

Open two terminals:

```bash
# Terminal 1 — backend
cd backend
npm run dev       # uses nodemon, restarts on changes
# or: npm start   # plain node
```

```bash
# Terminal 2 — frontend
cd frontend
npm run serve
```

| Service | URL |
|---|---|
| Storefront | http://localhost:8080 |
| Admin panel | http://localhost:8080/admin/products |
| API | http://localhost:3000/api |

---

## Customising the template

### Brand name / logo
The logo text lives in four files — search for `MY` / `STORE` and replace with your brand:
- `frontend/src/components/NavbarComponent.vue`
- `frontend/src/views/admin/AdminLayout.vue`
- `frontend/src/views/LoginView.vue`
- `frontend/src/views/RegisterView.vue`

### Colours
Vuetify theme colours are defined in `frontend/src/main.js` under `createVuetify({ theme: { themes: { light: { colors: { ... } } } } })`.

### Products & categories
Add your real products via the admin panel (`/admin/products`, `/admin/categories`) or replace the JSON files in `database/` before the first import.

### API base URL (production)
Set `VUE_APP_API_URL` in `frontend/.env` to your deployed backend URL before running `npm run build`.

---

## Project structure

```
fullstack_vuejs_nodejs/
├── backend/
│   ├── config/        # MongoDB connection
│   ├── controllers/   # Route handlers (auth, products, categories, orders)
│   ├── middleware/    # JWT auth, error handler
│   ├── models/        # Mongoose schemas (User, Product, Category, Order)
│   ├── routes/        # Express routers
│   └── server.js
├── frontend/
│   └── src/
│       ├── api/       # Axios instance with JWT interceptor
│       ├── components/# Navbar, ProductCard, OrderSummary, DeleteConfirmModal
│       ├── stores/    # Pinia stores (user, product, cart, order, toast)
│       ├── views/     # Pages (Home, Products, Cart, Checkout, Login, Register)
│       └── views/admin/ # Admin pages (Products, Categories, Orders)
└── database/          # Seed data JSON files
```

---

## API reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | user | Current user |
| GET | `/api/products` | — | List products (filter, sort, paginate) |
| POST | `/api/products` | admin | Create product |
| PUT | `/api/products/:id` | admin | Update product |
| DELETE | `/api/products/:id` | admin | Delete product |
| GET | `/api/categories` | — | List categories |
| POST | `/api/categories` | admin | Create category |
| GET | `/api/orders` | user | My orders |
| POST | `/api/orders` | user | Place order |
| GET | `/api/orders/admin` | admin | All orders |
| PUT | `/api/orders/:id` | admin | Update order status |
| PUT | `/api/orders/:id/cancel` | user | Cancel order |
