const { words } = require("lodash");
const Algo = require("../models/algo");
const Files = require("../models/file");

const { promisify } = require("util");

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

    Algo.findOne({ name }).exec((err, realgo) => {
      if (err)
        return res
          .status(200)
          .json({ status: "Error", message: "Something Went Wrong" });
      if (realgo) {
        return res.status(400).json({
          status: "Error",
          message: "Algo name already exixt",
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
            status: "Error",
            message: "Error saving user in database. Try signup again",
          });
        }
        return res.json({
          status: "Success",
          message: "Algo added Successfully",
          data: { id: resalgo._id },
        });
      });
    });
  } catch (err) {
    res.status(400).send({
      status: "Error",
      message: "Something Went Wrong",
    });
  }
};

exports.saveUserFile = (req, res) => {
  try {
    const { fileName, code, userId } = req.body;

    const file = new Files({
      fileName,
      code,
      userId,
    });

    file.save(async (err, filesaved) => {
      if (err) {
        return res.status(401).json({
          status: "Error",
          message: "Error saving user in database.",
        });
      }
      return res.json({
        status: "Success",
        message: "File Saved Successfully",
        data: { id: filesaved._id },
      });
    });
  } catch (err) {
    res.status(400).send({
      status: "Error",
      message: "Something Went Wrong",
    });
  }
};

exports.algoSearch = async (req, res) => {
  try {
    // create query object to hold search value and category value
    console.log("1");
    var result = await getAlgo(req.query.search);
    await delay(1000);
    console.log(result.length);
    console.log("2");
    res.json({
      status: "Success",
      message: "Successfully fetched",
      data: result,
    });
  } catch (err) {
    res.json({ status: "Error", message: "Something Went Wrong" });
  }
};

const delay = promisify(setTimeout);

const getAlgo = async (search) => {
  const query = {};
  const query1 = {};
  let alg = [];
  let algIds = [];

  let words = [
    "is",
    "was",
    "the",
    "me",
    "hi",
    "hello",
    "get",
    "algorithm",
    "a",
    "an",
    "bring",
    "can",
    "you",
    "bot",
    "give",
    "program",
    "code",
    "algo",
  ];
  // assign search value to query.name
  if (search) {
    var temp = search.toLowerCase().split(" ");
    console.log(search);
    await temp.forEach(async (element) => {
      tempWord = element;
      if (!(words.indexOf(tempWord) > -1)) {
        if (element.endsWith("ing")) {
          tempWord = tempWord.substring(0, element.length - 3);
        }

        if (element.endsWith("ed")) {
          tempWord = tempWord.substring(0, element.length - 2);
        }

        console.log(tempWord);
        query.name = { $regex: tempWord, $options: "i" };
        query1.description = { $regex: tempWord, $options: "i" };

        resultsFinal = [];

        await Algo.find(query, async (err, res1) => {
          if (err) {
            console.log(err);
            return res.status(400).json({
              status: "Error",
              message: "Something Went Wrong",
            });
          }
          resultsFinal = resultsFinal.concat(res1);
        });
        await Algo.find(query1, async (err2, res2) => {
          if (err2) {
            console.log(err2);
            return res2.status(400).json({
              status: "Error",
              message: "Something Went Wrong",
            });
          }

          resultsFinal = resultsFinal.concat(res2);
        });

        await resultsFinal.forEach((element2) => {
          if (!algIds.includes(JSON.stringify(element2._id))) {
            alg.push(element2);
            algIds.push(JSON.stringify(element2._id));
          }
        });
      }
    });
  }
  return alg;
};

exports.getAlgoByCategory = async (req, res) => {
  try {
    const categ = req.query.category;
    await Algo.find({ category: categ }).exec((err, algos) => {
      console.log("hello");
      if (err || !algos) {
        return res.status(400).json({
          status: "Error",
          message: "NO algo exist",
        });
      }

      res.json({
        status: "Success",
        message: "Successfully fetched",
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

exports.getSavedFiles = async (req, res) => {
  try {
    const id = req.query.id;
    await Files.find({ userId: id }).exec((err, files) => {
      console.log("hello");
      if (err || !files) {
        return res.status(400).json({
          status: "Error",
          message: "NO algo exist",
        });
      }

      res.json({
        status: "Success",
        message: "Successfully fetched",
        data: files,
      });
    });
  } catch (err) {
    res.status(400).send({
      status: "Error",
      message: "Something Went Wrong",
    });
  }
};

exports.updateFiles = (req, res) => {
  // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
  const { fileName, userId, code } = req.body;

  Files.updateOne(
    { _id: req.query.fileId },
    { $set: { code: code } },
    (err, fileSaved) => {
      if (err || !fileSaved) {
        return res.status(400).json({
          error: "file not found",
        });
      }
      res.json({ status: "success", message: "Updated Successfully" });
    }
  );
};
