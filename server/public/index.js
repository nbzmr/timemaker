'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MainContainer = function (_React$Component) {
    _inherits(MainContainer, _React$Component);

    function MainContainer(props) {
        _classCallCheck(this, MainContainer);

        var _this = _possibleConstructorReturn(this, (MainContainer.__proto__ || Object.getPrototypeOf(MainContainer)).call(this, props));

        _this.handleRecordButton = _this.handleRecordButton.bind(_this);
        _this.fetchPageRecords = _this.fetchPageRecords.bind(_this);
        _this.changePageState = _this.changePageState.bind(_this);
        _this.handlePageRecords = _this.handlePageRecords.bind(_this);
        _this.handleRecords = _this.handleRecords.bind(_this);

        _this.state = {
            startTime: '',
            endTime: '',
            recordsInPage: [],
            currentPage: 1,
            allPages: true,
            pageRecords: false
        };
        return _this;
    }

    _createClass(MainContainer, [{
        key: 'handleRecords',
        value: function handleRecords(date) {
            this.setState({
                allPages: false,
                pageRecords: date
            }, function () {});
        }
    }, {
        key: 'changePageState',
        value: function changePageState(number) {
            this.setState(function () {
                return {
                    currentPage: number
                };
            });
        }
    }, {
        key: 'fetchPageRecords',
        value: function fetchPageRecords(pageNumber) {
            var _this2 = this;

            axios({
                method: 'POST',
                headers: {
                    'x-auth': localStorage.getItem('token')
                },
                url: '/recordsofpage',
                data: {
                    pageNumber: pageNumber
                }
            })
            // axios.post('/recordsofpage', {
            //     pageNumber
            // })
            .then(function (records) {
                var recordsElement = [];

                records.data.list.forEach(function (current) {
                    if (!(current.duration === 0)) {
                        var minutes = (current.duration / 1000 / 60).toFixed(0);
                        // let minutes = 120

                        var hours = Math.floor(minutes / 60);

                        for (var i = 0; i < hours; i++) {
                            minutes -= 60;
                        }

                        if (minutes < 10) {
                            minutes = '0' + minutes;
                        }

                        var element = React.createElement(
                            'div',
                            {
                                id: 'dayDiv',
                                onClick: function onClick(e) {
                                    _this2.handleRecords(current.date);
                                }
                            },
                            React.createElement(
                                'p',
                                { id: 'currentDay' },
                                current.date
                            ),
                            React.createElement(
                                'p',
                                {
                                    id: 'dayDuration',
                                    key: current.duration
                                },
                                hours + ':' + minutes
                            )
                        );

                        recordsElement.push(element);
                    }
                });

                _this2.setState(function () {
                    return {
                        recordsInPage: recordsElement
                    };
                });
            }).catch(function () {
                console.log('errors');
            });
        }
    }, {
        key: 'handleRecordButton',
        value: function handleRecordButton(status) {
            var _this3 = this;

            if (status === 'record') {
                this.setState(function () {
                    return {
                        startTime: moment().valueOf()
                    };
                });
            } else if (status === 'submit') {
                this.setState({
                    endTime: moment().valueOf()
                }, function () {
                    axios({
                        method: 'POST',
                        headers: {
                            'x-auth': localStorage.getItem('token')
                        },
                        url: '/record',
                        data: {
                            startTime: _this3.state.startTime,
                            endTime: _this3.state.endTime
                        }
                    })
                    // axios.post('/record', {
                    //     startTime: this.state.startTime,
                    //     endTime: this.state.endTime
                    // })
                    .then(function () {
                        _this3.fetchPageRecords(_this3.state.currentPage);
                    }).catch(function () {
                        console.log('err');
                    });
                });
            }
        }
    }, {
        key: 'handlePageRecords',
        value: function handlePageRecords() {
            this.setState(function () {
                return {
                    pageRecords: false,
                    allPages: true
                };
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                this.state.allPages && React.createElement(RecordButton, {
                    handleRecordButton: this.handleRecordButton,
                    fetchPageRecords: this.fetchPageRecords
                }),
                this.state.allPages && React.createElement(Pagination, {
                    fetchPageRecords: this.fetchPageRecords,
                    recordsInPage: this.state.recordsInPage,
                    changePageState: this.changePageState
                }),
                this.state.pageRecords && React.createElement(PageRecords, {
                    handlePageRecords: this.handlePageRecords,
                    date: this.state.pageRecords
                })
            );
        }
    }]);

    return MainContainer;
}(React.Component);

