import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import { createRoutesFromElements, RouterProvider, Route, createBrowserRouter, } from 'react-router-dom'
import Home from './components/Home/Home.js';
import Signup from './components/Signup/Signup.js';
import Signin from './components/Signin/Signin.js';
import SingleCourse from './components/SingleCourse/SingleCourse.js';
import Cart from './components/Cart/Cart.js';
import Search from './components/SearchPage/Search.js';
import Wishlist from './components/WishList/Wishlist.js';
import Dashboard from './components/UserDashboard/Dashboard.js';
import Success from './components/Success/Success.js';
import CreateCourse from './components/CreateCourse/CreateCourse.js';
import StartCourse from './components/StartCourse/StartCourse.js';
import VideoPage from './components/VideoPage/VideoPage.js';
import { store } from './Redux/store.js';
import { Provider } from 'react-redux';


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App />}>
            <Route path='' element={<Home />} />
            <Route path='signin' element={<Signin />} />
            <Route path='signup' element={<Signup />} />
            <Route path='course/:courseId' element={<SingleCourse />} />
            <Route path='cart' element={<Cart />} />
            <Route path='wishlist' element={<Wishlist />} />
            <Route path='search/:topic' element={<Search/>} />
            <Route path='dashboard' element={<Dashboard/>} />
            <Route path='/:courseId/Success' element={<Success/>} />
            <Route path='/CreateCourse' element={<StartCourse/>} />
            <Route path='/:courseDraftId/CreateCourse' element={<CreateCourse/>} />
            <Route path='/:courseId/video' element={<VideoPage/>} />

        </Route>
    )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
        <Provider store={store}>
            <RouterProvider router={router}>

            </RouterProvider>
        </Provider>
);
