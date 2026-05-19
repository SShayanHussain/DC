# E-Commerce Distributed System — MERN + Microservices

## Description

A distributed e-commerce web application for an online game store. Built with the MERN stack using a microservices architecture. Each backend service is an independent Node.js/Express application with its own MongoDB database. Services communicate over REST. The frontend is deployed on Vercel; the backend services are deployed on Render.

## Architecture

```
Vercel (React Vite)
        │
        │  HTTPS
        ▼
┌────────────────────────────────────────────────────────┐
│              Render (Cloud Hosting)                    │
│                                                        │
│   auth-service     :3001  →  MongoDB auth-db          │
│   product-service  :3002  →  MongoDB product-db       │
│   order-service    :3003  →  MongoDB order-db         │
│   payment-service  :3004  →  MongoDB payment-db       │
└────────────────────────────────────────────────────────┘

Local Development: NGINX on :80 routes /api/* to each service
```

### Services

| Service | Port | Responsibility |
|---------|------|----------------|
| auth-service | 3001 | User registration, login, JWT auth |
| product-service | 3002 | Product catalog, category/price filtering |
| order-service | 3003 | Shopping cart, checkout (calls product-service + payment-service) |
| payment-service | 3004 | Simulated payment processing, payment records |

### Inter-Service Communication

- `order-service` → `GET /products/:id` on **product-service** (fetch product details for cart)
- `order-service` → `POST /payments/process` on **payment-service** (trigger payment on checkout)

---

## Local Development (Individual Services)

### 1. Set up environment variables

Copy `.env.example` to `.env` in each service folder and fill in your MongoDB Atlas URIs and JWT secret:

```bash
cp auth-service/.env.example    auth-service/.env
cp product-service/.env.example product-service/.env
cp order-service/.env.example   order-service/.env
cp payment-service/.env.example payment-service/.env
```

Each `.env` needs:
```
PORT=<service port>
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<dbname>?retryWrites=true&w=majority
ACCESS_TOKEN=<jwt_secret>          # auth-service and order-service only
ALLOWED_ORIGIN=http://localhost:5173
PRODUCT_SERVICE_URL=http://localhost:3002   # order-service only
PAYMENT_SERVICE_URL=http://localhost:3004   # order-service only
```

### 2. Install dependencies and run each service

```bash
cd auth-service && npm install && npm run dev
cd product-service && npm install && npm run dev
cd order-service && npm install && npm run dev
cd payment-service && npm install && npm run dev
```

### 3. Run the frontend

```bash
cd front-end
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Local Development with Docker Compose (Full Stack + NGINX)

```bash
# Build and start all 5 containers (nginx + 4 services)
docker compose up --build

# Check running containers
docker ps

# Test via NGINX
curl http://localhost/api/products
```

NGINX routes:
- `http://localhost/api/auth/*`     → auth-service
- `http://localhost/api/products/*` → product-service
- `http://localhost/api/filter/*`   → product-service
- `http://localhost/api/orders/*`   → order-service
- `http://localhost/api/payments/*` → payment-service

---

## Production Deployment

### Backend — Render

Deploy each service as a separate **Render Web Service** using Docker:

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. For each service, set:
   - **Root Directory:** `auth-service` (or `product-service`, etc.)
   - **Environment:** Docker
5. Add environment variables from the service's `.env.example`
6. For `order-service`, set:
   ```
   PRODUCT_SERVICE_URL=https://<your-product-service>.onrender.com
   PAYMENT_SERVICE_URL=https://<your-payment-service>.onrender.com
   ```
7. Deploy all 4 services

> Note: Render free tier cold-starts after 15 min of inactivity. First request may take ~30s.

### Frontend — Vercel

1. Import the repo in [Vercel](https://vercel.com)
2. Set **Root Directory** to `front-end`
3. Add environment variables:
   ```
   VITE_AUTH_URL=https://<your-auth-service>.onrender.com
   VITE_PRODUCTS_URL=https://<your-product-service>.onrender.com
   VITE_ORDERS_URL=https://<your-order-service>.onrender.com
   VITE_PAYMENTS_URL=https://<your-payment-service>.onrender.com
   ```
4. Deploy

Set `ALLOWED_ORIGIN` on each Render service to your Vercel deployment URL to allow CORS.

---

## Technologies

- [React Vite](https://vitejs.dev/) + TypeScript
- [Node.js](https://nodejs.org/en/) + [Express](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/)
- [NGINX](https://nginx.org/) (local reverse proxy)
- [Render](https://render.com/) (backend cloud hosting)
- [Vercel](https://vercel.com/) (frontend hosting)
- [JWT](https://jwt.io/) (authentication)
- [Axios](https://axios-http.com/) (inter-service HTTP calls)

## Contributors

- [Thomas Maged](https://github.com/Thomas-Maged)
- [Maximous Atef](https://github.com/Maxiatef)
- [Kirollos Nessim](https://github.com/KirollosNessem)
- [Ramez Hesham](https://github.com/RamezHesham)
- [Yara Wael](https://github.com/yara880)
- [Nourhane Amir](https://github.com/NourhaneAmir)