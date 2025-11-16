# Harsh Mehta 202412048

# Full-Stack E-Commerce Application

This is a **deployed-ready**, full-stack e-commerce web application built for the **E-Commerce Development Exam**.  
It features a **dual-database architecture**, **role-based authentication**, and a **complete administrative dashboard**, all structured in a **monorepo** with separate frontend and backend services.

---

## Overview and Key Features

###  Complete E-Commerce Workflow  
From user registration to order placement, the app supports everything specified for a e-commerce system.

###  Dual Database Architecture  
- **MySQL** → Manages **Users** , **Orders** and **Order Items**  
- **MongoDB** → Stores the **Product Catalog**

###  Role-Based Authentication  
- **JWT Authentication** using `jsonwebtoken`
- Roles:  
  - **Admin** → Manage Product Catalog (CRUD) + Reports  
  - **Customer** → Browse, shop, manage cart, and place orders

###  Product Catalog  
- Browse products  
- Search  
- Category filtering  

###  Shopping Cart  
- Add items  
- Update quantities  
- Remove items  

###  Order Management  
- Checkout  
- View order history  

###  Admin Dashboard  
- Create, Read, Update, Delete products   

---

## Deployment URLs

**Frontend (Next.js):**  
https://ecommarce-test-app-frontend.vercel.app

**Backend (Node.js/Express):**  
https://ecommarce-test-app.vercel.app

---

## Admin Login Credentials

```
Email: admin@yopmail.com
Password: admin123
```

---

## Tech Stack

### **Backend (/backend)**
- Node.js  
- Express.js  
- Prisma ORM  
- MySQL + MongoDB  
- JWT Auth + bcrypt  
- CORS, dotenv  

### **Frontend (/frontend)**
- Next.js 14 (App Router)  
- TypeScript  
- Tailwind CSS  
- React Context API (Auth + Cart)  
- chart.js + react-chartjs-2  

---

# Setup & Installation

## Backend Setup (`/backend`)

### Install Dependencies
```bash
cd backend
npm install
```

### Backend `.env` File
Create `/backend/.env`:

```env
DATABASE_URL="mysql://user:password@host:port/database"
MONGO_URL="mongodb+srv://user:password@cluster.mongodb.net/database"
JWT_SECRET="YOUR_SUPER_SECRET_KEY_HERE"
FRONTEND_URL="https://ecommarce-test-app-frontend.vercel.app"
```

### Run Build Script  
This command will:

- Generate Prisma clients  
- Run MySQL migrations  
- Push MongoDB schema  
- Seed admin, customer, and sample products  

```bash
npm run build
```

### Start Backend
```bash
npm start
```

---

## Frontend Setup (`/frontend`)

### Install Dependencies
```bash
cd frontend
npm install
```

### Frontend `.env.local`
Create `/frontend/.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL="https://ecommarce-test-app.vercel.app"
```

---

# Database Migration Steps (Using Prisma)

Inside `/backend`:

```bash
npm run build
```

This handles:

- `prisma generate`  
- `prisma migrate deploy`  
- `prisma db push`  
- Database seeding  

---

# Testing Instructions

Run backend unit tests:

```bash
cd backend
npm test
```

---

# API Routes Summary

### Base Path: `/api`

### Health Check
```
GET /health
```

### Auth
```
POST /auth/register
POST /auth/login
```

###  Products
```
GET    /products
POST   /products        (Admin)
PUT    /products/:id    (Admin)
DELETE /products/:id    (Admin)
```

###  Orders
```
POST /orders/checkout
GET  /orders/my
GET  /orders/:id
```

---

# Frontend Routes

| Route | Description |
|-------|-------------|
| `/` | Home (featured products) |
| `/login` | User login |
| `/register` | User registration |
| `/products` | Catalog (search/filter/admin CRUD) |
| `/cart` | Shopping cart |
| `/orders` | Customer order history |
---

# End of Documentation

**Thats It use the ecom web app !!!**
