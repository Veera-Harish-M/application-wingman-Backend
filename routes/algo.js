const express = require('express');
const { addAlgo, algoSearch } = require('../controllers/algo');

const router = express.Router();


router.post('/addAlgo',  addAlgo);
router.get('/getAlgoSearch', algoSearch);


module.exports = router;