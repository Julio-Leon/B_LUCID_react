import React, { useState, useContext, useEffect } from 'react';
import  { useHistory, Link } from 'react-router-dom';
import { AppContext } from '../../App';
import jwt_decode from 'jwt-decode'
// import { useCookies } from 'react-cookie';
import Cookies from 'js-cookie';

// import IMG from './public/assets/img1.png'

import './Login.css'

function Login() {

    const userContext = useContext(AppContext)

    const history = useHistory()

    const initialFormState = {
        email: '',
        password: ''
    }

    const [values, setValues] = useState(initialFormState)

    const _handleChange = e => {
        setValues(prevState => {
            return {
                ...prevState,
                [e.target.id]: e.target.value
            }
        })
    }

    const _handleSubmit = async e => {
        e.preventDefault()
        const LOGIN_ENDPOINT = 'https://boiling-caverns-35260.herokuapp.com/users/login'
        try {
            const response = await fetch(LOGIN_ENDPOINT, {
                method: 'POST',
                body: JSON.stringify(values),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response.status === 200) {
                const data = await response.json()
                userContext.setLoggedIn(true)
                localStorage.setItem('token', data.token)
                localStorage.setItem('id', data.userID)
            } else {
                console.log('AUTHENTICATION FAILED')
            }
        } catch (error) {
            console.error(error)
        }
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    useEffect(() => {
        if (getCookie('jwt')) {
            console.log('HERE')
            setTimeout(() => {
                const cookiesArray = document.cookie.split(' ')
                const jwtFinal = cookiesArray[2].substring(4, cookiesArray[2].length - 1) 
                
                const decodedToken = jwt_decode(jwtFinal)
                console.log(decodedToken.data)
                
                localStorage.setItem('token', jwtFinal)
                localStorage.setItem('id', decodedToken.data._id)
                userContext.setLoggedIn(true)
            }, 1500)
        } else {
            console.log('HEREv2')
            setTimeout(() => {
                console.log(document.cookie, getCookie('jwt'))
            }, 5000)
        }
    }, [])

    return (
        <div className="login flex-container">
            <form className='login-form flex-container' onSubmit={_handleSubmit}>
                <h1>
                    Welcome to B-LUCID
                </h1>
                <label htmlFor="email"></label>
                <input
                    type="email"
                    id="email"
                    values={values.email}
                    onChange={_handleChange}
                />
                <label htmlFor="password"></label>
                <input
                    type="password"
                    id="password"
                    values={values.password}
                    onChange={_handleChange}
                />
                <input className='login-button' type="submit" value="Login" />
                <div className="register-user">
                    <Link to='/user/register'>Register</Link>
                </div>
                {/* <div className="google-btn">
                    <div className="google-icon-wrapper">
                        <img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt='google icon' />
                    </div>
                    <a href="https://boiling-caverns-35260.herokuapp.com/users/google" className="btn-text"><b>Sign in with google</b></a>
                </div> */}
                {/* <a href="http://localhost:4000/users/google"> Google Login </a> */}
                {/* <button onClick={_handleGoogleLogin}>Google Login</button> */}
            </form>
            <div className='first'></div>
            <div className='second'></div>
        </div>
    );
}

export default Login;