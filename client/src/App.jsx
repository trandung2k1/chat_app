import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import './App.css';
const App = () => {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chats" element={<Chat />} />
            </Routes>
        </div>
    );
};

export default App;
