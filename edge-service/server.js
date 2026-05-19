const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3005;
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';

// In-memory cache to simulate an Edge CDN
const cache = {
    products: {
        data: null,
        timestamp: null,
    }
};

// Cache duration: 15 seconds
const CACHE_TTL_MS = 15000;

app.get('/products', async (req, res) => {
    try {
        const now = Date.now();
        // Check if cache is valid
        if (cache.products.data && (now - cache.products.timestamp < CACHE_TTL_MS)) {
            console.log('⚡ [EDGE CACHE HIT] Returning products from edge cache');
            // Adding a custom header so we can verify if it came from the edge
            res.set('X-Cache', 'HIT');
            return res.json(cache.products.data);
        }

        console.log('🐢 [EDGE CACHE MISS] Fetching from main product-service...');
        const { data } = await axios.get(`${PRODUCT_SERVICE_URL}/products`);
        
        // Store in cache
        cache.products.data = data;
        cache.products.timestamp = now;

        res.set('X-Cache', 'MISS');
        return res.json(data);
    } catch (error) {
        console.error('Error fetching products from backend:', error.message);
        res.status(500).json({ message: 'Error fetching from product-service' });
    }
});

app.listen(PORT, () => {
    console.log(`🌍 Edge Service (CDN Simulator) running on port ${PORT}`);
});
