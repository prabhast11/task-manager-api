
//     C:/Users/Admin/mongodb/bin/mongod.exe --dbpath=C:/Users/Admin/mongodb
const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser : true
    // useCreateIndex : true   //this has been deprecated
})








