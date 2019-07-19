var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new *Schema object
var FaqSchema = new Schema({
  category: String,
  questionsAndAnswers: [ {
    question: String,
    answer: String
  }],
}, { timestamps: true });

// This creates our model from the above schema, using mongoose's model method
var Faq = mongoose.model("Faq", FaqSchema);

// Export the Note model
module.exports = Faq;