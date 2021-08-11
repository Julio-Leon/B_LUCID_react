import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import './UserCreateForm.css'

function UserCreateForm(props) {

    const history = useHistory()

    const initialFormState = {
        username: '',
        email: '',
        password: '',
        rePassword: ''
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
        const CREATE_USER_ENDPOINT = 'https://boiling-caverns-35260.herokuapp.com/users/register'
        console.log('VALUES', values)
        try {
            const response = await fetch(CREATE_USER_ENDPOINT, {
                method: 'POST',
                body: JSON.stringify(values),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response.status === 201) {
                alert('User Created!')
                history.push('/')
            } else {
                const data = await response.json()
                console.log('FAILED', data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="user-register-bg flex-container">
            <form onSubmit={_handleSubmit} className='user-register-form flex-container'>
                <label htmlFor="username"></label>
                <input
                    type="text"
                    id='username'
                    placeholder='username'
                    value={values.username}
                    onChange={_handleChange}
                />
                <label htmlFor="email"></label>
                <input
                    type="email"
                    id='email'
                    placeholder='email'
                    value={values.email}
                    onChange={_handleChange}
                />
                <label htmlFor="password"></label>
                <input
                    type="text"
                    id='password'
                    placeholder='password'
                    value={values.password}
                    onChange={_handleChange}
                />
                <label htmlFor="rePassword"></label>
                <input
                    type="text"
                    id='rePassword'
                    placeholder='re-password'
                    value={values.rePassword}
                    onChange={_handleChange}
                />
                <input className='create-button' type="submit" value="Create" />
            </form>
        </div>
    );
}

export default UserCreateForm;