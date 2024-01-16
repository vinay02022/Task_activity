import React from 'react';
import './App.css';
import SearchUserCards from './component/SearchUserCards';

function App() {
  return (
    <div className='user'>
    <h1 className='main-heading'>Pick Github Users</h1>
    <SearchUserCards />
    </div>
  );
}

export default App;
