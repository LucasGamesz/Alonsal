const mongoose = require("mongoose");

async function setup(uri) {
    mongoose.connect(uri);
    var database = mongoose.connection;
}

module.exports = {
    setup
}