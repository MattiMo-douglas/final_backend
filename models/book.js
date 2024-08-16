const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookTitle: { type: String, required: true, unique: true },
    bookAuthor: { type: String, required: true },
    description: { type: String }
});

module.exports = mongoose.model('300378822-mobolaji', bookSchema);
