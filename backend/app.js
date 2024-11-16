const express = require('express');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');

const db = require('./modules/db');
const app = express();
const port = 3000;

//Import route
const loginRoutes = require('./modules/login');
const registerRouter = require('./modules/register');
const logoutRouter = require('./modules/logout');
const employeesRouter = require('./modules/employees');
const dashboardRouter = require('./modules/dashboard');
const stockRouter = require('./modules/stock');

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(session({
    secret: 'wasssssuppp',
    resave: false,
    saveUninitialized: false,
}));


// Route handlers
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/login', loginRoutes);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);
app.use('/employees', employeesRouter);
app.use('/dashboard',dashboardRouter);
app.use('/stock', stockRouter);

// Start the server
app.listen(port, () => {
    console.log(`Listening on PORT ${port}`);
});
