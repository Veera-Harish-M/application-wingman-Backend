const express = require("express");
const {
  addAlgo,
  algoSearch,
  getAlgoByCategory,
  saveUserFile,
  getSavedFiles,
  updateFiles,
} = require("../controllers/algo");

const router = express.Router();

router.post("/addAlgo", addAlgo);
router.get("/getAlgoSearch", algoSearch);
router.get("/getAlgoByCategory", getAlgoByCategory);
router.post("/saveUserFiles", saveUserFile);
router.get("/getFiles", getSavedFiles);
router.put("/updateFile", updateFiles);

module.exports = router;
