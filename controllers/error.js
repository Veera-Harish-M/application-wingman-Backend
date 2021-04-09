const Error = require('../models/error');

exports.addError = (req, res) => {
  try {
    const {
      name,
      description,
      solution,
      example,
      category,
      language,
    } = req.body;

    Error.findOne({name}).exec((err, reError) => {
      if (err)
        return res
          .status(200)
          .json({status: 'Error', message: 'Something Went Wrong'});
      if (reError) {
        return res.status(400).json({
          status: 'Error',
          message: 'Error name already exixt',
        });
      }

      const error = new Error({
        name,
        description,
        solution,
        example,
        category,
        language,
      });

      error.save(async (err, resError) => {
        if (err) {
          return res.status(401).json({
            status: 'Error',
            message: 'Error saving user in database. Try signup again',
          });
        }
        return res.json({
          status: 'Success',
          message: 'Error added Successfully',
          data: {id: resError._id},
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



exports.errorSearch = async(req, res) => {
  try {
    // create query object to hold search value and category value
    const query = {};
    const query1={};
    let errList=[];
    // assign search value to query.name
    if (req.query.search) {
      query.name = {$regex: req.query.search, $options: 'i'};
      query1.description = {$regex: req.query.search, $options: 'i'};

      await Error.find(query, (err, errors) => {
        if (err) {
          console.log(err);
          return res.status(400).json({
            status: 'Error',
            message: 'Something Went Wrong',
          });
        }
        errList=errors;
      });
      await Error.find(query1, (err, res) => {
        if (err) {
          console.log(err);
          return res.status(400).json({
            status: 'Error',
            message: 'Something Went Wrong',
          });
        }
        for (let i=0;i<res.length;i++){
            errList.push(res[i]);
        }
      });

      res.json({
        status: 'Success',
        message: 'Successfully fetched',
        data: errList,
      });
    }
  } catch (err) {
    res.json({status: 'Error', message: 'Something Went Wrong'});
  }
};


exports.getErrorByCategory = async (req, res) => {
  try {
  
    const categ=req.query.category;
    await Error.find({category: categ }).exec((err, errors) => {
      console.log("hello");
      if (err || !errors) {
        return res.status(400).json({
          status: "Error",
          message: "NO algo exist",
        });
      }

      res.json({
        status: 'Success',
        message: 'Successfully fetched',
        data: errors,
      });
    });
  } catch (err) {
    res.status(400).send({
      status: "Error",
      message: "Something Went Wrong",
    });
  }
};
 