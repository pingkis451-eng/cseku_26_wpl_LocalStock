# 🛍️ LocalStock

**Smart Local Product Discovery & Availability Platform**

LocalStock connects customers with nearby retailers — search for a product, compare prices across local stores, check real-time stock, and reserve it online before you visit. Retailers get a simple digital storefront and dashboard without needing a full e-commerce setup.

[![Status](https://img.shields.io/badge/status-MVP%20in%20development-yellow)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()
[![Made with](https://img.shields.io/badge/made%20with-React%20%7C%20Node.js%20%7C%20MongoDB-brightgreen)]()

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Folder Structure](#-folder-structure)
- [API Overview](#-api-overview)
- [User Roles](#-user-roles)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Team](#-team)
- [License](#-license)

---

## 📌 About the Project

Finding out whether a nearby shop actually has a product in stock usually means calling around or visiting in person — often only to find it's unavailable. **LocalStock** solves this by giving local retailers a lightweight digital storefront and giving customers a single place to search, compare, and reserve products from stores near them.

This is a **web-based MVP**, built as part of a Web Development course project, with a mobile app planned as a future extension. The project follows an **agent-in-the-loop engineering approach** — AI agents assist with requirements, design, development, testing, and documentation, with every output reviewed by the human team before it's merged.

---

## ✨ Key Features

### For Customers
- 🔍 Search products by keyword, category, or brand
- 💰 Compare prices for the same product across nearby stores
- 📍 Discover nearby stores on a map or list view
- 📦 See real-time stock status (In Stock / Low Stock / Out of Stock)
- 🛒 Reserve a product online before visiting the store
- 🔔 Track reservation status and history

### For Retailers
- 🏪 Create and manage a digital store profile
- ➕ Add, edit, and remove products
- 🏷️ Update prices and stock levels in real time
- 📊 Manage incoming reservation requests from a dedicated dashboard
- 📈 View basic inventory insights (low-stock alerts, popular products)

### For Admins
- ✅ Approve or reject new retailer registrations
- 🚫 Moderate/remove listings that violate platform policy
- 📊 View basic platform usage statistics

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js (or Next.js), Tailwind CSS |
| **Backend / API** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Authentication** | JWT-based auth, optional Google OAuth |
| **Maps / Geolocation** | Google Maps API / Leaflet (OpenStreetMap) |
| **Hosting** | Vercel/Netlify (frontend), Render/Railway (backend), MongoDB Atlas |
| **Version Control** | Git & GitHub |

> Adjust this table to match your team's actual stack if it differs (e.g., Django/Flask backend or PostgreSQL database).

---

## 🏗️ Project Architecture

```
┌─────────────┐      REST API      ┌─────────────┐      Mongoose      ┌─────────────┐
│   React     │  ───────────────►  │  Express.js │  ───────────────►  │  MongoDB    │
│  Frontend   │  ◄───────────────  │   Backend   │  ◄───────────────  │  Database   │
└─────────────┘        JSON        └─────────────┘                    └─────────────┘
      │                                    │
      │                                    │
      ▼                                    ▼
 Google Maps /                        JWT Auth &
 Leaflet API                       Role-based Access
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local instance or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/localstock.git
   cd localstock
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Environment Variables

Create a `.env` file inside the `server/` directory with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
CLIENT_URL=http://localhost:3000
```

Create a `.env` file inside the `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

> ⚠️ Never commit `.env` files to version control. Make sure `.env` is listed in `.gitignore`.

### Running the App

**Start the backend server:**
```bash
cd server
npm run dev
```

**Start the frontend (in a separate terminal):**
```bash
cd client
npm run dev
```

The app should now be running at:
- Frontend → `http://localhost:3000`
- Backend API → `http://localhost:5000/api`

---

## 📁 Folder Structure

```
localstock/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API call functions
│   │   ├── context/        # Auth / global state
│   │   └── App.jsx
│   └── package.json
│
├── server/                  # Express backend
│   ├── config/              # DB connection, environment setup
│   ├── controllers/         # Request handlers
│   ├── models/              # Mongoose schemas (User, Store, Product, Reservation)
│   ├── routes/               # API route definitions
│   ├── middleware/          # Auth, error handling, validation
│   └── server.js
│
├── docs/                     # Project documentation (SRS, diagrams, etc.)
├── .gitignore
└── README.md
```

---

## 🔌 API Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new customer or retailer | Public |
| `POST` | `/api/auth/login` | Log in and receive a JWT | Public |
| `GET` | `/api/products/search` | Search products by keyword/category | Public |
| `GET` | `/api/products/:id/compare` | Compare prices across nearby stores | Public |
| `POST` | `/api/products` | Add a new product | Retailer |
| `PUT` | `/api/products/:id` | Update product price/stock | Retailer |
| `DELETE` | `/api/products/:id` | Remove a product | Retailer |
| `POST` | `/api/reservations` | Create a reservation request | Customer |
| `PUT` | `/api/reservations/:id/status` | Accept/reject/cancel a reservation | Retailer |
| `GET` | `/api/reservations/me` | View own reservation history | Customer |
| `GET` | `/api/admin/retailers/pending` | View pending retailer approvals | Admin |

> Full API documentation with request/response schemas is maintained in [`docs/API.md`](./docs/API.md).

---

## 👥 User Roles

| Role | Access Level |
|---|---|
| **Customer** | Search, compare, reserve products; manage own profile |
| **Retailer** | Manage store profile, products, stock, and reservations |
| **Admin** | Approve retailers, moderate listings, view platform stats |

---

## 🗺️ Roadmap

- [x] Requirements gathering & SRS documentation
- [x] Database schema design
- [ ] Core authentication & role-based access
- [ ] Product search & price comparison
- [ ] Reservation workflow
- [ ] Retailer dashboard
- [ ] Admin panel
- [ ] Smart search & product recommendations
- [ ] Native mobile application (future phase)

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -m "Add: your feature description"`)
4. Push to your branch (`git push origin feature/your-feature-name`)
5. Open a Pull Request

Please make sure your code follows the existing style and includes relevant tests where applicable.

---

## 👨‍💻 Team

| Name | Role |
|---|---|
| _Pingki Sarder_ | Project Lead / Full-Stack Developer |
| _Mometa Acter_ | Frontend Developer |


---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---


