import { useState } from 'react';
import { useLocation } from 'wouter';
import { Leaf, Eye, EyeOff, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useEcoSphere } from '@/store/EcoSphereContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();
  const { dispatch } = useEcoSphere();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response. Please ensure the backend server is running.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Incorrect email or password');
      }

      // Store in state and dispatch
      dispatch({ type: 'SET_CURRENT_USER', payload: data.user });

      // Fetch current rank to show welcome toast/banner
      const rankResponse = await fetch('/api/gamification/me/rank', {
        headers: { 'Authorization': `Bearer ${data.token}` }
      });
      if (rankResponse.ok) {
        const rankData = await rankResponse.json();
        // Create an alert notification for rank (Prompt 9)
        dispatch({
          type: 'UPDATE_SETTINGS',
          payload: {
            // We can show a toast or alert message
          }
        });
        alert(`Welcome back, ${data.user.name}! You're currently ranked #${rankData.rank} with ${rankData.xp} XP.`);
      }

      // Redirect to dashboard (Prompt 7)
      setLocation('/');
    } catch (err: any) {
      setError(err.message || 'Incorrect email or password');
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid = email.includes('@') && email.length > 5;
  const isPasswordValid = password.length >= 6;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-white p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="p-8">
          {/* Logo and Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="h-12 w-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 mb-3 animate-bounce">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-wider text-emerald-900">EcoSphere</h1>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mt-1">ESG PLATFORM</p>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Welcome back</h2>
            <p className="text-sm text-gray-500 mt-1">Sign in to your ESG dashboard</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-sm text-center font-medium animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                  email
                    ? isEmailValid
                      ? 'border-emerald-500 focus:ring-emerald-200'
                      : 'border-rose-500 focus:ring-rose-200'
                    : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'
                }`}
                placeholder="sarah.chen@ecosphere.io"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                    password
                      ? isPasswordValid
                        ? 'border-emerald-500 focus:ring-emerald-200'
                        : 'border-rose-500 focus:ring-rose-200'
                      : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={loading}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span className="text-xs font-medium text-gray-600">Remember me</span>
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-emerald-100 hover:shadow-emerald-200 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
