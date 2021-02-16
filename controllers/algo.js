const Algo = require('../models/algo');

exports.addAlgo = (req, res) => {
  try {
    const {
      name,
      description,
      code,
      timecomplexity,
      spacecomplexity,
      usage,
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
        timecomplexity,
        spacecomplexity,
        usage,
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
