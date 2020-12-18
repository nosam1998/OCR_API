const express = require('express');
const router = express.Router();
const {createWorker} = require('tesseract.js');

const db = require("../models/ocrModel")

/* Response in JSON. */
router.post('/:language/', (req, res, next) => {
    let img_path = req.body.image_url;

    if (!img_path) {
        return res.json({error: `Please use the image_url field.`});
    }

    db.findOne({url: img_path, language: req.params.language}, (err, doc) => {
        // console.log(doc)
        if (err) return res.json({error: "An error occurred while processing your image!", code: 1001});

        if (!doc) {
            const worker = createWorker({
                logger: m => console.log(m), // Add logger here
            });
            // const worker = createWorker();

            (async () => {
                await worker.load();
                await worker.loadLanguage(req.params.language);
                await worker.initialize(req.params.language);
                const {data: {text}} = await worker.recognize(img_path);
                await worker.terminate();
                // Save Image URL and Text to MongoDB
                db.create({
                    url: img_path,
                    text: text,
                    language: req.params.language
                }).catch(err => {
                    console.error(err);
                    return res.json({error: "An error occurred while processing your image!", code: 1002});
                });

                return res.json({text: text});
            })().catch(err => {
                return res.json({error: "An error occurred while processing your image!", code: 1003});
            })

        } else {
            return res.json({text: doc.text});
        }
    });
});

module.exports = router;
