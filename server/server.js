const express = require('express')
const bodyParser = require('body-parser')
const moment = require('moment')
const jwt = require('jsonwebtoken')

const {Time} = require('./model/time')
const {User} = require('./model/user')
const {mongoose} = require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000


app.use(bodyParser.json())

const auth = (req, res, next) => {
    const header = req.header('x-auth').toString()
    let token

    try {
        token = jwt.verify(header, 'somesalt')
    } catch (err) {
        console.log('err')
    }

    if (token) {
        User.find({
            token: token.token
        })
        .then((data) => {
            if (data.length === 0) {
                return Promise.reject()
            }

            next()
        })
        .catch(() => {
            res.status(401).send()
        })
    } else {
        res.status(401).send()
    }
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html')
})

app.post('/register', (req, res) => {
    const user = new User({
        userName: req.body.userName,
        password: req.body.password
    })

    user.save()
    .then((data) => {
        console.log(data)
    })
    .catch(() => {
        console.log('err')
    })
})

app.post('/login', (req, res) => {
    User.find({
        userName: req.body.userName,
        password: req.body.password
    })
    .then((data) => {
        if (data.length > 0) {
            const token = jwt.sign({
               _id: data[0]._id,
               userName: data[0].userName
            }, 'somesalt')

            User.update(
                {userName: data[0].userName}, 
                {token : token },
                {multi:true}, 
                function(err, numberAffected){ 
                     console.log(numberAffected)
            });

            res.send({
                token: token
            })
        } else {
            res.status(404).send()
        }
    })
    .catch(() => {
        res.send({
            err: 'error'
        })
    })
})

app.get('/dashboardAuth', auth, (req, res) => {
    res.send()
})

app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})


app.post('/record', auth, (req, res) => {
    const time = new Time(req.body)

    time.save()
    .then(() => {
        console.log('saved')

        res.send()
    })
    .catch(() => {
        console.log('error')
    })
})

app.post('/removeRecord', auth, (req, res) => {
    console.log(req.body._id)
    Time.findByIdAndRemove(req.body._id)
    .then((r) => {
        console.log(r)
        res.send()
    })
    .catch(() => {

    })
})

app.get('/pages', auth, (req, res) => {
    Time.find()
    .then((records) => {
        let days = []

        records.forEach((current) => {
            const formatedStartTime = moment(current.startTime).format('YYYY/MM/DD')

            const isExist = days.find((currentDay) => {
                return currentDay === formatedStartTime
            })
            
            if (!isExist) {
                days.push(formatedStartTime)
            }
        })

        res.send({
            days: days.length
        })
    })
    .catch(() => {
        console.log('error')
    })
})

app.post('/recordsOfDay', auth, (req, res) => {
    Time.find()
    .then((data) => {
        let records = []

        data.forEach((current) => {
            const formatedStartTime = moment(current.startTime).format('YYYY/MM/DD')

            if (formatedStartTime === req.body.date) {
                records.unshift(current)
            }
        })

        res.send({
            records
        })
    })
    .catch(() => {
        console.log('error')
    })
})

app.post('/recordsofpage', auth, (req, res) => {
    Time.find()
    .then((records) => {
        let days = []

        records.forEach((current) => {
            const formatedStartTime = moment(current.startTime).format('YYYY/MM/DD')

            const isExist = days.find((currentDay) => {
                return currentDay === formatedStartTime
            })
            
            if (!isExist) {
                days.push(formatedStartTime)
            }
        })

        const minIndex = ( req.body.pageNumber - 1 ) * 10
        const maxIndex = minIndex + 10

        let selectedDays = []

        Time.find()
        .then((items) => {
            const newDays = []

            days.forEach((current) => {
                newDays.unshift(current)
            })

            for (let i = minIndex; i < maxIndex; i++) {
                let duration = 0

                if (newDays[i]) {
                    items.forEach((current) => {
                        const currentTimeStamp = moment(current.startTime).format('YYYY/MM/DD')
                        if (newDays[i] === currentTimeStamp) {
                            const time = current.endTime - current.startTime
                            duration += time
                        }
                    })
                }
                
                selectedDays.push({
                    date: newDays[i],
                    duration
                })
            }
            
            res.send({
                list: selectedDays
            })
        })
        .catch(() => {

        })
    })
    .catch(() => {
        console.log('error')
    })
})


app.use(express.static(__dirname + '/public'))


app.get('/dynamictime/:day', (req, res) => {
    const numberOfDays = req.params.day
    
    const todayTimeStamp = moment().valueOf()
    const todayFormatedTime = moment(todayTimeStamp).format('YYYY MM DD')
    let timeStampOfStartDay = moment(todayFormatedTime).valueOf()

    let days = []

    days.push(todayFormatedTime)
    
    for (let i = 1; i < numberOfDays; i++) {
        timeStampOfStartDay -= 86400000

        days.push(moment(timeStampOfStartDay).format('YYYY MM DD'))
    }

    res.send({
        days
    })
})


app.listen(port, () => {
    console.log(`connected to port ${port}`)
})


// app.get('/time', (req, res) => {
//     const time = moment().valueOf()
//     const timeTwo = moment().valueOf()

//     const todayFormat = moment(time).format('YYYY MM DD')
//     const todayTimeStamp = moment(todayFormat).valueOf()
//     const longOfDay = moment().valueOf() - todayTimeStamp
//     const oneDayBeforeTimeStamp = todayTimeStamp - 86400000
//     const twoDayBeforeTimeStamp = todayTimeStamp - 172800000
//     const threeDayBeforeTimeStamp = todayTimeStamp - 259200000
//     const oneDayBefore = moment(oneDayBeforeTimeStamp).format('YYYY MM DD')
//     const twoDayBefore = moment(twoDayBeforeTimeStamp).format('YYYY MM DD')
//     const threeDayBefore = moment(threeDayBeforeTimeStamp).format('YYYY MM DD')

//     res.send({
//         time,
//         timeTwo,
//         some: moment(time).format('YYYY MM DD') === moment(timeTwo).format('YYYY MM DD'),
//         timeStamp: moment().valueOf(),
//         todayTimeStamp,
//         longOfDay,
//         today: moment().format('YYYY MM DD'),
//         oneDayBefore,
//         twoDayBefore,
//         threeDayBefore
//     })
// })