const mongoose = require('mongoose')

mongoose.Promise = global.Promise

// mongoose.connect('mongodb://localhost:27017/time',  {useNewUrlParser: true})
mongoose.connect('mongodb://todosuser:hjk786dfg@ds131151.mlab.com:31151/todos',  {useNewUrlParser: true})

module.exports = {
    mongoose
}