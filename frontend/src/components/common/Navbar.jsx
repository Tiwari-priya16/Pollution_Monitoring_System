import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Menu, X, Leaf, Activity, LogOut, User, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/#categories' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'Benefits', href: '/#benefits' },
    { name: 'System Status', href: '/#system-status' },
  ];

  const dashboardPath =
    user?.role === 'admin'
      ? '/admin/dashboard'
      : user?.role === 'officer'
      ? '/officer/dashboard'
      : '/citizen/dashboard';

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-forest-600 flex items-center justify-center text-white shadow-md shadow-forest-600/30 group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                EcoWatch <span className="text-xs uppercase px-2 py-0.5 rounded-full bg-forest-100 text-forest-700 font-semibold tracking-wider">PMS</span>
              </span>
              <p className="text-xs text-slate-500 font-medium">Pollution Monitoring System</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-forest-700 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Auth Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={dashboardPath}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-forest-700 bg-slate-100 hover:bg-slate-200/80 px-4 py-2 rounded-xl transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 text-forest-600" />
                  <span>Dashboard</span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                    {user?.role}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl transition-colors border border-rose-200/60"
                  title="Sign out of your session"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-forest-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-forest-600 hover:bg-forest-700 px-5 py-2.5 rounded-lg shadow-sm shadow-forest-600/30 hover:shadow-md hover:shadow-forest-600/40 transition-all transform active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-forest-50 hover:text-forest-700"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 bg-slate-50 rounded-xl flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-slate-800">{user?.name}</span>
                  <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-full bg-forest-100 text-forest-800">
                    {user?.role}
                  </span>
                </div>
                <Link
                  to={dashboardPath}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 text-sm font-semibold text-white bg-forest-600 hover:bg-forest-700 rounded-lg shadow-sm"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-2.5 px-4 text-sm font-semibold text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 text-sm font-semibold text-white bg-forest-600 hover:bg-forest-700 rounded-lg shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}


