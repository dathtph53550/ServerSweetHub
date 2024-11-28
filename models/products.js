
const mongoose = require('mongoose');

const Products = new mongoose.Schema({
    name: {type: String},
    price: {type: Number},
    describe: {type: String},
    status: {type: Number},
    isFavorite: {type: Boolean,default: false},
    image: {type: Array},
    quantity: {type: Number},
    id_category: {type: mongoose.Schema.Types.ObjectId, ref: 'category'}
},{
    timestamps:true
});

module.exports = mongoose.model('product',Products);
