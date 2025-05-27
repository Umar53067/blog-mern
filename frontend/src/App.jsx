import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserProfilePage from './pages/UserProfilePage';
import AdminPage from './pages/AdminPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import Header from './components/Header';
import Footer from './components/Footer';
import SingleBlogPage from './pages/SingleBlogPage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/admin' element={<AdminPage/>}/>
        <Route path='/profile/:id' element={<UserProfilePage/>}/>
        <Route path="/" element={<HomePage />} />
        <Route path='/createpost' element={<CreatePostPage/>} />
        <Route path='/edit-blog/:id' element={<EditPostPage/>} />
        <Route path='/blog/:id'     element={<SingleBlogPage/>}/>
        <Route path="*" element={<NotFoundPage />} /> {/* Catch-all for 404 */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
