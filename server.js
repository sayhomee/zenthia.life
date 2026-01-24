const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5446;

// Admin password - stored in backend
const ADMIN_PASSWORD = 'helix@123';

// Directory where Vite builds the app
const DIST_DIR = path.join(__dirname, 'front-end', 'dist');

// Orders data file
const ORDERS_FILE = path.join(__dirname, 'orders.json');

// Session tokens (in-memory for simplicity)
const validTokens = new Set();

// Initialize or load orders data
function loadOrders() {
    try {
        if (fs.existsSync(ORDERS_FILE)) {
            const data = fs.readFileSync(ORDERS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.error('Error loading orders:', err);
    }
    return { orders: [] };
}

function saveOrders(orders) {
    try {
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    } catch (err) {
        console.error('Error saving orders:', err);
    }
}

let ordersData = loadOrders();

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Submit order
app.post('/api/orders', (req, res) => {
    try {
        const { name, email, phone, notes, items, totalItems } = req.body;

        // Validate required fields
        if (!name || !email || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Please fill in all required fields'
            });
        }

        // Create order record
        const order = {
            id: 'ORD-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase(),
            name,
            email,
            phone: phone || '',
            notes: notes || '',
            items,
            totalItems: totalItems || items.reduce((sum, item) => sum + (item.quantity || 1), 0),
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Add to orders
        ordersData.orders.unshift(order);
        saveOrders(ordersData);

        console.log(`\n🛒 New order received!`);
        console.log(`   Order ID: ${order.id}`);
        console.log(`   Customer: ${name} (${email})`);
        console.log(`   Items: ${order.totalItems}\n`);

        res.json({
            success: true,
            message: 'Order submitted successfully',
            orderId: order.id
        });

    } catch (error) {
        console.error('Error submitting order:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to submit order. Please try again.'
        });
    }
});

// Admin login
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;

    if (password === ADMIN_PASSWORD) {
        // Generate a simple token
        const token = 'token_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
        validTokens.add(token);

        // Clean up old tokens (keep only last 10)
        if (validTokens.size > 10) {
            const tokensArray = Array.from(validTokens);
            tokensArray.slice(0, tokensArray.length - 10).forEach(t => validTokens.delete(t));
        }

        console.log('✅ Admin login successful');
        res.json({ success: true, token });
    } else {
        console.log('❌ Admin login failed - invalid password');
        res.status(401).json({ success: false, error: 'Invalid password' });
    }
});

// Verify token middleware
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token || !validTokens.has(token)) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    next();
}

// Get all orders (protected)
app.get('/api/orders', verifyToken, (req, res) => {
    res.json({
        success: true,
        orders: ordersData.orders
    });
});

// Update order status (protected)
app.patch('/api/orders/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const orderIndex = ordersData.orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
        return res.status(404).json({ success: false, error: 'Order not found' });
    }

    ordersData.orders[orderIndex].status = status;
    ordersData.orders[orderIndex].updatedAt = new Date().toISOString();
    saveOrders(ordersData);

    res.json({ success: true, order: ordersData.orders[orderIndex] });
});

// Delete order (protected)
app.delete('/api/orders/:id', verifyToken, (req, res) => {
    const { id } = req.params;

    const orderIndex = ordersData.orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
        return res.status(404).json({ success: false, error: 'Order not found' });
    }

    ordersData.orders.splice(orderIndex, 1);
    saveOrders(ordersData);

    res.json({ success: true, message: 'Order deleted' });
});

// Serve admin page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Serve static files from dist directory
app.use(express.static(DIST_DIR, {
    maxAge: '1y',
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
    }
}));

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
    // Don't fallback for API routes
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'Not found' });
    }
    res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// Save orders on server shutdown
process.on('SIGINT', () => {
    console.log('\n💾 Saving orders before shutdown...');
    saveOrders(ordersData);
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n💾 Saving orders before shutdown...');
    saveOrders(ordersData);
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🍃 Zenthia.life server running`);
    console.log(`   Main site: http://localhost:${PORT}`);
    console.log(`   Admin portal: http://localhost:${PORT}/admin`);
    console.log(`   API health: http://localhost:${PORT}/api/health`);
    console.log(`\n📦 Orders loaded: ${ordersData.orders.length}\n`);
});
