# 🚀 Complete Setup Guide - 3 Services

## Overview

Your WOMA Sportswear project consists of 3 separate services that work together:

1. **Frontend Website** - Customer-facing e-commerce site
2. **Django Backend** - API server and database
3. **Admin Dashboard** - Separate admin interface for managing products and orders

---

## 🔧 Services Setup

### Service 1: Frontend Website ✅ (Already Running)

**Directory**: `/Users/mohamedghaly/Desktop/WomaWebsite`

**Start Command**:
```bash
cd /Users/mohamedghaly/Desktop/WomaWebsite
npm run dev
```

**URL**: `http://localhost:5174/`

**Features**:
- 🛍️ Product browsing with Gen Z UI
- 🛒 Shopping cart
- 💳 Checkout process
- 🎨 Modern, vibrant design with gradients and animations

---

### Service 2: Django Backend ⏳ (Need to Start)

**Directory**: `/Users/mohamedghaly/Desktop/WomaBackend`

**Start Command**:
```bash
cd /Users/mohamedghaly/Desktop/WomaBackend
python manage.py runserver
```

**URL**: `http://127.0.0.1:8000/`

**Features**:
- 📊 REST API for products, orders, categories
- 💾 Database management
- 🔐 Authentication

---

### Service 3: Admin Dashboard ⏳ (Need to Start)

**Directory**: `/Users/mohamedghaly/Desktop/WomaDashboard`

**Start Command**:
```bash
cd /Users/mohamedghaly/Desktop/WomaDashboard
npm install  # First time only
npm run dev
```

**URL**: `http://localhost:5173/` (or another port if 5173 is taken)

**Features**:
- 📦 Product management (add, edit, delete)
- 📋 Order management (view, update status)
- 👥 Customer information
- 📊 Dashboard analytics

---

## 🧪 Complete Testing Flow

### Step 1: Start All Services

Open **3 separate terminals**:

**Terminal 1 - Backend**:
```bash
cd /Users/mohamedghaly/Desktop/WomaBackend
python manage.py runserver
```

**Terminal 2 - Frontend** (Already running):
```bash
# Already running at http://localhost:5174/
```

**Terminal 3 - Dashboard**:
```bash
cd /Users/mohamedghaly/Desktop/WomaDashboard
npm run dev
```

### Step 2: Test Customer Flow

1. Visit `http://localhost:5174/`
2. Browse products (loaded from Django backend)
3. Add items to cart
4. Click checkout
5. Fill in customer details
6. Submit order

### Step 3: Test Admin Flow

1. Visit the dashboard URL (check terminal 3 for the port)
2. Login with admin credentials
3. Go to "Orders" section
4. See the order you just placed
5. Update order status (Pending → Shipped → Delivered)
6. Go to "Products" section
7. Add a new product
8. Refresh the frontend to see the new product

---

## 📊 Service Communication

```
┌─────────────────┐
│  Frontend       │
│  (Port 5174)    │
│                 │
│  - Browse       │
│  - Cart         │
│  - Checkout     │
└────────┬────────┘
         │
         │ API Calls
         │
         ▼
┌─────────────────┐
│  Django Backend │
│  (Port 8000)    │
│                 │
│  - Products API │
│  - Orders API   │
│  - Database     │
└────────┬────────┘
         │
         │ API Calls
         │
         ▼
┌─────────────────┐
│  Admin Dashboard│
│  (Port 5173)    │
│                 │
│  - Manage       │
│  - Analytics    │
└─────────────────┘
```

---

## 🎨 Frontend Features (Gen Z Enhanced)

Your frontend now includes:

### Visual Enhancements
- ✨ Vibrant gradient color palette
- 🎬 Smooth micro-animations
- 🪟 Glassmorphism effects
- 🎨 Modern typography (Inter & Outfit fonts)
- 📱 Mobile-optimized design

### Interactive Elements
- 🖱️ Mouse-tracking gradient orbs
- 💫 Floating animated icons
- 🎯 Staggered entrance animations
- 🔘 Gradient buttons with shimmer effects
- 🎪 Interactive product cards

### Components
- 🏠 Enhanced hero section
- 🛍️ Modern product grid
- 🛒 Stylish cart drawer
- 📊 Trust indicators
- 🦶 Premium footer

---

## 📝 Environment Configuration

### Frontend (.env)
```
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

### Dashboard (.env)
```
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

---

## 🐛 Troubleshooting

### Frontend not loading products?
- ✅ Check Django backend is running
- ✅ Visit `http://127.0.0.1:8000/api/v1/products/` directly
- ✅ Check browser console for errors

### Dashboard can't connect?
- ✅ Verify backend is running
- ✅ Check `.env` file has correct API URL
- ✅ Check CORS settings in Django

### Port conflicts?
- ✅ Frontend: Change port in `vite.config.ts`
- ✅ Dashboard: Change port in its `vite.config.ts`
- ✅ Backend: Use `python manage.py runserver 8001`

---

## 📚 Documentation Files

- `GEN_Z_UI_ENHANCEMENTS.md` - Complete UI/UX improvements
- `DESIGN_SYSTEM_REFERENCE.md` - Design system quick reference
- `BEFORE_AFTER_COMPARISON.md` - Visual transformation details
- `DEPLOYMENT.md` - Deployment instructions

---

## 🎯 Quick Start Checklist

- [ ] Start Django backend
- [ ] Verify frontend is running
- [ ] Start admin dashboard
- [ ] Test product browsing
- [ ] Test checkout flow
- [ ] Test admin order management
- [ ] Test adding new products

---

**All services ready!** Start the backend and dashboard to test the complete system! 🚀
