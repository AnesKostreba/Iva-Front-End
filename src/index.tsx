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
import { CategoryPage } from './Components/CategoryPage/CategoryPage';
import { ArticlePage } from './Components/ArticlePage/ArticlePage';
import { Footer } from './Components/Footer/Footer';
import { UserProfil } from './Components/UserProfile/UserProfile';
import { OrdersPage } from './Components/OrdersPage/OrdersPage';
import { AdministratorLoginPage } from './Components/AdministratorLoginPage/AdministratorLoginPage';
import AdministratorDashboard from './Components/AdministratorDashboard/AdministratorDashboard';
import AdministratorDashboardCategory from './Components/AdministratorDashboardCategory/AdministratorDashboardCategory';
import AdministratorDashboardFeature from './Components/AdministratorDashboardFeature/AdministratorDashboardFeature';
import AdministratorDashboardArticle from './Components/AdministratorDashboardArticle/AdministratorDashboardArticle';
import AdministratorDashboardPhoto from './Components/AdministratorDashboardPhoto/AdministratorDashboardPhoto';
import { AdministratorDashboardOrder } from './Components/AdministratorDashboardOrder/AdministratorDashboardOrder';
import { AdministratorLogoutPage } from './Components/AdministratorLogoutPage/AdministratorLogoutPage';
import { UserLogoutPage } from './Components/UserLogoutPage/UserLogoutPage';
import { ContactPage } from './Components/ContactPage/ContactPage';
import { ArticleType } from './types/ArticleType';


// const generateMenuItems = ():MainMenuItem[] =>{
//   return[
//     {text: 'Home', link: '/'},
//     {text: 'Kontakt', link: '/contact'},
//     {text: 'My Orders', link: '/user/orders/'},
//     {text: 'Administrator Login', link: '/administrator/login/'}
//   ]
// }

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter>
      <Header/>
      {/* <Menu items={generateMenuItems()}/> */}
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/user/login' element={<UserLoginPage/>}/>
        <Route path='/user/logout' element={<UserLogoutPage/>}/>
        <Route path='/user/register' element={<UserRegistrationPage/>}/>
        <Route path='/category/:id' element={<CategoryPage/>}/>
        <Route path='/article/:id' element={<ArticlePage/>}/>
        <Route path='/user/profile' element={<UserProfil/>}/>
        <Route path='/user/orders' element={<OrdersPage/>}/>
        <Route path='/contact' element={<ContactPage/>}/>
        <Route path='/administrator/login' element={<AdministratorLoginPage/>}/>
        <Route path='/administrator/logout' element={<AdministratorLogoutPage/>}/>
        <Route path='/administrator/dashboard/' element={<AdministratorDashboard/>}/>
        <Route path='/administrator/dashboard/feature/:id' element={<AdministratorDashboardFeature/>}/>
        <Route path='/administrator/dashboard/category/' element={<AdministratorDashboardCategory/>}/>
        <Route path='/administrator/dashboard/article/' element={<AdministratorDashboardArticle/>}/>
        <Route path='/administrator/dashboard/photo/:id' element={<AdministratorDashboardPhoto/>}/>
        <Route path='/administrator/dashboard/order' element={<AdministratorDashboardOrder/>}/>
        
      </Routes>
      <Footer/>
    </BrowserRouter>
      
);
reportWebVitals();