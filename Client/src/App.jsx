import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';

import { AuthProvider } from './context/authContext';

import ProtectedRoutes from './components/ProtectedRoutes';
import PublicRoutes from './components/PublicRoutes';
import ProductsPage from './pages/ProductsPage';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import OrderSuccess from './pages/OrderSuccess';




function App() {
  return (
        <AuthProvider>
        <CartProvider>
        <BrowserRouter>
          {/* Route guards decide whether visitors can see private or public pages. */}
          <Routes>


              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<ProtectedRoutes><Home /></ProtectedRoutes>} />
              <Route path="/login" element={<PublicRoutes><Login /></PublicRoutes>} />
              <Route path="/logout" element={<ProtectedRoutes><Logout/></ProtectedRoutes>}/>
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<ProtectedRoutes><ProductsPage/></ProtectedRoutes>}/>
              <Route path="/products/:id" element={<ProtectedRoutes><ProductDetails/></ProtectedRoutes>}/>
              <Route path="/wishlist" element={<ProtectedRoutes><Wishlist /></ProtectedRoutes>} />
              <Route path="/cart" element={<ProtectedRoutes><Cart /></ProtectedRoutes>} />
              <Route path="/checkout" element={<ProtectedRoutes><Checkout /></ProtectedRoutes>} />
              <Route path="/orders" element={<ProtectedRoutes><Orders /></ProtectedRoutes>} />
              <Route path="/orders/:id" element={<ProtectedRoutes><OrderDetails /></ProtectedRoutes>} />
              <Route path="/order-success/:id" element={<ProtectedRoutes><OrderSuccess /></ProtectedRoutes>} />

          </Routes>
        </BrowserRouter>
        </CartProvider>
        </AuthProvider>

  );
}

export default App;
