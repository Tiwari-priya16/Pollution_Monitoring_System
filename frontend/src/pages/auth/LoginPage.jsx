import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Leaf, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, Shield, User, Key } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError('');
    clearError();

    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success && result.user) {
      // Determine redirection according to role or previous intent
      const role = result.user.role;
      const destination =
        location.state?.from?.pathname ||
        (role === 'admin'
          ? '/admin/dashboard'
          : role === 'officer'
          ? '/officer/dashboard'
          : '/citizen/dashboard');

      navigate(destination, { replace: true });
    }
  };

  // Quick Demo Credential Helper (Convenient for evaluators)
  const setQuickCredentials = (demoRole) => {
    setFormError('');
    clearError();
    if (demoRole === 'citizen') {
      setEmail('citizen@ecowatch.org');
      setPassword('Password@123');
    } else if (demoRole === 'officer') {
      setEmail('officer@ecowatch.org');
      setPassword('Password@123');
    } else if (demoRole === 'admin') {
      setEmail('admin@ecowatch.org');
      setPassword('Password@123');
    }
  };

  const displayError = formError || error;

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2 group mb-4">
          <div className="w-10 h-10 rounded-xl bg-forest-600 flex items-center justify-center text-white shadow-md shadow-forest-600/30 group-hover:scale-105 transition-transform">
            <Leaf className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            EcoWatch <span className="text-xs uppercase px-2 py-0.5 rounded-full bg-forest-100 text-forest-700 font-semibold tracking-wider">PMS</span>
          </span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sign In to Your Account
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Enter your authorized credentials to access your dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/60 rounded-2xl border border-slate-200/90 space-y-6">
          
          {/* Error Banner */}
          {displayError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
              <span>{displayError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-forest-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-forest-500 transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-forest-600 hover:bg-forest-700 shadow-md shadow-forest-600/30 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mb-3">
              Quick Test Credentials
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setQuickCredentials('citizen')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors flex items-center justify-center gap-1"
              >
                <User className="w-3.5 h-3.5 text-forest-600" />
                Citizen
              </button>
              <button
                type="button"
                onClick={() => setQuickCredentials('officer')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-200 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors flex items-center justify-center gap-1"
              >
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                Officer
              </button>
              <button
                type="button"
                onClick={() => setQuickCredentials('admin')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-purple-50 hover:text-purple-800 hover:border-purple-200 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors flex items-center justify-center gap-1"
              >
                <Key className="w-3.5 h-3.5 text-purple-600" />
                Admin
              </button>
            </div>
          </div>

          {/* Registration Redirect */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              New to EcoWatch?{' '}
              <Link to="/register" className="font-semibold text-forest-700 hover:text-forest-800 underline">
                Create a Citizen Account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
