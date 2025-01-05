const express = require('express');
const cors = require('cors');
const session = require('express-session');
const router = express.Router();

router.use(cors(
    {
        origin: 'https://threadsandco-erp-frontend.onrender.com/',
        credentials: true
    }
))

router.use(session({
    secret: 'wasssssuppp',
    resave: false,
    saveUninitialized: false,
    name: 'sessionId'
}));

router.post('/', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ msg: 'Failed to log out. Please try again.' });
            }

            // Clear the session cookie
            res.clearCookie('sessionId', { path: '/' });

            // Set cache control headers to prevent storing sensitive data
            res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.set('Pragma', 'no-cache');
            res.set('Expires', '0');

            return res.status(200).json({ msg: 'Logout successful!' });
        });
    } else {
        // Session does not exist
        return res.status(400).json({ msg: 'No active session to log out.' });
    }
});

module.exports = router;
