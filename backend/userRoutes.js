const express = require('express');
const router = express.Router();
const { syncUser, getAllLogins } = require('./userController');

router.post('/sync', syncUser);
router.get('/logins', getAllLogins);

module.exports = router;

