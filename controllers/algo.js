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



exports.algoSearch = async(req, res) => {
  try {
    // create query object to hold search value and category value
    const query = {};
    const query1={};
    let alg=[];
    // assign search value to query.name
    if (req.query.search) {
      query.name = {$regex: req.query.search, $options: 'i'};
      query1.description = {$regex: req.query.search, $options: 'i'};

      await Algo.find(query, (err, algos) => {
        if (err) {
          console.log(err);
          return res.status(400).json({
            status: 'Error',
            message: 'Something Went Wrong',
          });
        }
        alg=algos;
      });
      await Algo.find(query1, (err, res) => {
        if (err) {
          console.log(err);
          return res.status(400).json({
            status: 'Error',
            message: 'Something Went Wrong',
          });
        }
        for (let i=0;i<res.length;i++){
          alg.push(res[i]);
        }
      });

      res.json({
        status: 'Success',
        message: 'Successfully fetched',
        data: alg,
      });
    }
  } catch (err) {
    res.json({status: 'Error', message: 'Something Went Wrong'});
  }
};


exports.getAlgoByCategory = async (req, res) => {
  try {
  
    const categ=req.query.category;
    await Algo.find({categ }).exec((err, algos) => {
      console.log("hello");
      if (err || !algos) {
        return res.status(400).json({
          status: "Error",
          message: "NO algo exist",
        });
      }

      res.json({
        status: 'Success',
        message: 'Successfully fetched',
        data: algos,
      });
    });
  } catch (err) {
    res.status(400).send({
      status: "Error",
      message: "Something Went Wrong",
    });
  }
};
