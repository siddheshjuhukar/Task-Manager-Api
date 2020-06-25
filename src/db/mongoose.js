const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODBURL , {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
