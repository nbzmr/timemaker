class MainContainer extends React.Component {
    handleLogin (e) {
        e.preventDefault()
        
        axios.post('/login', {
            userName: e.target.elements.userName.value,
            password: e.target.elements.password.value
        })
        .then((res) => {
            localStorage.setItem('token', res.data.token)
            window.location.href = '/dashboard'
        })
        .catch(() => {
            console.log('error')
        })
    }

    handleRegister (e) {
        e.preventDefault()

        axios.post('/register', {
            userName: e.target.elements.userName.value,
            password: e.target.elements.password.value
        })
        .then((res) => {
            console.log(res.data)
        })
        .catch(() => {
            console.log('err')
        })
    }

    render () {
        return (
            <div>
                <p>
                    login
                </p>

                <form onSubmit={this.handleLogin}>
                    <input type='text' name='userName'>

                    </input>

                    <input type='text' name='password'>
                    
                    </input>

                    <button>
                        login
                    </button>
                </form>

                <p>
                    sign up
                </p>

                <form onSubmit={this.handleRegister}>
                    <input type='text' name='userName'>

                    </input>

                    <input type='text' name='password'>
                    
                    </input>

                    <button>
                        sign up
                    </button>
                </form>
            </div>
        )
    }
}

ReactDOM.render(<MainContainer />, document.getElementById('container'))