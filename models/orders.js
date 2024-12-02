const mongoose = require('mongoose');

const Orders = new mongoose.Schema({
    order_code: {type:String},
    id_user: {type:mongoose.Schema.Types.ObjectId,ref: 'user'}
},{
    timestamps:true
});

module.exports = mongoose.model('order',Orders);