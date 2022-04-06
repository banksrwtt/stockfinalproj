import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './page';
import Chart from './page/chart';
import SignUp from './page/auth/login';
import Register from './page/auth/register'
import Notification from './page/notification';
import Indicator from './page/indicator'
import Resetpassword from './page/auth/resetpassword';
import Navantd from './components/navbar'
import React from 'react';


function App() {
  //const { token, removeToken, setToken } = useToken();
  return (
    <div className="App" >
      <Navantd />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/chart' element={<Chart />} />
        <Route exact path='/signup' element={<SignUp />} />
        <Route exact path='/register' element={<Register />} />
        <Route exact path='/notification' element={<Notification />} />
        <Route exact path='/indicator' element={<Indicator />} />
        <Route exact path='/resetpassword' element={<Resetpassword />}/>
      </Routes>
    </div >
  );
}

export default App;
