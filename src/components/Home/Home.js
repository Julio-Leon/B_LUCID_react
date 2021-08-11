import { useEffect, useState, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { AppContext } from '../../App';
import { useCookies } from 'react-cookie';
import { FaSearch } from 'react-icons/fa'

import './Home.css'

import { app } from '../../firebase'
import Posts from '../Posts/Posts';

const db = app.firestore()

function Home() {

    const [cookies, setCookie, removeCookie] = useCookies(['jwt'])
    const userContext = useContext(AppContext)

    console.log(userContext.userObj)

    const history = useHistory()

    const [startCount, setStartCount] = useState(0)

    const [searchedUsers, setSearchedUsers] = useState([])

    const _handleInputClick = () => {
        history.push('/upload')
    }

    const _handleLogOut = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('id')
        userContext.setUserObj(null)
        userContext.setLoggedIn(false)
        removeCookie('jwt')
        history.push('/')
    }

    const _handleSearch = e => {
        if (e.target.value === '') {
            setSearchedUsers([])
        } else {
            setSearchedUsers(
                userContext.users.filter(user => user.username.toLowerCase().includes(e.target.value.toLowerCase()))
            )
        }
    }

    return (
        <div className='home flex-container'>
            <div className="home-header flex-container">
                <h1 className='header-item flex-container'>
                    B-LUCID, Welcome <Link to={`/user/${userContext.userObj.username}`}>{userContext.userObj.username}</Link>
                </h1>
                <div className="searchbar-logout flex-container">
                    <div className="searchbar flex-container">
                        <div className="search-icon">
                            <FaSearch className='search' />
                            <label htmlFor="search"></label>
                            <input onChange={_handleSearch} type="text" id="search" placeholder='Search for player' />
                        </div>
                        {
                            searchedUsers.length > 0 && <table className="search-users flex-container">
                                <tbody className='searches'>
                                    {
                                        searchedUsers.map(user => {
                                            return(
                                                <tr key={user._id}>
                                                    <td><Link to={`/user/${user.username}`}>{user.username}</Link></td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        }
                    </div>
                    <div onClick={_handleLogOut} className="header-item logout flex-container">
                        Logout
                    </div>
                </div>
            </div>
            <div className='body flex-container'>
                <div className='bar left-bar'></div>
                <div className='bar posts'>
                    <div className="upload-bar flex-container">
                        <label htmlFor="upload-input-om"></label>
                        <input onClick={_handleInputClick} type="text" placeholder='What was your most recent play?!' name="" id="upload-input-om" />
                    </div>
                    <div className='home-posts'>
                        <Posts startCount={startCount} />
                    </div>
                </div>
                <div className='bar right-bar'></div>
            </div>
        </div>
    );
}

export default Home;