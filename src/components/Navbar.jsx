import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { clearCollection } from '../redux/slices/collectionSlice';
import { toast } from 'react-toastify';
import { useState, useRef, useEffect } from 'react';
import logo from '../assets/mediasearch-logo.svg';

export default function Navbar({ collectionCount = 0 }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setShowDropdown(false);
    await dispatch(logoutUser());
    dispatch(clearCollection());
    toast.success('Logged out successfully.');
    navigate('/signin');
  };

  // Styling for links 

  // Base Styling (applicable to all links)
  const baseLinkClasses = 'h-full flex items-center text-[14px] leading-[20px] tracking-[0.01em] font-medium transition-colors pb-[2px]';

  // Active Styling (applicable to active links)
  const activeLinkClasses = 'text-text-primary border-b-2 border-accent-terracotta';

  // Inactive Styling (applicable to in-active links)
  const inactiveLinkClasses = 'text-on-surface-variant hover:text-on-surface';

  // Get user initial for avatar
  const userInitial = user?.email ? user.email[0].toUpperCase() : 'U';

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border-subtle">
      <div className="h-16 max-w-360 mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/search" className="flex items-center gap-space-sm">
          <img
            alt="MediaSearch"
            className="h-10 w-auto object-contain"
            src={logo}
          />
        </NavLink>

        {/* Right side: Nav + Avatar */}
        <div className="flex items-center gap-space-lg">
          <nav className="flex items-center gap-space-lg h-16">
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
              }
            >
              Search
            </NavLink>
            <NavLink
              to="/collection"
              className={({ isActive }) =>
                `${baseLinkClasses} gap-space-xs ${isActive ? activeLinkClasses : inactiveLinkClasses}`
              }
            >
              <span>Collection</span>
              {collectionCount > 0 && (
                <span className="text-[11px] leading-3.5 tracking-wider font-semibold bg-surface-subtle text-text-secondary px-1.5 py-0.5 rounded-full border border-border-subtle">
                  {collectionCount}
                </span>
              )}
            </NavLink>
          </nav>

          {/* Auth section */}
          {isAuthenticated ? (
            <>
              {/* Divider */}
              <div className="h-4 w-[1px] bg-border-subtle hidden sm:block" />

              {/* Avatar with dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-8 h-8 rounded-full bg-accent-terracotta flex items-center justify-center text-white text-[13px] font-semibold transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                  title={user?.email || 'Account'}
                  id="navbar-avatar"
                >
                  {userInitial}
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-surface-card rounded-xl border border-border-subtle shadow-[0_4px_16px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden animate-[fadeIn_0.15s_ease-out]">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-border-subtle">
                      <p className="text-[13px] leading-[16px] text-text-muted">Signed in as</p>
                      <p className="text-[14px] leading-[20px] font-medium text-text-primary truncate mt-0.5">
                        {user?.email}
                      </p>
                    </div>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[14px] leading-[20px] text-text-secondary hover:bg-surface-container-low transition-colors"
                      id="navbar-logout"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <NavLink
              to="/signin"
              className="px-4 py-2 bg-accent-terracotta hover:bg-accent-terracotta-hover text-white text-[13px] leading-[16px] font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Sign In
            </NavLink>
          )}
        </div>
      </div>

      {/* Fade-in animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
