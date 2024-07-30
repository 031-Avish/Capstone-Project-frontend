import{BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {userContext} from 'react';
import AuthContext from './store/auth-context';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Navbar from './Pages/Navbar';
import Menu from './Pages/Menu';


function App() {
  return (
    <div className="h-screen select-none">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/menu" element={<Menu />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
