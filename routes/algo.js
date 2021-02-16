const express = require('express');
const { addAlgo } = require('../controllers/algo');

const router = express.Router();


router.post('/addAlgo',  addAlgo);
//router.post('/getAlgo', socialsignin);


module.exports = router;