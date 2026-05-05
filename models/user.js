const mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/mockmate');
const userSchema = new mongoose.Schema({
    email: String,
    password: String
    
});
module.exports = mongoose.model("User", userSchema);