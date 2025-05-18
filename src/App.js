import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/home_Page';
import ProductDetail from './pages/ProductPage';
import CartPage from './pages/cartPage';
import GoodsPage from './pages/goodsPage';
import WishlistPage from './pages/WishlistPage';
import Login from './pages/loginPage';
import Account from './pages/AccountPage';
import PageOverlay from './pages/components/PageOverlay';
function App() {
  return (
    <ErrorBoundary>
      <button onClick={() => { throw new Error("Test error in React"); }}>
        Crash App
      </button>

      <Router>
       
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <PageOverlay />
          <Routes>
            <Route path="/" element={
              <ErrorBoundary>
                <Home />
              </ErrorBoundary>
            } />
            <Route path="/products" element={
              <ErrorBoundary>
                <ProductDetail />
              </ErrorBoundary>
            } />
            <Route path="/cart" element={
              <ErrorBoundary>
                <CartPage />
              </ErrorBoundary>
            } />
            <Route path="/goods" element={
              <ErrorBoundary>
                <GoodsPage />
              </ErrorBoundary>
            } />
            <Route path="/wishlist" element={
              <ErrorBoundary>
                <WishlistPage />
              </ErrorBoundary>
            } />
            <Route path="/login" element={
              <ErrorBoundary>
                <Login />
              </ErrorBoundary>
            } />
            <Route path="/account" element={
              <ErrorBoundary>
                <Account />
              </ErrorBoundary>
            } />
          </Routes>
        </Box>
      </Router>
    </ErrorBoundary>
  );
}
export default App;
