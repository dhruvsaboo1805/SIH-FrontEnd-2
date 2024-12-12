import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import { useState } from 'react'

function App() {

  const[isAuth , setIsAuth] = useState(true);
  const PrivateRoute = ({element}) => {
    return isAuth ? element : <Navigate to = "/login" />;
  }

  return (
    <div className='App'>
      <Routes>
        <Route path = "/" element = {<Navigate to = "/login" />} />
        <Route path = "/login" element = {<Login />} />
        <Route path = "/signup" element = {<Signup />} />
        <Route path = "/home" element = {<PrivateRoute element={<Home />}  />} />
      </Routes>
    </div>
  )
}

export default App
