const express = require('express');
const router = express.Router();
const { syncUser, getAllLogins, deleteLogin, clearAllLogins } = require('./userController');

router.post('/sync', syncUser);
router.get('/logins', getAllLogins);
router.delete('/logins', clearAllLogins);
router.delete('/logins/:id', deleteLogin);

module.exports = router;


