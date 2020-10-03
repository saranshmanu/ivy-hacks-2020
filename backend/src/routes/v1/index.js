const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const manufacturerRoute = require('./manufacturer.route');
const dashboardRoute = require('./dashboard.route');
const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/dashboard', dashboardRoute);
router.use('/manufacturer', manufacturerRoute);

module.exports = router;
