const Algo = require('../models/algo');

exports.addAlgo = (req, res) => {
  try {
    const {
      name,
      description,
      code,
      category,
      timecomplexity,
      spacecomplexity,
      usage,
      language,
    } = req.body;

    Algo.findOne({name}).exec((err, realgo) => {
      if (err)
        return res
          .status(200)
          .json({status: 'Error', message: 'Something Went Wrong'});
      if (realgo) {
        return res.status(400).json({
          status: 'Error',
          message: 'Algo name already exixt',
        });
      }

      const algo = new Algo({
        name,
        description,
        code,
        category,
        timecomplexity,
        spacecomplexity,
        usage,
        language,
      });

      algo.save(async (err, resalgo) => {
        if (err) {
          return res.status(401).json({
            status: 'Error',
            message: 'Error saving user in database. Try signup again',
          });
        }
        return res.json({
          status: 'Success',
          message: 'Algo added Successfully',
          data: {id: resalgo._id},
        });
      });
    });
  } catch (err) {
    res.status(400).send({
      status: 'Error',
      message: 'Something Went Wrong',
    });
  }
};



exports.algoSearch = (req, res) => {
  try {
    // create query object to hold search value and category value
    const query = {};
    // assign search value to query.name
    if (req.query.search) {
      query.name = {$regex: req.query.search, $options: 'i'};
      // assigne category value to query.category
      // if (req.query.category && req.query.category != 'All') {
      //     query.category = req.query.category;
      // }
      // find the product based on query object with 2 properties
      // search and category
      Algo.find(query, (err, algos) => {
        if (err) {
          return res.status(400).json({
            status: 'Error',
            message: 'Something Went Wrong',
          });
        }
        res.json({
          status: 'Success',
          message: 'Successfully fetched',
          data: algos,
        });
      });
    }
  } catch (err) {
    res.json({status: 'Error', message: 'Something Went Wrong'});
  }
};
