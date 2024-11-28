const mongoose = require('mongoose');

const Users = new mongoose.Schema({
    email: {type: String},
    password: {type: String},
    avatar: {type: String}
},{
    timeseries:true
});

module.exports = mongoose.model('user',Users);