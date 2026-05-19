const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:        { type: String, required: true },
    price:       { type: Number },
    description: { type: String },
    category:    { type: String },   // used as manga genre (Shounen, Seinen, etc.)
    image:       { type: String },   // manga cover image URL
    author:      { type: String, default: 'Unknown' },
    series:      { type: String, default: '' },
    volume:      { type: Number, default: 1 },
    status:      { type: String, enum: ['Ongoing', 'Completed', 'Hiatus'], default: 'Ongoing' },
    stock:       { type: Number, default: 0 },
    isPremium:   { type: Boolean, default: false },
})

module.exports = mongoose.model('Product', productSchema);