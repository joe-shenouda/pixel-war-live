const express = require('express');
const Gun = require('gun');
const cors = require('cors');

// Crash reporting for debugging in the Render logs
process.on('uncaughtException', (err) => {
    console.error('CRITICAL ERROR (Uncaught Exception):', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('CRITICAL ERROR (Unhandled Rejection):', reason);
});

const app = express();
const port = process.env.PORT || 8765;

// Enable CORS so your Dreamhost frontend can connect
app.use(cors());

// Health check endpoint for Render's liveness probe
app.get('/', (req, res) => {
    res.status(200).send('Pixel War Live Relay is active.');
});

// Start the HTTP server bound to 0.0.0.0 for cloud visibility
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server is listening on port ${port}`);
});

// Initialize Gun with the server
try {
    const gun = Gun({ 
        web: server,
        file: 'radata', // Local storage folder on the server
        radisk: true    // Enable persistent storage
    });
    console.log('GunDB initialized successfully.');
} catch (e) {
    console.error('Error initializing Gun:', e);
}
