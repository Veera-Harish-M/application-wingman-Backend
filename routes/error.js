const express = require('express');
const { addError, errorSearch,getErrorByCategory } = require('../controllers/error');

const router = express.Router();


router.post('/addError',  addError);
router.get('/getErrorSearch', errorSearch);
router.get('/getErrorByCategory', getErrorByCategory);


module.exports = router;