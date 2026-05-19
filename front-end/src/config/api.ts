// In production, set these env vars in Vercel to your Render service URLs.
// Locally, all traffic goes through NGINX on port 80 (Docker Compose).
export const API = {
    auth:     import.meta.env.VITE_AUTH_URL     ?? 'http://localhost/api',
    products: import.meta.env.VITE_PRODUCTS_URL ?? 'http://localhost/api',
    filter:   import.meta.env.VITE_FILTER_URL   ?? 'http://localhost/api',
    orders:   import.meta.env.VITE_ORDERS_URL   ?? 'http://localhost/api',
    payments: import.meta.env.VITE_PAYMENTS_URL ?? 'http://localhost/api',
};
