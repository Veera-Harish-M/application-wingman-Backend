const express = require('express');
const { userById, read, update } = require('../controllers/user');
const { verifyuser } = require("../controllers/accessControl");

const router = express.Router();

router.get("/secret/:userId", (req, res) => {
    res.json({
        user: req.profile
    });
});
router.get('/user/', verifyuser, read);
router.put('/user/', verifyuser, update);
router.param('userId', userById);

module.exports = router; 