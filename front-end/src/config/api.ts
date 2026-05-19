// In production, set these env vars in Vercel to your Render service URLs.
// Locally, each service runs on its own port (no NGINX needed).
export const API = {
    auth:     import.meta.env.VITE_AUTH_URL     || 'http://localhost:3001',
    products: import.meta.env.VITE_PRODUCTS_URL || 'http://localhost:3002',
    filter:   import.meta.env.VITE_FILTER_URL   || 'http://localhost:3002',
    orders:   import.meta.env.VITE_ORDERS_URL   || 'http://localhost:3003',
    payments: import.meta.env.VITE_PAYMENTS_URL  || 'http://localhost:3004',
};
