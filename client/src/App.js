import './App.css';
import Header from './components/header/Header.js';
import Main from './components/main/Main.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Main />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
