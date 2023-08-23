const mongoose = require("mongoose");

const testSchema = mongoose.Schema({ image: { type: String } });

module.exports = mongoose.model("Test", testSchema);
