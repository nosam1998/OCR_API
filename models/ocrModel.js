const mongoose = require("mongoose");
const { Schema } = mongoose;

const OCRSchema = new Schema({
    created: {
        type: Date,
        default: Date().now
    },
    url: String,
    text: String,
    language: String
});


// const Workout = mongoose.model("Workout", WorkoutSchema);

// module.exports = Workout;
module.exports = mongoose.model("ocr", OCRSchema);