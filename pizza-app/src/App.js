import{BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import AuthContext from './store/auth-context';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Navbar from './Pages/Navbar';
import Menu from './Pages/Menu';
import Cart from './Pages/Cart';
import Order from './Pages/Order';
import { Footer } from './Components/Footer';
import { useContext } from 'react';
import { UserRoute } from './Route/Route';

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <div className="h-screen select-none">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/menu" element={<Menu />} />
          
          <Route exact path='/cart' element={
            <UserRoute>
            <Cart />
            </UserRoute>
            } />
          
          {/* <Route exact path="/cart" element={<Cart />} />  */}
          <Route exact path="/order" element={ <UserRoute>
            <Order />
            </UserRoute>} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
