const express = require('express');
const { addAlgo, algoSearch,getAlgoByCategory } = require('../controllers/algo');

const router = express.Router();


router.post('/addAlgo',  addAlgo);
router.get('/getAlgoSearch', algoSearch);
router.get('/getAlgoByCategory', getAlgoByCategory);



module.exports = router;