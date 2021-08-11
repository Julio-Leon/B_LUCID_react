import { useEffect, useState, createContext } from 'react';
import { useHistory, Route } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

import './App.css';

import Home from './components/Home/Home';
import Login from './components/Login/Login';
import UploadModal from './components/UploadModal/UploadModal';
import UserCreateForm from './components/UserCreateForm/UserCreateForm';
import UserProfile from './components/UserProfile/UserProfile'

export const AppContext = createContext()

function App() {

  const [userObj, setUserObj] = useState()
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('token') ? true : false)

  const [users, setUsers] = useState([])

  const getUserInfo = async () => {
    const USER_ENDPOINT = `https://boiling-caverns-35260.herokuapp.com/users/${localStorage.getItem('id')}`
    try {
        const response = await fetch(USER_ENDPOINT)
        const data = await response.json()
        setUserObj(data)
    } catch (error) {
        console.error(error)
    }
  }

  useEffect(() => {
    if (loggedIn) {
      getUserInfo()
    }
  }, [loggedIn])

  const getUsers = async () => {
    const USERS_ENDPOINT = 'http://localhost:4000/users'
    try {
      const response = await fetch(USERS_ENDPOINT)
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getUsers()
  }, [])
  
  return (
    <div className="App">
      <CookiesProvider>
        <AppContext.Provider value={{userObj, setUserObj, loggedIn, setLoggedIn, users}}>
          {
            userObj && <Route path='/user/:username' component={UserProfile} />
          }
          <Route path='/user/register' component={UserCreateForm} />
          <Route path='/upload' component={UploadModal} />
          <Route path='/login' render={() => <Login setUserObj={setUserObj} />} />
          <Route path='/home' render={() => <Home />} />
          <Route path='/' exact>
          {
            userObj ? <Home /> : <Login setUserObj={setUserObj} />
          }
          </Route>
        </AppContext.Provider>
      </CookiesProvider>
      <footer className='flex-container'>
        <a className='contact' href="mailto:julio.leon.diaz1@gmail.com">Contact</a>
        <a href="https://github.com/Julio-Leon/B_LUCID_react" target='_blank' rel='noreferrer'>Github</a>
      </footer>
    </div>
  );
}

export default App;
