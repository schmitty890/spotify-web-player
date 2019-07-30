var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new *Schema object
var LikedSongSchema = new Schema({
    user: {
        type: String
    },
    userFirstName: {
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
var LikedSong = mongoose.model("LikedSong", LikedSongSchema);

// Export the Comment model
module.exports = LikedSong;