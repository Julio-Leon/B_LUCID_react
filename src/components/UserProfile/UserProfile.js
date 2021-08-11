import React from 'react';
import { useState, useContext, useEffect } from 'react';
import UserPosts from '../UserPosts/UserPosts';
import { useCookies } from 'react-cookie';
import { useHistory, Link } from 'react-router-dom';

import { AppContext } from '../../App';
import './UserProfile.css'

function UserProfile(props) {

    const userContext = useContext(AppContext) 
    const history = useHistory()
    const [cookies, setCookie, removeCookie] = useCookies(['jwt'])

    const [startCount, setStartCount] = useState(0)
    const [userPosts, setUserPosts] = useState([])

    const getUserPosts = async () => {
        const USER_POSTS_ENDPOINT = `https://boiling-caverns-35260.herokuapp.com/posts/user/${props.match.params.username}`
        try {
            const response = await fetch(USER_POSTS_ENDPOINT)
            const data = await response.json()
            setUserPosts(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getUserPosts()
    })

    const _handleLogOut = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('id')
        userContext.setUserObj(null)
        userContext.setLoggedIn(false)
        removeCookie('jwt')
        history.push('/')
    }

    return (
        <div className='user-page flex-container'>
            <div className="user-page-header flex-container">
                <h1><Link to='/'>B-LUCID</Link>, Welcome <Link to={`/user/${userContext.userObj.username}`}>{userContext.userObj.username}</Link></h1>
                <div className='logout' onClick={_handleLogOut}>Logout</div>
            </div>
            <div className='user-posts'>
                <h1 className='username'>{props.match.params.username}</h1>
                {
                    userPosts.length > 0 && <UserPosts posts={userPosts} getPosts={getUserPosts} />
                }
            </div>
        </div>
    );
}

export default UserProfile;