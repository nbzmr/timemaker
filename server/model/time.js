const mongoose = require('mongoose')

const Time = mongoose.model('Time', {
    startTime: {
        type: Number,
        required: true
    },
    endTime: {
        type: Number,
        required: true
    }
})

module.exports = {
    Time
}