# 🚀 Deployment Guide - Woma Website

## ✅ What's Been Updated

1. **Removed Shopify Integration** - Cleaned up old Shopify code
2. **Added Django Backend Integration** - Connected to your production API
3. **Environment Configuration** - Added `.env` for API URL
4. **Updated Documentation** - README with deployment instructions

---

## 🔗 Backend Connection

Your frontend is now connected to:
```
https://warm-hippopotamus-ghaly-fafb8bcd.koyeb.app/api/v1
```

---

## 🚀 Deploy to Netlify

### Quick Deploy Steps

1. **Go to Netlify**
   - Visit: https://app.netlify.com

2. **Import from GitHub**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select: `Mohamedghaly/WomaWebsite`

3. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18 or higher

4. **Add Environment Variable**
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL` = `https://warm-hippopotamus-ghaly-fafb8bcd.koyeb.app/api/v1`

5. **Deploy!**
   - Click "Deploy site"
   - Wait 2-3 minutes

---

## 🧪 Test Locally First

Before deploying, test locally:

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit http://localhost:5173 and verify:
- ✅ Products load from backend
- ✅ Product details work
- ✅ Cart functionality works
- ✅ No console errors

---

## 📋 Your Complete Stack

| Component | Status | URL |
|-----------|--------|-----|
| **Backend API** | ✅ Live | https://warm-hippopotamus-ghaly-fafb8bcd.koyeb.app |
| **Admin Dashboard** | ✅ Live | https://YOUR-DASHBOARD.netlify.app |
| **Website** | 🚀 Ready | Deploy to Netlify now! |
| **Database** | ✅ Connected | Turso (libsql) |

---

## 🔧 Files Changed

- ✅ `services/api.ts` - New Django API client
- ✅ `contexts/StoreContext.tsx` - Updated to use Django API
- ✅ `.env` - Environment configuration
- ✅ `README.md` - Updated documentation
- ❌ `services/shopify.ts` - Removed

---

## 📝 Next Steps

1. **Test Locally** - Run `npm run dev` and test
2. **Deploy to Netlify** - Follow steps above
3. **Add Products** - Use admin dashboard to add products
4. **Test Live Site** - Verify everything works in production

---

## 🐛 Troubleshooting

### Products not loading?
- Check backend is running: https://warm-hippopotamus-ghaly-fafb8bcd.koyeb.app/api/v1/products/
- Check browser console for errors
- Verify CORS is configured in backend

### Build fails on Netlify?
- Make sure Node version is 18+
- Check build logs for specific errors
- Verify all dependencies are in package.json

---

**Ready to deploy?** Go to https://app.netlify.com! 🎉
