# 🔍 Debugging Guide - Products Not Showing

## Problem
Products added via the dashboard are not appearing on the frontend website.

## ✅ Debugging Steps Added

I've added detailed console logging to help identify the issue. Here's what to do:

---

## 🧪 Step 1: Check Browser Console

1. Open your frontend website: `http://localhost:5174/`
2. Open browser DevTools (F12 or Right-click → Inspect)
3. Go to the **Console** tab
4. Refresh the page
5. Look for these log messages:

### Expected Console Output:

```
🔍 Fetching products from backend...
📡 API URL: http://127.0.0.1:8000/api/v1
🌐 API: Fetching products from: http://127.0.0.1:8000/api/v1
📡 API Response: { results: [...] }
📋 Product list: [...]
✅ Found X products in backend
📦 Backend products received: X products
✅ Using backend products
First product: { id: ..., name: ..., ... }
```

### If You See This Instead:

```
⚠️ No products found in backend response
📦 Backend products received: 0 products
⚠️ Backend returned no products - checking local storage
```

**This means**: The backend is responding but has no products.

---

## 🔧 Step 2: Test Backend Directly

Open a new browser tab and visit:
```
http://127.0.0.1:8000/api/v1/products/
```

### What You Should See:

**Option A - Products Exist:**
```json
{
  "results": [
    {
      "id": "...",
      "name": "Product Name",
      "price": "99.99",
      "category": "...",
      ...
    }
  ]
}
```

**Option B - No Products:**
```json
{
  "results": []
}
```

**Option C - Error:**
- Connection refused → Backend not running
- CORS error → CORS not configured
- 404 → Wrong URL

---

## 🐛 Common Issues & Solutions

### Issue 1: Backend Not Running
**Symptoms**: 
- Console shows network error
- Can't access `http://127.0.0.1:8000/api/v1/products/`

**Solution**:
```bash
cd /Users/mohamedghaly/Desktop/WomaBackend
python manage.py runserver
```

---

### Issue 2: No Products in Database
**Symptoms**:
- Backend responds with `{"results": []}`
- Console shows "0 products"

**Solution**:
1. Check if dashboard is connected to the same backend
2. Verify products were actually saved
3. Check Django admin: `http://127.0.0.1:8000/admin/`

---

### Issue 3: CORS Error
**Symptoms**:
- Console shows CORS policy error
- Network tab shows request blocked

**Solution**:
Add to Django `settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5174",
    "http://localhost:5173",
]
```

---

### Issue 4: Dashboard Using Different Backend
**Symptoms**:
- Products show in dashboard
- But not in frontend
- Backend API shows no products

**Solution**:
Check dashboard's `.env` file:
```bash
cd /Users/mohamedghaly/Desktop/WomaDashboard
cat .env
```

Should show:
```
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

---

### Issue 5: Wrong API Endpoint
**Symptoms**:
- 404 errors in console
- Products endpoint not found

**Solution**:
Verify Django URLs are configured:
```python
# urls.py
urlpatterns = [
    path('api/v1/products/', ...),
]
```

---

## 📊 Diagnostic Checklist

Run through this checklist:

- [ ] Backend is running (`python manage.py runserver`)
- [ ] Can access `http://127.0.0.1:8000/api/v1/products/` in browser
- [ ] Backend returns products (not empty array)
- [ ] Frontend `.env` has correct API URL
- [ ] Dashboard `.env` has same API URL as frontend
- [ ] No CORS errors in console
- [ ] No network errors in console
- [ ] Products were saved successfully in dashboard

---

## 🔍 Advanced Debugging

### Check Network Tab

1. Open DevTools → **Network** tab
2. Refresh the page
3. Look for request to `/products/`
4. Click on it to see:
   - **Status**: Should be 200
   - **Response**: Should contain products
   - **Headers**: Check CORS headers

### Check Django Logs

In the terminal running Django, you should see:
```
GET /api/v1/products/ 200 OK
```

If you see:
- `404` → Endpoint doesn't exist
- `500` → Server error (check Django console for traceback)
- No log → Request not reaching backend

---

## 🎯 Quick Test

Run this in browser console on the frontend:
```javascript
fetch('http://127.0.0.1:8000/api/v1/products/')
  .then(r => r.json())
  .then(data => console.log('Products:', data))
  .catch(err => console.error('Error:', err));
```

This will show if the frontend can reach the backend.

---

## 📝 What to Report

If the issue persists, share:

1. **Console logs** from frontend
2. **Network tab** screenshot showing the `/products/` request
3. **Backend response** from `http://127.0.0.1:8000/api/v1/products/`
4. **Django terminal** output
5. **Dashboard `.env`** content
6. **Frontend `.env`** content

---

## 🚀 Next Steps

After checking the console logs, you'll know exactly where the problem is:

- **No products in backend** → Add products via dashboard and verify they save
- **CORS error** → Configure CORS in Django
- **Network error** → Start the backend
- **Wrong URL** → Check `.env` files

The detailed logging will pinpoint the exact issue! 🎯
