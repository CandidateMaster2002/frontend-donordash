import { useState, useEffect, useRef } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { GoSignOut } from 'react-icons/go';
import donationMeterLogo from '../assets/images/donation-meter-logo.png';
import { useHeader } from '../utils/HeaderContext';
import { signoutUser, getLoggedInIdFromLocalStorage } from '../utils/services';

const HeaderLoggedIn = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { headerExtras } = useHeader();
  const closeBtnRef = useRef(null);

  const handleSignOut = () => {
    signoutUser();
    navigate('/login-page');
  };

  const toggleDropdown = () => setIsDropdownOpen((s) => !s);
  const openMobile = () => setIsMobileOpen(true);
  const closeMobile = () => setIsMobileOpen(false);

  // close mobile on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeMobile();
    };
    if (isMobileOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobileOpen]);

  // focus close button when mobile opens (simple focus-trap hint)
  useEffect(() => {
    if (isMobileOpen && closeBtnRef.current) closeBtnRef.current.focus();
  }, [isMobileOpen]);

  return (
    <>
      <div className="h-[70px] bg-gradient-to-l from-purple-600 to-blue-300 shadow-lg px-4 md:px-6 flex items-center justify-between">
        {/* Left: Logo + Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger (visible on small screens) */}
          <button
            aria-label="Open menu"
            aria-expanded={isMobileOpen}
            onClick={openMobile}
            className="md:hidden p-2 rounded-md text-white hover:bg-white/10 transition"
          >
            <FaBars className="w-5 h-5" />
          </button>

          <div
            onClick={() => navigate('/')}
            className="cursor-pointer flex items-center px-2 py-2 hover:scale-105 transition-transform duration-200"
          >
            <img
              src={donationMeterLogo}
              alt="DonationMeter Logo"
              className="h-32 sm:h-34 md:h-36 w-auto object-contain drop-shadow-md"
            />
          </div>
        </div>

        {/* Center: Page-specific navigation (hidden on mobile) */}
        <div className="flex-1 hidden md:flex justify-center">
          <div className="flex items-center gap-6 text-white font-medium">
            {headerExtras}
          </div>
        </div>

        {/* Right: Profile */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white/20 transition-all"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            <FaUserCircle className="h-6 w-6 text-white" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
              <button
                onClick={() =>
                  navigate(`/donor-profile/${getLoggedInIdFromLocalStorage()}`)
                }
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50"
              >
                Profile
              </button>

              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50"
              >
                <div className="flex items-center gap-2">
                  <GoSignOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Slide-over Drawer */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-[60] flex"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
        >
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={closeMobile}
            aria-hidden="true"
          />

          {/* Drawer panel - explicit colors for parity in light/dark */}
          <div className="relative ml-auto w-80 max-w-[85%] bg-white dark:bg-white text-gray-800 dark:text-gray-800 h-full shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-3">
                <img src={donationMeterLogo} alt="" className="h-8 w-auto" />
                <span className="font-semibold text-gray-800 dark:text-gray-800">
                  Menu
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  ref={closeBtnRef}
                  onClick={closeMobile}
                  aria-label="Close menu"
                  className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Scoped styles: hide scrollbars + force headerExtras stacking + consistent hover pill color */}
            <style>{`
        /* Hide scrollbars but keep scrolling */
        .drawer-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .drawer-scroll::-webkit-scrollbar { display: none; }

        /* Force headerExtras to stack vertically and make inner items full width */
        .drawer-header-extras { display: flex; flex-direction: column; gap: 0.5rem; }
        .drawer-header-extras .flex { flex-direction: column !important; gap: 0.5rem !important; align-items: stretch !important; }
        .drawer-header-extras .ml-8 { margin-left: 0 !important; }
        .drawer-header-extras button,
        .drawer-header-extras a { width: 100% !important; text-align: left !important; }

        /* fallback nav pill hover - use the same color in both light & dark */
        .drawer-nav-item {
          transition: background-color 150ms ease;
          border-radius: 9999px; /* pill */
        }
        .drawer-nav-item:hover {
          background: #f3f4f6; /* Tailwind gray-100 - stable across themes */
        }
      `}</style>

            <div className="p-4 drawer-scroll overflow-y-auto h-[calc(100%-64px)]">
              {headerExtras ? (
                // headerExtras forced into a single column via the .drawer-header-extras rules above
                <div className="mb-4 text-gray-800 drawer-header-extras">
                  {headerExtras}
                </div>
              ) : (
                /* Fallback: show explicit nav only when headerExtras is null */
                <nav className="flex flex-col gap-2 mb-4">
                  <NavLink
                    to="/donor-list"
                    onClick={closeMobile}
                    className="drawer-nav-item px-3 py-2 rounded-full text-gray-800 hover:bg-gray-100 w-full text-left"
                  >
                    View All Donors
                  </NavLink>

                  <NavLink
                    to="/donor-signup"
                    onClick={closeMobile}
                    className="drawer-nav-item px-3 py-2 rounded-full text-gray-800 hover:bg-gray-100 w-full text-left"
                  >
                    Add Donor
                  </NavLink>

                  <NavLink
                    to="/unapproved-donations"
                    onClick={closeMobile}
                    className="drawer-nav-item px-3 py-2 rounded-full text-gray-800 hover:bg-gray-100 w-full text-left"
                  >
                    Unapproved Donations
                  </NavLink>

                  <button
                    onClick={() =>
                      navigate(
                        `/donor-profile/${getLoggedInIdFromLocalStorage()}`
                      )
                    }
                    className="drawer-nav-item text-left px-3 py-2 rounded-full text-gray-800 hover:bg-gray-100 w-full"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      handleSignOut();
                      closeMobile();
                    }}
                    className="drawer-nav-item text-left px-3 py-2 rounded-full text-gray-800 hover:bg-gray-100 w-full"
                  >
                    Sign Out
                  </button>
                </nav>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderLoggedIn;
