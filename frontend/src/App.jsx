import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import Products from './pages/Dashboard/Products';
import Billing from './pages/Dashboard/Billing';
import Analytics from './pages/Dashboard/Analytics';
import Orders from './pages/Dashboard/Orders';

function AppWrapper() {
  const location = useLocation();
  const hideNav = location.pathname.startsWith('/dashboard');

  return (
    <>
      {!hideNav && (
        <nav className="flex justify-center gap-6 p-4 bg-blue-50 border-b mb-6">
          <Link className="text-blue-700 font-semibold hover:underline" to="/">About</Link>
          <Link className="text-blue-700 font-semibold hover:underline" to="/contact">Contact</Link>
          <Link className="text-blue-700 font-semibold hover:underline" to="/dashboard/products">Dashboard</Link>
          <Link className="text-blue-700 font-semibold hover:underline" to="/login">Login</Link>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="products" element={<Products />} />
          <Route path="billing" element={<Billing />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
