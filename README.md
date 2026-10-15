# ShopKart (Kartify) — MERN Stack E-Commerce Platform

A production-ready Full-Stack MERN (MongoDB, Express, React, Node.js) E-Commerce application with Razorpay Test Payment Gateway integration, historical order snapshotting, real-time stock and price revalidation, global cart state synchronization, and an order progression tracker.

---

## 📑 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture & Flow](#-architecture--flow)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Setup & Installation Instructions](#-setup--installation-instructions)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Razorpay Test Payment Guide](#-razorpay-test-payment-guide)
- [Bonus Feature (+10 Marks): Order Progression](#-bonus-feature-10-marks-order-progression)

---

## 🚀 Features

### 🛒 Customer Experience
- **Authentication**: Secure customer signup, login, and logout using JWT and `httpOnly` cookies.
- **Product Catalog**: Live catalogue with categories, search, and dynamic pricing.
- **Wishlist & Cart**: Persistent shopping cart and customer wishlist.
- **Address & Shipping Validation**: Multi-field client and server validation (10-digit phone number, 6-digit postal pincode, whitespace rejection).
- **Checkout Review**: Real-time summary of quantities and order totals formatted in INR (`₹`).
- **Standard Razorpay Checkout**: Test Mode payment popup integration with smooth dismiss and error handling.
- **Order Confirmation**: Dedicated success screen (`/order-success/:id`) showing order summary and status.
- **Order History & Details**: View all past orders (`/orders`) and detailed breakdown (`/orders/:id`) with purchased product snapshots and shipping details.

### 🛡️ Backend & Business Rules
- **Historical Snapshotting**: Orders store a purchase-time snapshot of product details (name, price, quantity, and image) rather than only dynamic references. Subsequent changes to product prices or names never corrupt order history.
- **Server-Side Pricing Control**: Client-sent totals are strictly ignored. The backend queries MongoDB directly and calculates `totalAmount = Σ(product.price × quantity)`.
- **Live Stock Re-validation**: Live inventory is re-checked against MongoDB at checkout. If quantity exceeds stock, the order is rejected with `400 Bad Request`.
- **Paise Unit Conversion**: Amounts sent to Razorpay are properly multiplied by 100 (`Math.round(totalAmount * 100)`).
- **Mandatory Payment Signature Verification**: Uses Node.js built-in `crypto` module to compute HMAC SHA-256 using the trusted database-stored order ID (`order.razorpayOrderId + "|" + razorpay_payment_id`).
- **Safe Cart Reset**: The customer's cart is cleared **only after** signature verification succeeds. Failed or dismissed transactions preserve the cart items.
- **Protected Resources & Ownership**: Strict authorization guards ensure a customer can only read and manage their own orders (`403 Forbidden` on unauthorized attempts).

---

## 🛠 Tech Stack

- **Frontend**:
  - React.js (Vite)
  - React Router DOM
  - Context API (`AuthContext`, `CartContext`, `WishlistContext`)
  - Tailwind CSS
  - Axios (with `credentials: true`)
  - Razorpay Checkout SDK (`checkout.js`)
- **Backend**:
  - Node.js & Express.js (ES Modules)
  - MongoDB Atlas & Mongoose ODM
  - JSON Web Tokens (`jsonwebtoken`) & `cookie-parser`
  - Official Razorpay Node SDK (`razorpay`)
  - Node.js `crypto` module (HMAC SHA-256 verification)
  - `cors`, `dotenv`, `bcrypt`

---

## 🔄 Architecture & Flow

```
User Browses Products ➔ Add to Cart
              ↓
Proceed to Checkout (`/checkout`)
              ↓
Fill Shipping Details & Form Validation
              ↓
POST /orders/create-payment-order
  ├─ Verify Authentication
  ├─ Verify Cart Not Empty
  ├─ Fetch Live Products & Validate Stock
  ├─ Calculate Total Server-Side
  ├─ Create MongoDB Order (Status: PENDING_PAYMENT)
  └─ Create Razorpay Order (amount in paise)
              ↓
Frontend opens Razorpay Checkout Popup
              ↓
Customer completes Test Mode Payment
              ↓
POST /orders/verify-payment
  ├─ Compute HMAC SHA-256 (order.razorpayOrderId + "|" + payment_id)
  ├─ Compare with razorpay_signature
  ├─ Update Order to PAID + PLACED
  ├─ Save razorpayPaymentId
  └─ Clear User Cart in MongoDB
              ↓
Frontend syncs:
  ├─ Global cart cleared (`clearCart()`)
  ├─ Navbar updates immediately to Cart (0)
  └─ Redirect to /order-success/:id
```

---

## 📁 Project Structure

```text
Kartify_MERN_PROJECT/
├── Client/
│   ├── src/
│   │   ├── axiosCalls/
│   │   │   └── axios.js               # Axios instance with credentials
│   │   ├── components/
│   │   │   ├── CartItem.jsx
│   │   │   ├── Navbar.jsx             # Cart badge with live count sync
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProtectedRoutes.jsx
│   │   │   └── PublicRoutes.jsx
│   │   ├── context/
│   │   │   ├── authContext.jsx        # User state & authentication
│   │   │   ├── CartContext.jsx        # Global cart state & actions
│   │   │   └── wishListContext.jsx
│   │   ├── pages/
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx           # Shipping form & Razorpay trigger
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── OrderDetails.jsx       # Order detail, snapshots & status stepper
│   │   │   ├── Orders.jsx             # Order history list
│   │   │   ├── OrderSuccess.jsx       # Confirmation screen
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx                    # Route configuration
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── Server/
│   ├── config/
│   │   └── razorpay.js                # Razorpay SDK initialization
│   ├── controllers/
│   │   ├── cart.controllers.js
│   │   ├── customer.controllers.js
│   │   ├── order.controllers.js       # Order creation, verification & bonus logic
│   │   └── product.controllers.js
│   ├── middlewares/
│   │   └── authMiddleware.js          # Cookie & Bearer token verification
│   ├── models/
│   │   ├── customer.models.js
│   │   ├── order.models.js            # Historical order schema
│   │   ├── product.models.js
│   │   └── wishlist.models.js
│   ├── routes/
│   │   ├── cart.routes.js
│   │   ├── customer.routes.js
│   │   ├── order.routes.js            # Order endpoints
│   │   ├── product.routes.js
│   │   └── wishlist.routes.js
│   ├── .env                           # Backend environment variables
│   ├── index.js                       # Express application bootstrap
│   └── package.json
└── README.md
```

---

## ⚙️ Prerequisites

1. **Node.js**: `v20.19.0` or newer (or `v22.12.0` or newer). The Vite version used by this project requires one of these versions.
2. **MongoDB**: MongoDB Atlas connection string (or local MongoDB).
3. **Razorpay Account**: Free account on [dashboard.razorpay.com](https://dashboard.razorpay.com) in **Test Mode**.

---

## 🔧 Setup & Installation Instructions

### 1. Clone or Open the Repository
```bash
git clone <your-github-repository-url>
cd <repository-folder>
```

### 2. Configure Backend Environment Variables
Copy `Server/.env.example` to `Server/.env`, then replace each placeholder with your own values. In PowerShell:
```powershell
Copy-Item Server/.env.example Server/.env
```

Set a MongoDB connection string in `dbUrl`, a private random value in `JWT_SECRET`, and your Razorpay **test mode** credentials in the two Razorpay variables. Keep these real values in `Server/.env`; never commit or share that file. The root `.gitignore` excludes environment files and dependencies.

### 3. Install Backend Dependencies
```bash
cd Server
npm ci
```

### 4. Install Frontend Dependencies
```bash
cd ../Client
npm ci
```

---

## ▶️ Running the Application

### 1. Start the Backend Server
In the `Server` directory:
```bash
npm run dev
# or: node index.js
```
Expected output:
```text
Server started on port 8001
DB Connected
```

### 2. Start the Frontend Client
In a second terminal, inside the `Client` directory:
```bash
npm run dev
```
Open **`http://localhost:5173`** in your web browser.

---

## 📡 API Endpoints Reference

### 📦 Orders (`/orders`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/orders/create-payment-order` | ✅ Yes | Validates cart, stock, recalculates total, creates MongoDB order & Razorpay order |
| `POST` | `/orders` | ✅ Yes | Alias for `create-payment-order` (Postman test compatibility) |
| `POST` | `/orders/verify-payment` | ✅ Yes | Verifies HMAC signature, sets order `PAID` + `PLACED`, clears user cart |
| `GET` | `/orders` | ✅ Yes | Fetches all orders belonging to the logged-in user (newest first) |
| `GET` | `/orders/:id` | ✅ Yes | Fetches single order details (enforces ownership with `403 Forbidden`) |
| `PATCH`| `/orders/:id/status` | ✅ Yes | *(Bonus)* Updates progression status (`PLACED`, `CONFIRMED`, `SHIPPED`, `DELIVERED`) |

### 🛍️ Cart (`/cart`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/cart` | ✅ Yes | Retrieves user's current populated cart |
| `POST` | `/cart/:productId` | ✅ Yes | Adds item to cart with stock availability check |
| `PATCH`| `/cart/:productId` | ✅ Yes | Updates item quantity |
| `DELETE`| `/cart/:productId` | ✅ Yes | Removes item from cart |

### 👤 Customer (`/customer`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/customer/register` | ❌ No | Registers a new customer account |
| `POST` | `/customer/login` | ❌ No | Authenticates user and sets `token` cookie |
| `GET` | `/customer/me` | ✅ Yes | Fetches profile for logged-in user |
| `GET` | `/customer/logout` | ✅ Yes | Clears authentication cookie |

---

## 💳 Razorpay Test Payment Guide

1. Ensure your backend has valid test keys in `Server/.env`.
2. Add products to the cart and proceed to `/checkout`.
3. Fill in shipping details and click **Place Order**.
4. When the Razorpay Checkout popup appears:
   - Select **Netbanking** ➔ select any bank (e.g. SBI/HDFC) ➔ click **Pay**.
   - Select **Success** in the mock bank interface.
5. You will automatically be redirected to `/order-success/:id`.
6. Notice that:
   - The cart in the navbar becomes **Cart (0)**.
   - The order appears in `/orders`.
   - No real money is ever deducted.

---



Full order lifecycle progression has been implemented:

1. **Allowed Progression States**:
   `PLACED` ➔ `CONFIRMED` ➔ `SHIPPED` ➔ `DELIVERED`
2. **Visual Stepper UI**:
   Both the **Orders** page (`/orders`) and **Order Details** page (`/orders/:id`) render an interactive, color-coded progression bar.
3. **Live Demonstration Control**:
   On the Order Details page, an administrative dropdown allows you to change the order status live to demonstrate progression.
