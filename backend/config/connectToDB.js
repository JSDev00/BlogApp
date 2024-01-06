const mongoose = require('mongoose');
require('dotenv').config();



module.exports = async()=>{ 
    
    try {
        await mongoose.connect(process.env.MONGODB_URL
             );
        console.log('connected to DB ^_^');
    } catch (error) {
        console.log('can not connect to DB :(',{error})
    }
}