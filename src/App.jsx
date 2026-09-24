import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Search from './pages/Search';
import Collection from './pages/Collection';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import fetch functions to check
import { fetchPhotos, fetchVideos, fetchGIFs } from './services/mediaApi';
import { useEffect } from 'react';

// Protected route wrapper — redirects to signin if not authenticated
function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

// Guest route wrapper — redirects to search if already authenticated
function GuestRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/search" replace />;
  }
  return children;
}

export default function App() {
  // keeping the track of the items in the user's collection
  const collectionCount = useSelector((state) => state.collection.items.length);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  // Hide navbar on auth pages
  const isAuthPage = ['/signin', '/signup'].includes(location.pathname);

  return (
    <div className="bg-surface min-h-screen font-sans text-[14px] leading-[20px] text-on-surface antialiased">
      {!isAuthPage && <Navbar collectionCount={collectionCount} />}

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          fontFamily: 'var(--font-sans)',
          fontSize: '14px',
          borderRadius: '8px',
        }}
      />

      {/* Main content area — pushed down by fixed navbar (except on auth pages) */}
      <main className={`w-full ${!isAuthPage ? 'pt-16 min-h-[calc(100vh-64px)]' : ''}`}>
        <Routes>
          {/* Auth routes */}
          <Route path="/signin" element={<GuestRoute><SignIn /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><SignUp /></GuestRoute>} />

          {/* Protected routes */}
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/collection" element={<ProtectedRoute><Collection /></ProtectedRoute>} />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to={isAuthenticated ? '/search' : '/signin'} replace />} />
        </Routes>
      </main>

      {/* Footer — only on non-auth pages */}
      {!isAuthPage && (
        <footer className="w-full bg-surface border-t border-border-subtle py-space-xl">
          <div className="max-w-360 mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin flex flex-col md:flex-row items-center justify-between gap-space-md text-on-surface-variant text-[13px] leading-4.5">
            <div className="flex items-center gap-space-sm">
              <span className="font-medium text-text-primary">MediaSearch</span>
              <span className="text-border-strong">•</span>
              <span>Media Discovery Platform</span>
            </div>
            <div className="flex items-center gap-space-lg text-[13px] leading-[16px] font-medium">
              <span className="text-text-muted">
                © 2026 MediaSearch · All rights reserved.
              </span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}