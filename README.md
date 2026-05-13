# Stax — Store Management System

A fullstack store management system built for internal store operations.
Designed for store owners and staff to manage inventory, process orders
and monitor revenue — all from one clean, fast dashboard.

![Status](https://img.shields.io/badge/Status-Live-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-18-339933)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248)

---

## Live Demo

| | URL |
|---|---|
| Frontend | https://management-system-delta-mocha.vercel.app |
| Backend API | https://stax-api-rx5n.onrender.com |

**Demo Credentials**
| Field | Value |
|---|---|
| Email | admin@stax.com |
| Password | admin123 |

> The login page has a **"Try Demo Account"** button that fills
> credentials automatically.

---

## What This Is

This is not a customer-facing storefront. It is an internal operations
tool — built for the people who run the store.

A staff member opens the dashboard when a customer places an order,
selects the product, fills in the customer details, and creates the
order. As the order progresses, they update the status from Pending
to Processing to Shipped to Delivered. The dashboard reflects
everything in real time.

---

## Features

**Authentication**
- JWT-based login with secure token storage
- Role-based access — Admin and Staff roles
- Protected routes on both frontend and backend
- Auto-redirect on token expiry

**Dashboard**
- Revenue overview chart (last 7 days)
- Live stats — total revenue, orders, products, low stock count
- Order status breakdown with progress bars
- Recent orders table

**Product Management**
- Add, edit, delete products
- Search by name or SKU
- Filter by category
- Stock indicators — In Stock, Low Stock, Out of Stock
- Stock auto-reduces when an order is placed

**Order Management**
- Create orders with product selection from dropdown
- Dropdown shows live stock remaining per product
- Disables out-of-stock products automatically
- Update order status inline — no page reload
- View full order details in modal
- Revenue counts only delivered orders

---

## Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React 18 + TypeScript | UI with compile-time type safety |
| Tailwind CSS v3 | Utility-first styling |
| React Router v6 | Client-side routing |
| Axios | HTTP client with request interceptors |
| Recharts | Revenue line chart |
| Lucide React | Icon system |
| React Hot Toast | Toast notifications |

### Backend
| Tool | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB Atlas | Cloud-hosted NoSQL database |
| Mongoose | Schema modeling and validation |
| JSON Web Token | Stateless authentication |
| Bcrypt.js | Password hashing |
| CORS | Cross-origin request handling |
| Dotenv | Environment variable management |

### Hosting
| Service | What runs there |
|---|---|
| Vercel | React frontend |
| Render | Node.js backend |
| MongoDB Atlas | Database (free tier M0) |

---

## Project Structure
store-management/
│
├── client/                          # React + TypeScript
│   └── src/
│       ├── api/
│       │   ├── axios.ts             # Axios instance + interceptors
│       │   ├── products.ts          # Product API functions
│       │   └── orders.ts            # Order API functions
│       ├── components/
│       │   ├── Layout.tsx           # App shell
│       │   ├── Sidebar.tsx          # Navigation
│       │   ├── Navbar.tsx           # Top bar
│       │   └── ui/
│       │       ├── StatCard.tsx     # Dashboard stat cards
│       │       ├── Badge.tsx        # Order status badges
│       │       ├── Modal.tsx        # Reusable modal
│       │       └── Input.tsx        # Form input
│       ├── context/
│       │   └── AuthContext.tsx      # Global auth state
│       ├── pages/
│       │   ├── auth/
│       │   │   └── LoginPage.tsx
│       │   ├── DashboardPage.tsx
│       │   ├── ProductsPage.tsx
│       │   └── OrdersPage.tsx
│       └── types/
│           └── index.ts             # TypeScript interfaces
│
└── server/                          # Node.js + Express
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   └── orderController.js
├── middleware/
│   └── authMiddleware.js        # JWT protect + adminOnly
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   └── orderRoutes.js
└── index.js

---

## API Reference

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Create account |
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/me | Protected | Get current user |

### Products
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/products | Protected | Get all products |
| GET | /api/products/:id | Protected | Get single product |
| POST | /api/products | Admin | Create product |
| PUT | /api/products/:id | Admin | Update product |
| DELETE | /api/products/:id | Admin | Delete product |

### Orders
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/orders | Protected | Get all orders |
| GET | /api/orders/:id | Protected | Get single order |
| POST | /api/orders | Protected | Create order |
| PUT | /api/orders/:id | Admin | Update status |
| DELETE | /api/orders/:id | Admin | Delete order |

---

## Local Setup

**Prerequisites:** Node.js v18+, MongoDB Atlas account, Git

```bash
# Clone
git clone https://github.com/Parkohsam/management-system.git
cd management-system

# Backend
cd server
npm install

# Create server/.env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
NODE_ENV=development

npm run dev

# Frontend (new terminal)
cd ../client
npm install
npm run dev
```

Create your first admin account:

POST http://localhost:5000/api/auth/register
{
"name": "Store Admin",
"email": "admin@stax.com",
"password": "admin123",
"role": "admin"
}

Open: http://localhost:5173

---

## Design Decisions

**Why TypeScript on the frontend?**
State management and API response handling are where type errors hurt
most. TypeScript catches these at compile time — before they reach
production.

**Why JWT over sessions?**
The API and frontend are deployed on separate domains. JWT is
stateless and works cleanly across origins without session storage.

**Why does stock reduce on order creation, not delivery?**
To prevent overselling. If two orders come in simultaneously for the
last unit, only the first should succeed. Reducing stock immediately
on order creation enforces this.

**Why does revenue only count delivered orders?**
Pending and processing orders can be cancelled. Counting them as
revenue would give an inflated and inaccurate picture of realized
earnings.

---

## What I Would Add Next

- Staff account management from the admin dashboard
- Product image uploads (Cloudinary)
- Export orders and revenue reports to PDF / Excel
- Low stock email alerts (Nodemailer)
- Pagination on products and orders tables

---

## Author

**Adediran Usama**
GitHub: https://github.com/Parkohsam
Email: ajaoadediran@gmail.com

---

Built as a technical assessment for Stax Software — May 2026
