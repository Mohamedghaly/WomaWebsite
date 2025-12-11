# WOMA Sportswear - E-commerce Platform

A modern, fully-featured e-commerce platform built with React, TypeScript, and Django.

## 🚀 Features

### Public Website
- Modern, responsive design
- Product catalog with categories
- Shopping cart functionality
- Dynamic theme customization
- SEO optimized

### Admin Dashboard
- Complete product management (CRUD)
- Category management
- Order processing and status tracking
- Utilities management (colors, sizes, delivery locations)
- **Dynamic website settings** - Control all website content from the dashboard!

### Website Settings (NEW!)
Fully customizable website from admin panel:
- 🏷️ Branding (site name, logo, tagline)
- 🎯 Hero section (title, CTA, background)
- 🎨 Theme colors (5 customizable colors)
- 📝 Content (about section, contact info)
- 🔗 Social media links
- 🚀 SEO settings
- ⚙️ Features (newsletter, chat, maintenance mode)

## 📁 Project Structure

```
WomaWebsite/
├── components/
│   ├── admin/              # Admin-only components
│   │   ├── AdminLayout.tsx
│   │   ├── AdminModal.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── Toast.tsx
│   ├── CartDrawer.tsx
│   └── Navbar.tsx
├── pages/
│   ├── admin/              # Admin pages
│   │   ├── AdminLogin.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminProducts.tsx
│   │   ├── AdminCategories.tsx
│   │   ├── AdminOrders.tsx
│   │   ├── AdminUtilities.tsx
│   │   └── AdminWebsiteSettings.tsx
│   ├── Home.tsx
│   └── Shop.tsx
├── contexts/               # React contexts
│   ├── AdminAuthContext.tsx
│   ├── SettingsContext.tsx
│   └── StoreContext.tsx
├── services/               # API services
│   ├── admin/
│   │   └── adminApi.ts
│   ├── api.ts
│   ├── geminiService.ts
│   └── storage.ts
├── types/                  # TypeScript types
│   └── settings.ts
├── utils/                  # Utility functions
│   └── helpers.ts
├── styles/                 # Stylesheets
│   ├── admin.css
│   └── styles.css
├── docs/                   # Documentation
├── App.tsx
├── index.tsx
└── index.html
```

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Routing**: React Router DOM v6
- **State Management**: React Context API
- **Build Tool**: Vite
- **Styling**: CSS with Tailwind
- **Backend**: Django REST Framework
- **Hosting**: Netlify (Frontend), Koyeb (Backend)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/woma-project.git
cd woma-project/WomaWebsite
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your API URLs
```

4. Run development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## 🔐 Admin Access

### Default Credentials
- Email: `admin@woma.com`
- Password: `admin123`

### Admin Routes
- `/admin/login` - Login page
- `/admin/dashboard` - Dashboard overview
- `/admin/products` - Product management
- `/admin/categories` - Category management
- `/admin/orders` - Order management
- `/admin/utilities` - Colors, sizes, delivery locations
- `/admin/settings` - Website settings (NEW!)

## 📊 API Integration

### Backend URL
- Development: `http://localhost:8000/api/v1`
- Production: `https://warm-hippopotamus-ghaly-fafb8bcd.koyeb.app/api/v1`

### Key Endpoints
- `/auth/login/` - Authentication
- `/products/` - Product catalog
- `/admin/products/` - Product management
- `/admin/categories/` - Category management
- `/admin/orders/` - Order management
- `/admin/settings/` - Website settings

## 🎨 Customization

### Dynamic Website Settings
All website content can be customized from the admin dashboard at `/admin/settings`:

1. **Branding**: Site name, logo, favicon
2. **Hero Section**: Main banner content
3. **Theme Colors**: Customize the entire color scheme
4. **Content**: About section, contact information
5. **Social Media**: Link all your social profiles
6. **SEO**: Meta tags and descriptions
7. **Features**: Toggle newsletter, chat, maintenance mode

### Theme Colors
Theme colors are applied as CSS variables:
- `--primary-color`
- `--secondary-color`
- `--accent-color`
- `--background-color`
- `--text-color`

## 🧪 Testing

```bash
# Type checking
npx tsc --noEmit

# Lint
npm run lint

# Build
npm run build
```

## 📦 Deployment

### Netlify (Frontend)
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Environment Variables
- `VITE_API_URL` - Backend API URL
- `VITE_GEMINI_API_KEY` - Gemini AI API key (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## 📝 License

This project is proprietary and confidential.

## 📞 Support

For support, email support@woma.com

## 🎯 Recent Updates

### v2.0.0 - Dashboard Integration (December 2024)
- ✅ Integrated standalone dashboard into main app
- ✅ Added dynamic website settings system
- ✅ Implemented full CRUD for all entities
- ✅ Added TypeScript throughout
- ✅ Consolidated into single deployment
- ✅ Removed Python migration scripts
- ✅ Cleaned up unused files
- ✅ Optimized project structure

### Features Count
- 7 Admin pages
- 29 Customizable website settings
- 6 Entity types with full CRUD
- 100% TypeScript coverage
- 0 Lint errors

## 🚀 Performance

- Fast build times with Vite
- Code splitting for optimal loading
- TypeScript for type safety
- Optimized bundle size
- SEO friendly

## 📚 Additional Documentation

See the `docs/` folder for additional guides:
- Backend integration guide
- Deployment guide
- Design system reference
- Setup guide
- Debugging guide

---

**Built with ❤️ by the WOMA Team**
