'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MainContainer = function (_React$Component) {
    _inherits(MainContainer, _React$Component);

    function MainContainer() {
        _classCallCheck(this, MainContainer);

        return _possibleConstructorReturn(this, (MainContainer.__proto__ || Object.getPrototypeOf(MainContainer)).apply(this, arguments));
    }

    _createClass(MainContainer, [{
        key: 'handleLogin',
        value: function handleLogin(e) {
            e.preventDefault();

            axios.post('/login', {
                userName: e.target.elements.userName.value,
                password: e.target.elements.password.value
            }).then(function (res) {
                localStorage.setItem('token', res.data.token);
                window.location.href = '/dashboard';
            }).catch(function () {
                console.log('error');
            });
        }
    }, {
        key: 'handleRegister',
        value: function handleRegister(e) {
            e.preventDefault();

            axios.post('/register', {
                userName: e.target.elements.userName.value,
                password: e.target.elements.password.value
            }).then(function (res) {
                console.log(res.data);
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
                    'p',
                    null,
                    'login'
                ),
                React.createElement(
                    'form',
                    { onSubmit: this.handleLogin },
                    React.createElement('input', { type: 'text', name: 'userName' }),
                    React.createElement('input', { type: 'text', name: 'password' }),
                    React.createElement(
                        'button',
                        null,
                        'login'
                    )
                ),
                React.createElement(
                    'p',
                    null,
                    'sign up'
                ),
                React.createElement(
                    'form',
                    { onSubmit: this.handleRegister },
                    React.createElement('input', { type: 'text', name: 'userName' }),
                    React.createElement('input', { type: 'text', name: 'password' }),
                    React.createElement(
                        'button',
                        null,
                        'sign up'
                    )
                )
            );
        }
    }]);

    return MainContainer;
}(React.Component);

ReactDOM.render(React.createElement(MainContainer, null), document.getElementById('container'));
