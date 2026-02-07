# Eatonic 🍽️

A modern, full-stack food delivery and restaurant management platform that connects users, restaurant owners, and delivery personnel in a seamless ecosystem.

## 📋 Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Project Architecture](#project-architecture)
- [Future Improvements](#future-improvements)
- [Author](#author)
- [License](#license)

---

## 🎯 Project Description

### Problem
Traditional food delivery and restaurant management systems lack integrated solutions for managing restaurants, items, orders, and delivery logistics all in one place.

### Solution
**Eatonic** is a comprehensive web platform that:
- Allows users to browse and order food from multiple restaurants
- Enables restaurant owners to manage their shops, items, and inventory
- Provides delivery personnel with order tracking and management tools
- Implements secure authentication with OTP verification and password reset
- Integrates cloud-based image storage via Cloudinary
- Offers role-based access control (User, Owner, Delivery Boy)

---

## ✨ Features

### User Features
- 🔐 Secure signup/signin with email verification
- 🔑 OTP-based password reset functionality
- 🌐 Google OAuth authentication integration
- 🏪 Browse restaurants and food items by city
- 📦 Browse items by category and food type (Veg, Non-Veg, Vegan)
- 🎨 Dark/Light theme toggle
- 📍 Location-based filtering

### Restaurant Owner Features
- 🏢 Create and manage restaurant profile with image upload
- 📝 Add, edit, and manage food items
- 📊 Dashboard for order management
- � Accept/reject orders and update status
- 👨‍💼 Assign delivery personnel to orders
- �🚀 Real-time inventory updates
- 📸 Image upload via Cloudinary CDN

#### Owner Dashboard

- **Purpose:** A centralized control panel for restaurant owners to manage shop profile, items, orders, deliveries, and performance metrics from one place.
- **Key UI components:** `OwnerDashboard.jsx`, `OwnerItemCard.jsx`, `CreateEditShop.jsx`, order detail modal, notifications panel.
- **Order management:** Live order feed with filters (new, pending, preparing, picked, delivered, cancelled), ability to accept/reject orders, batch update statuses, view order itemization and customer contact, and assign/reassign delivery personnel.
- **Inventory & availability:** At-a-glance inventory levels for each item or variant, manual availability toggles, scheduling (set item availability windows), low-stock thresholds and automatic low-stock alerts.
- **Shop settings:** Edit shop profile (images, address, city/state, operating hours), open/close toggle, delivery settings, and contact information.
- **Analytics & reports:** Sales summary (daily/weekly/monthly), top-selling items, order volume trends, revenue breakdown by item/category, and exportable CSV reports for bookkeeping.
- **Notifications & integrations:** Email/SMS or in-app notifications for new orders, low stock, and failed payments; optional webhook or WebSocket hooks for real-time updates.

#### Item Management

- **Purpose:** Tools for creating, editing, organizing, and monitoring menu items with support for images, categories, variants, and inventory tracking.
- **Item CRUD:** `AddItem.jsx` and `EditItem.jsx` provide fields for name, description, price, category, food type (Veg/Non-Veg/Vegan), images (Cloudinary), SKU/variant support, and availability toggles.
- **Variants & modifiers:** Support item variants (size, spice level) and add-on modifiers with independent pricing and stock tracking per variant.
- **Inventory controls:** Track stock quantity per item/variant, set low-stock thresholds, schedule out-of-stock windows, and mark items temporarily unavailable.
- **Pricing & promotions:** Base price, discount fields, percentage or fixed-price promotions, and the ability to schedule promotional pricing windows.
- **Bulk operations:** CSV import/export for items, bulk price updates, and bulk availability toggles to speed up management during busy periods.
- **Image handling & preview:** Client-side compression/validation + Cloudinary upload; preview images in `OwnerItemCard.jsx` before publishing.
- **Validation & UX:** Client- and server-side validation for required fields (name, price, category), clear success/error feedback, and optimistic UI updates for a responsive owner experience.
- **Related API endpoints:** `POST /api/item/add-item`, `POST /api/item/edit-item/:itemId`, `GET /api/shop/:shopId/items` (owner-scoped access enforced by `isAuth` and role checks).
### Delivery Personnel Features
- 📦 View assigned deliveries and order details
- 🗺️ Track delivery status and update progress
- ✅ Mark orders as delivered with confirmation
- 📍 Access delivery address and customer details
- 📊 Delivery analytics dashboard

### Admin & Security Features
- 🔒 JWT-based authentication with HTTP-only cookies
- 🛡️ Password encryption with bcrypt
- 📧 Email notifications via Nodemailer
- 🖼️ Image optimization with Cloudinary
- ✅ Request validation and error handling

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 with Vite
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios
- **Authentication:** Firebase
- **Animations:** Framer Motion
- **Icons:** React Icons & Lucide React
- **UI Enhancements:** React Spinners
- **Build Tool:** Vite
- **Linting:** ESLint

### Backend
- **Runtime:** Node.js with ES Modules
- **Framework:** Express.js v5
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken) with bcrypt/bcryptjs
- **File Upload:** Multer
- **Image Storage:** Cloudinary
- **Email Service:** Nodemailer
- **Security:** CORS, Cookie Parser
- **Development:** Nodemon

### Database
- **Primary:** MongoDB (Cloud or Local)
- **Collections:** Users, Shops, Items, Orders

### APIs & Services
- **Google OAuth:** Firebase Authentication
- **Image Hosting:** Cloudinary CDN
- **Email Service:** Nodemailer SMTP

---

## 📁 Folder Structure

```
Eatonic/
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DeliveryBoyDashboard.jsx    # Delivery personnel dashboard
│   │   │   ├── OwnerDashboard.jsx          # Restaurant owner dashboard
│   │   │   ├── UserDashboard.jsx           # Customer dashboard
│   │   │   ├── Nav.jsx                     # Navigation component
│   │   │   ├── Footer.jsx                  # Footer component
│   │   │   ├── ProtectedRoute.jsx          # Auth-protected route wrapper
│   │   │   └── PublicRoute.jsx             # Public route wrapper
│   │   ├── pages/
│   │   │   ├── Landing.jsx                 # Landing/home page
│   │   │   ├── Home.jsx                    # Main dashboard
│   │   │   ├── SignUp.jsx                  # User registration
│   │   │   ├── SignIn.jsx                  # User login
│   │   │   └── ForgotPassword.jsx          # Password recovery
│   │   ├── hooks/
│   │   │   ├── useGetCurrentUser.jsx       # Fetch current user data
│   │   │   └── useGetCity.jsx              # Get user's current city
│   │   ├── redux/
│   │   │   ├── store.js                    # Redux store configuration
│   │   │   ├── userSlice.js                # User state management
│   │   │   └── orderSlice.js               # Order state management
│   │   ├── services/
│   │   │   └── orderAPI.js                 # Order API service
│   │   ├── assets/                         # Images, fonts, static files
│   │   ├── App.jsx                         # Main app component
│   │   ├── main.jsx                        # React entry point
│   │   ├── index.css                       # Global styles
│   │   └── firebase.js                     # Firebase configuration
│   ├── public/                             # Static public files
│   ├── package.json                        # Frontend dependencies
│   ├── vite.config.js                      # Vite configuration
│   ├── eslint.config.js                    # ESLint rules
│   └── index.html                          # HTML template
│
├── Backend/
│   ├── config/
│   │   └── db.js                           # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controllers.js             # Authentication logic
│   │   ├── user.controllers.js             # User operations
│   │   ├── shop.controllers.js             # Shop operations
│   │   ├── item.controllers.js             # Item operations
│   │   └── order.controllers.js            # Order operations
│   ├── models/
│   │   ├── user.model.js                   # User schema
│   │   ├── shop.model.js                   # Shop schema
│   │   ├── item.model.js                   # Item schema
│   │   └── order.model.js                  # Order schema
│   ├── routes/
│   │   ├── auth.routes.js                  # Auth endpoints
│   │   ├── user.routes.js                  # User endpoints
│   │   ├── shop.routes.js                  # Shop endpoints
│   │   ├── item.routes.js                  # Item endpoints
│   │   └── order.routes.js                 # Order endpoints
│   ├── middlewares/
│   │   ├── isAuth.js                       # JWT authentication middleware
│   │   └── multer.js                       # File upload configuration
│   ├── utils/
│   │   ├── cloudinary.js                   # Cloudinary image service
│   │   ├── mail.js                         # Email sending service
│   │   └── token.js                        # JWT token utilities
│   ├── public/                             # Static files
│   ├── index.js                            # Server entry point
│   └── package.json                        # Backend dependencies
│
├── .gitignore                              # Git ignore rules
├── .github/                                # GitHub workflows
└── README.md                               # Project documentation
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (Cloud: MongoDB Atlas, or Local)
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file** with required variables (see [Environment Variables](#environment-variables))

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file** with Firebase and API configuration (see [Environment Variables](#environment-variables))

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

### Verification
- Frontend should be accessible at `http://localhost:5173`
- Backend API should be accessible at `http://localhost:8000`
- Both should be running for full functionality

---

## 🔐 Environment Variables

### Backend `.env`

```env
# Server Configuration
PORT=8000

# Database
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/eatonic

# JWT & Security
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Email Service (Nodemailer)
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM_EMAIL=your_email@gmail.com

# Cloudinary (Image Upload)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env.local`

```env
# Firebase Configuration
VITE_FIREBASE_APIKEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_PROJECT_ID=your_firebase_project_id
VITE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_APP_ID=your_firebase_app_id

# Backend API
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/signup` | Register new user | ❌ |
| POST | `/signin` | Login user | ❌ |
| GET | `/signout` | Logout user | ✅ |
| POST | `/send-otp` | Send OTP for password reset | ❌ |
| POST | `/verify-otp` | Verify OTP | ❌ |
| POST | `/reset-password` | Reset password with OTP | ❌ |
| POST | `/google-auth` | Google OAuth authentication | ❌ |

**Request/Response Examples:**

```javascript
// POST /api/auth/signup
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass@123",
  "mobile": "+91-9876543210",
  "role": "user" // or "owner", "deliveryBoy"
}

// POST /api/auth/signin
{
  "email": "john@example.com",
  "password": "SecurePass@123"
}

// POST /api/auth/send-otp
{
  "email": "john@example.com"
}

// POST /api/auth/verify-otp
{
  "email": "john@example.com",
  "otp": "123456"
}

// POST /api/auth/reset-password
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "NewPass@456"
}
```

### User (`/api/user`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/current` | Get current logged-in user | ✅ |

### Shop (`/api/shop`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/create-edit` | Get/Create shop profile | ✅ |

**Shop Schema:**
```javascript
{
  "name": "Pizza Palace",
  "image": "cloudinary_url",
  "owner": "userId",
  "city": "Mumbai",
  "state": "Maharashtra",
  "address": "123 Main Street",
  "items": ["itemId1", "itemId2"],
  "isOpen": true
}
```

### Item (`/api/item`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/add-item` | Add new item to shop | ✅ |
| POST | `/edit-item/:itemId` | Update item details | ✅ |

**Item Schema:**
```javascript
{
  "name": "Margherita Pizza",
  "image": "cloudinary_url",
  "shop": "shopId",
  "category": "Pizza", // See enum in item.model.js
  "price": 299,
  "foodType": "Veg", // "Veg", "Non-Veg", "Vegan"
  "isAvailable": true
}
```

**Available Food Categories:**
Fast Food, Street Food, Beverages, Hot Beverages, Cold Beverages, Dessert, Bakery, Snacks, Breakfast, Lunch, South Indian, North Indian, Chinese, Italian, Continental, Healthy Food, Salads, Biryani, Rolls, Pizza, Burger, Sandwich, Others

### Order (`/api/order`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/create` | Create new order | ✅ | User |
| GET | `/user` | Get user's order history | ✅ | User |
| GET | `/:orderId` | Get single order by ID | ✅ | User/Owner/DeliveryBoy |
| GET | `/owner/all-orders` | Get orders for owner's shop | ✅ | Owner |
| GET | `/delivery/assigned-orders` | Get assigned deliveries | ✅ | DeliveryBoy |
| PATCH | `/:orderId/status` | Update order status | ✅ | Owner/DeliveryBoy |
| POST | `/assign-delivery` | Assign delivery boy to order | ✅ | Owner |

**Create Order Request:**
```javascript
POST /api/order/create
{
  "items": [
    { "itemId": "item_id_1", "quantity": 2 },
    { "itemId": "item_id_2", "quantity": 1 }
  ],
  "shopId": "shop_id",
  "deliveryAddress": "123 Main Street, City, State 12345",
  "notes": "Extra spicy please"
}
```

**Update Order Status Request:**
```javascript
PATCH /api/order/:orderId/status
{
  "status": "accepted" // pending, accepted, preparing, picked, delivered, cancelled
}
```

**Assign Delivery Boy Request:**
```javascript
POST /api/order/assign-delivery
{
  "orderId": "order_id",
  "deliveryBoyId": "user_id"
}
```

**Order Response Schema:**
```javascript
{
  "_id": "order_id",
  "user": {
    "_id": "user_id",
    "fullname": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210"
  },
  "shop": {
    "_id": "shop_id",
    "name": "Pizza Palace",
    "city": "Mumbai",
    "address": "123 Main Street"
  },
  "items": [
    {
      "item": {
        "_id": "item_id",
        "name": "Margherita Pizza",
        "price": 299,
        "category": "Pizza"
      },
      "quantity": 2,
      "price": 299
    }
  ],
  "totalAmount": 598,
  "paymentStatus": "pending", // pending, completed, failed
  "orderStatus": "pending", // pending, accepted, preparing, picked, delivered, cancelled
  "deliveryAddress": "123 Main Street, City",
  "deliveryBoy": null,
  "notes": "Extra spicy",
  "createdAt": "2024-02-07T10:30:00Z",
  "updatedAt": "2024-02-07T10:30:00Z"
}
```

---

## 🏗️ Project Architecture

### Three-Role Architecture

**1. User (Customer)**
- Browse restaurants and food items
- Filter by city, category, and food type
- View restaurant details
- Place orders (future feature)

**2. Owner (Restaurant Manager)**
- Create and manage restaurant profile
- Add and edit food items with images
- Manage inventory status
- Track orders (future feature)

**3. Delivery Boy**
- Receive order assignments
- Update delivery status
- Track deliveries in real-time
- Analytics dashboard

### Authentication Flow

1. User registers with email and password
2. Password encrypted using bcrypt
3. JWT token issued upon login
4. Token stored in HTTP-only cookie
5. Middleware validates token on protected routes
6. OTP sent via email for password reset
7. Google OAuth integration for quick signup

### Data Models

**User Collection:**
- Full name, email, phone
- Encrypted password
- Role (user/owner/deliveryBoy)
- OTP verification status
- Account timestamps

**Shop Collection:**
- Shop name, location (city/state/address)
- Owner reference
- Operating status
- Items array (references)
- Image (via Cloudinary)

**Item Collection:**
- Food item details (name, price)
- Category and food type classification
- Availability status
- Shop reference
- Image (via Cloudinary)

**Order Collection:**
- User reference (customer)
- Shop reference (restaurant)
- Items array (with quantity and price)
- Total amount
- Payment status (pending, completed, failed)
- Order status (pending, accepted, preparing, picked, delivered, cancelled)
- Delivery boy assignment (optional)
- Delivery address
- Special notes
- Timestamps

---

## 🔮 Future Improvements

- [x] **Order Management** - Complete order placement, tracking, and status updates
- [ ] **Payment Integration** - Add Stripe/Razorpay for payments
- [ ] **Real-time Updates** - WebSocket integration for live order updates
- [ ] **Email Notifications** - Order confirmation and status update emails
- [ ] **Reviews & Ratings** - User ratings for shops and items
- [ ] **Search & Filters** - Advanced search with filters (price, ratings, distance)
- [ ] **Order History** - User order history and repeat ordering
- [ ] **Push Notifications** - Real-time delivery status notifications
- [ ] **Admin Dashboard** - Platform analytics and moderation
- [ ] **Mobile App** - React Native mobile application
- [ ] **API Documentation** - Swagger/OpenAPI specification
- [ ] **Testing** - Unit and integration tests
- [ ] **Performance Optimization** - Caching, pagination, lazy loading
- [ ] **Multi-language Support** - i18n implementation

---

## 👨‍💻 Author

**Ashutosh Mishra**
- GitHub: [@ashutosh](https://github.com/mishraashutosh25/Eatonic)
- Email:ashutoshmishra.dev25@gmail.com


---

## 📄 License

This project is licensed under the **ISC License** - see the LICENSE file for details.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

For issues, questions, or feedback, please open an issue on GitHub or contact the maintainers.

**Happy Coding! 🚀**
