import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Components/App/App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './Components/Header/Header';
import { MainMenuItem, Menu } from './Components/MainMenu/Menu';
import { HomePage } from './Components/HomePage/HomePage';
import { UserLoginPage } from './Components/UserLoginPage/UserLoginPage';
import { UserRegistrationPage } from './Components/UserRegistrationPage/UserRegistrationPage';

const generateMenuItems = ():MainMenuItem[] =>{
  return[
    {text: 'Home', link: '/'},
    {text: 'Kontakt', link: '/contact'},
  ]
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Header/>
      <Menu items={generateMenuItems()}/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/user/login' element={<UserLoginPage/>}/>
        <Route path='/user/register' element={<UserRegistrationPage/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
reportWebVitals();