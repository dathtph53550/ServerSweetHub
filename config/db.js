const mongoose = require('mongoose');
mongoose.set('strictQuery',true);
const local = 'mongodb+srv://dathtph53550:LI7x0JUHKRbxVarK@hoangdat.hwvdf.mongodb.net/sweethub';

const connect = async () =>{
    try{
        await mongoose.connect(local);
        console.log("Connect Thanh Cong");
    }catch(error){
        console.log("Connect Khong Thanh Cong");
        console.log(error);
    }
};

module.exports = {connect};