var PageRecords = function (_React$Component2) {
    _inherits(PageRecords, _React$Component2);

    function PageRecords(props) {
        _classCallCheck(this, PageRecords);

        var _this4 = _possibleConstructorReturn(this, (PageRecords.__proto__ || Object.getPrototypeOf(PageRecords)).call(this, props));

        _this4.state = {
            recordsArray: []
        };
        return _this4;
    }

    _createClass(PageRecords, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.recordsOfDay();
        }
    }, {
        key: 'removeRecord',
        value: function removeRecord(_id) {
            var _this5 = this;

            axios({
                method: 'POST',
                headers: {
                    'x-auth': localStorage.getItem('token')
                },
                url: '/removeRecord',
                data: {
                    _id: _id
                }
            })
            // axios.post('/removeRecord', {
            //     _id
            // })
            .then(function () {
                _this5.recordsOfDay();
            }).catch(function () {
                console.log('error');
            });
        }
    }, {
        key: 'recordsOfDay',
        value: function recordsOfDay() {
            var _this6 = this;

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
            .then(function (data) {
                var recordsElement = [];
                console.log(data.data.records);
                data.data.records.forEach(function (current) {
                    var formatedStartTime = moment(current.startTime).format('H:mm:ss');
                    var formatedEndTime = moment(current.endTime).format('H:mm:ss');
                    var different = current.endTime - current.startTime;
                    var duration = moment.utc(different).format('H:mm:ss');

                    var element = React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'p',
                            null,
                            formatedStartTime
                        ),
                        React.createElement(
                            'p',
                            null,
                            formatedEndTime
                        ),
                        React.createElement(
                            'p',
                            null,
                            duration
                        ),
                        React.createElement(
                            'button',
                            { onClick: function onClick(e) {
                                    _this6.removeRecord(current._id);
                                } },
                            'remove'
                        )
                    );

                    recordsElement.push(element);
                });

                _this6.setState(function () {
                    return {
                        recordsArray: recordsElement
                    };
                });
            }).catch(function () {
                console.log('err');
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'button',
                    { onClick: this.props.handlePageRecords },
                    'back to days view'
                ),
                this.state.recordsArray
            );
        }
    }]);

    return PageRecords;
}(React.Component);

var RecordButton = function (_React$Component3) {
    _inherits(RecordButton, _React$Component3);

    function RecordButton(props) {
        _classCallCheck(this, RecordButton);

        var _this7 = _possibleConstructorReturn(this, (RecordButton.__proto__ || Object.getPrototypeOf(RecordButton)).call(this, props));

        _this7.state = {
            buttonStatus: 'record'
        };
        return _this7;
    }

    _createClass(RecordButton, [{
        key: 'render',
        value: function render() {
            var _this8 = this;

            return React.createElement(
                'button',
                { id: 'submitButton', onClick: function onClick(e) {
                        if (_this8.state.buttonStatus === 'record') {
                            _this8.setState(function () {
                                return {
                                    buttonStatus: 'submit'
                                };
                            });

                            _this8.props.handleRecordButton('record');
                        } else {
                            _this8.setState(function () {
                                return {
                                    buttonStatus: 'record'
                                };
                            });

                            _this8.props.handleRecordButton('submit');
                        }
                    } },
                this.state.buttonStatus === 'record' ? 'start record' : 'submit'
            );
        }
    }]);

    return RecordButton;
}(React.Component);

var Pagination = function (_React$Component4) {
    _inherits(Pagination, _React$Component4);

    function Pagination(props) {
        _classCallCheck(this, Pagination);

        var _this9 = _possibleConstructorReturn(this, (Pagination.__proto__ || Object.getPrototypeOf(Pagination)).call(this, props));

        _this9.state = {
            days: ''
        };
        return _this9;
    }

    _createClass(Pagination, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this10 = this;

            axios({
                method: 'GET',
                headers: {
                    'x-auth': localStorage.getItem('token')
                },
                url: '/pages'
            })
            // axios.get('/pages')
            .then(function (days) {
                _this10.setState({
                    days: days.data.days
                }, function () {});
            }).catch(function () {
                console.log('error');
            });

            this.props.fetchPageRecords(1);
        }
    }, {
        key: 'generatePagination',
        value: function generatePagination() {
            var _this11 = this;

            var numberOfPages = Math.ceil(this.state.days / 10);

            var pageButtons = [];

            var _loop = function _loop(i) {
                var button = React.createElement(
                    'button',
                    {
                        onClick: function onClick(e) {
                            _this11.props.fetchPageRecords(i + 1);

                            _this11.props.changePageState(i + 1);
                        } },
                    i + 1
                );

                pageButtons.push(button);
            };

            for (var i = 0; i < numberOfPages; i++) {
                _loop(i);
            }

            return pageButtons;
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'p',
                    null,
                    this.state.days
                ),
                this.props.recordsInPage,
                this.generatePagination()
            );
        }
    }]);

    return Pagination;
}(React.Component);

axios({
    method: 'GET',
    headers: {
        'x-auth': localStorage.getItem('token')
    },
    url: '/dashboardAuth'
}).then(function () {
    ReactDOM.render(React.createElement(MainContainer, null), document.getElementById('container'));
}).catch(function () {
    window.location.href = '/';
});
