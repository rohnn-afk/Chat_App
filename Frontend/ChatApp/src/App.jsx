import { useEffect } from 'react'
import './App.css'
import { Routes ,Route, Navigate } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Home from './Pages/Home'
import { UserAuthStore } from './Store/UserAuthStore'
import {Loader} from "lucide-react"
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Setting from './Pages/Setting'
import Profile from './Pages/Profile'
import { Toaster } from "react-hot-toast";
import { UserThemeStore } from './Store/UserThemeStore'





function App() {

  const {authUser,checkAuth,isCheckingAuth,onlineUsers} = UserAuthStore()
  const {theme} = UserThemeStore()

  console.log(onlineUsers)
  useEffect(() => {
    checkAuth()

  }, [checkAuth])

  if(isCheckingAuth && !authUser){
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin'/>
      </div>
    )
  }


  return (
    <div data-theme={theme}>
    <Navbar/>
    <Routes>
      <Route path='/' element={authUser ? <Home/> : <Navigate to="/login"/>}/>
      <Route path='/signup' element={!authUser ? <Signup/> : <Navigate to="/"/>}/>
      <Route path='/login' element={!authUser ? <Login/> : <Navigate to="/"/> }/>
      <Route path='/setting' element={<Setting/>}/>
      <Route path='/profile' element={ authUser ? <Profile/> : <Navigate to="/login"/>}/>
    </Routes>
    <Toaster/>
   
    </div>
  )
}

export default App
