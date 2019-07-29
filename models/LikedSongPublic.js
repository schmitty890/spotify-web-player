var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new *Schema object
var LikedSongPublicSchema = new Schema({
    user: {
        type: String
    },
    title: {
        type: String
    },
    songID: {
        type: String
    },
    image: {
        type: String
    }
}, { timestamps: true });

// This creates our model from the above schema, using mongoose's model method
var LikedSongPublic = mongoose.model("LikedSongPublic", LikedSongPublicSchema);

// Export the Comment model
module.exports = LikedSongPublic;
