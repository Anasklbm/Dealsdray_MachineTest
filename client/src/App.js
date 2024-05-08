import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/JS/Login';
import Signup from './components/JS/Signup';
import Dashboard from './components/JS/Dashboard';
import Empl from './components/JS/Empl';
import Emplist from './components/JS/Emplist';

function App() {
  return (
    <>
    <Router>
        <Routes>

          <Route path="/" element={< Login/>} />
          <Route path="/signup" element={< Signup/>} />
          <Route path="/dashboard" element={< Dashboard/>} />
          <Route path="/emp" element={< Empl/>} />
          <Route path="/list" element={< Emplist/>} />

 
 
        </Routes>
      </Router>
    </> 
  );
}

export default App;
 