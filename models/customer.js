let mongoose = require('mongoose');

let Customer = mongoose.model('Customer',{
    name:{
        type:String,
        require:true,
        minleangth:1,
        trim:true
    },
    address:{
        type:String,
        minleangth:2,
        require:true
    }
    
});

module.exports={Customer};