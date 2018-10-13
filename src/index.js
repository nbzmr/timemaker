class MainContainer extends React.Component {
    constructor (props) {
        super(props)

        this.handleRecordButton = this.handleRecordButton.bind(this)
        this.fetchPageRecords = this.fetchPageRecords.bind(this)
        this.changePageState = this.changePageState.bind(this)
        this.handlePageRecords = this.handlePageRecords.bind(this)
        this.handleRecords = this.handleRecords.bind(this)

        this.state = {
            startTime: '',
            endTime: '',
            recordsInPage: [],
            currentPage: 1,
            allPages: true,
            pageRecords: false
        }
    }

    handleRecords (date) {
        this.setState({
            allPages: false,
            pageRecords: date
        }, () => {

        })
    }

    changePageState (number) {
        this.setState(() => ({
            currentPage: number
        }))
    }

    fetchPageRecords (pageNumber) {
        axios({
            method: 'POST',
            headers: {
                'x-auth': localStorage.getItem('token')
            },
            url: '/recordsofpage',
            data: {
                pageNumber
            }
        })
        // axios.post('/recordsofpage', {
        //     pageNumber
        // })
        .then((records) => {
            const recordsElement = []

            records.data.list.forEach((current) => {
                if (!(current.duration === 0)) {
                    let minutes = (current.duration / 1000 / 60).toFixed(0)
                    // let minutes = 120
                    
                    const hours = Math.floor((minutes / 60))
                    
                    for (let i = 0; i < hours; i++) {
                        minutes -= 60
                    }

                    if (minutes < 10) {
                        minutes = '0' + minutes
                    }
                    
                    const element = (
                        <div
                            id='dayDiv'
                            onClick={(e) => {
                                this.handleRecords(current.date)
                            }}
                        >
                            <p id='currentDay'>
                                {current.date}
                            </p>

                            <p
                                id='dayDuration'
                                key={current.duration}
                            >
                                {`${hours}:${minutes}`}
                            </p>
                        </div>
                    )

                    recordsElement.push(element)
                }
            })

            this.setState(() => ({
                recordsInPage: recordsElement
            }))
        })
        .catch(() => {
            console.log('errors')
        })
    }

    handleRecordButton (status) {
        if (status === 'record') {
            this.setState(() => ({
                startTime: moment().valueOf()
            }))
        } else if (status === 'submit') {
            this.setState({
                endTime: moment().valueOf()
            }, () => {
                axios({
                    method: 'POST',
                    headers: {
                        'x-auth': localStorage.getItem('token')
                    },
                    url: '/record',
                    data: {
                        startTime: this.state.startTime,
                        endTime: this.state.endTime
                    }
                })
                // axios.post('/record', {
                //     startTime: this.state.startTime,
                //     endTime: this.state.endTime
                // })
                .then(() => {
                    this.fetchPageRecords(this.state.currentPage)
                })
                .catch(() => {
                    console.log('err')
                })
            })
        }
    }

    handlePageRecords () {
        this.setState(() => ({
            pageRecords: false,
            allPages: true
        }))
    }

    render () {
        return (
            <div>
                {
                    (this.state.allPages) && (
                        <RecordButton
                            handleRecordButton={this.handleRecordButton}
                            fetchPageRecords={this.fetchPageRecords}
                        />
                    )
                }
                

                {
                    (this.state.allPages) && (
                        <Pagination
                            fetchPageRecords={this.fetchPageRecords}
                            recordsInPage={this.state.recordsInPage}
                            changePageState={this.changePageState}
                        />
                    )
                }

                {
                    (this.state.pageRecords) && (
                        <PageRecords
                            handlePageRecords={this.handlePageRecords}
                            date={this.state.pageRecords}
                        />
                    )
                }
            </div>
        )
    }
}

class PageRecords extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            recordsArray: []
        }
    }

    componentDidMount () {
        this.recordsOfDay()
    }

    removeRecord (_id) {
        axios({
            method: 'POST',
            headers: {
                'x-auth': localStorage.getItem('token')
            },
            url: '/removeRecord',
            data: {
                _id
            }
        })
        // axios.post('/removeRecord', {
        //     _id
        // })
        .then(() => {
            this.recordsOfDay()
        })
        .catch(() => {
            console.log('error')
        })
    }

    recordsOfDay () {
        axios({
            method: 'POST',
            headers: {
                'x-auth': localStorage.getItem('token')
            },
            url: '/recordsOfDay',
            data: {
                date: this.props.date
            }
        })
        // axios.post('/recordsOfDay', {
        //     date: this.props.date
        // })
        .then((data) => {
            const recordsElement = []
            console.log(data.data.records)
            data.data.records.forEach((current) => {
                const formatedStartTime = moment(current.startTime).format('H:mm:ss')
                const formatedEndTime = moment(current.endTime).format('H:mm:ss')
                const different = current.endTime - current.startTime
                const duration = moment.utc(different).format('H:mm:ss')
                
                const element = (
                    <div>
                        <p>
                            {formatedStartTime}
                        </p>

                        <p>
                            {formatedEndTime}
                        </p>

                        <p>
                            {duration}
                        </p>

                        <button onClick={(e) => {
                            this.removeRecord(current._id)
                        }}>
                            remove
                        </button>
                    </div>
                )

                recordsElement.push(element)
            })

            this.setState(() => ({
                recordsArray: recordsElement
            }))
        })
        .catch(() => {
            console.log('err')
        })
    }

    render () {
        return (
            <div>
                <button onClick={
                    this.props.handlePageRecords
                }>
                    back to days view
                </button>

                {
                    this.state.recordsArray
                }
            </div>
        )
    }
}

class RecordButton extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            buttonStatus: 'record'
        }
    }

    render () {
        return (
            <button id='submitButton' onClick={(e) => {
                if (this.state.buttonStatus === 'record') {
                    this.setState(() => ({
                        buttonStatus: 'submit'
                    }))

                    this.props.handleRecordButton('record')
                } else {
                    this.setState(() => ({
                        buttonStatus: 'record'
                    }))

                    this.props.handleRecordButton('submit')
                }
            }}>
                {(this.state.buttonStatus === 'record') ? 'start record' : 'submit'}
            </button>
        )
    }
}

class Pagination extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            days: '',
        }
    }

    componentDidMount () {
        axios({
            method: 'GET',
            headers: {
                'x-auth': localStorage.getItem('token')
            },
            url: '/pages'
        })
        // axios.get('/pages')
        .then((days) => {
            this.setState({
                days: days.data.days
            }, () => {

            })
        })
        .catch(() => {
            console.log('error')
        })

        this.props.fetchPageRecords(1)
    }

    generatePagination () {
        const numberOfPages = Math.ceil(this.state.days / 10)
        
        let pageButtons = []

        for (let i = 0; i < numberOfPages; i++) {
            const button = (
                <button
                    onClick={(e) => {
                        this.props.fetchPageRecords(i + 1)
                    
                        this.props.changePageState(i + 1)
                    }
                }>
                    {i + 1}
                </button>
            )

            pageButtons.push(button)
        }

        return pageButtons
    }

    render () {
        return (
            <div>
                <p>
                    {this.state.days}
                </p>

                {
                    this.props.recordsInPage
                }

                {
                    this.generatePagination()
                }
            </div>
            
        )
    }
}

axios({
    method: 'GET',
    headers: {
        'x-auth': localStorage.getItem('token')
    },
    url: '/dashboardAuth'
})
.then(() => {
    ReactDOM.render(<MainContainer />, document.getElementById('container'))
})
.catch(() => {
    window.location.href = '/'
})
