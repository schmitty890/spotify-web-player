var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new *Schema object
var PropertySchema = new Schema({
  address: {
    type: String
  },
  propertyNumber: {
    type: String
  },
  price: {
    type: String
  },
  hidden: {
    type: Boolean
  }
}, { timestamps: true });

// This creates our model from the above schema, using mongoose's model method
var Property = mongoose.model("Property", PropertySchema);

// Export the Property model
module.exports = Property;
