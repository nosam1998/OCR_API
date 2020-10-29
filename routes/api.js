const express = require('express');
const router = express.Router();
const { createWorker } = require('tesseract.js');

/* GET home page. */
router.post('/', function (req, res, next) {
  let img_path = req.body.imagePath;

  const worker = createWorker({
    logger: m => console.log(m), // Add logger here
  });

  (async () => {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(img_path);
    console.log(text);
    res.json({text: text});
    await worker.terminate();
  })();


});

module.exports = router;
