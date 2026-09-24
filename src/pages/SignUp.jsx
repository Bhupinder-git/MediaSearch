import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, clearError } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import logo from '../assets/mediasearch-logo.svg';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    const result = await dispatch(signupUser({ email: email.trim(), password }));
    if (signupUser.fulfilled.match(result)) {
      toast.success('Account created! Please sign in.');
      navigate('/signin');
    } else {
      toast.error(result.payload || 'Signup failed.');
    }
  };

  return (
    <div className="min-h-screen bg-canvas-base flex items-center justify-center px-margin-mobile md:px-margin-tablet">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, var(--color-accent-terracotta) 0%, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-[420px] relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-space-xl">
          <Link to="/search" className="flex items-center gap-space-sm transition-opacity hover:opacity-80">
            <img alt="MediaSearch" className="h-12 w-auto object-contain" src={logo} />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-surface-card rounded-xl border border-border-subtle shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_24px_rgba(0,0,0,0.06)] p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-[28px] leading-[36px] font-semibold tracking-tight text-text-primary mb-2">
              Create account
            </h1>
            <p className="text-[14px] leading-[20px] text-text-secondary">
              Join MediaSearch to curate your collection
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" id="signup-form">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="block text-[13px] leading-[16px] font-medium text-text-primary">
                Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">
                  mail
                </span>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-border-subtle rounded-lg text-[14px] leading-[20px] text-text-primary placeholder:text-text-muted outline-none transition-all duration-200 focus:border-accent-terracotta focus:ring-2 focus:ring-accent-terracotta/10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="signup-password" className="block text-[13px] leading-[16px] font-medium text-text-primary">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">
                  lock
                </span>
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-11 py-3 bg-surface-container-low border border-border-subtle rounded-lg text-[14px] leading-[20px] text-text-primary placeholder:text-text-muted outline-none transition-all duration-200 focus:border-accent-terracotta focus:ring-2 focus:ring-accent-terracotta/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="signup-confirm-password" className="block text-[13px] leading-[16px] font-medium text-text-primary">
                Confirm Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">
                  lock
                </span>
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-11 py-3 bg-surface-container-low border border-border-subtle rounded-lg text-[14px] leading-[20px] text-text-primary placeholder:text-text-muted outline-none transition-all duration-200 focus:border-accent-terracotta focus:ring-2 focus:ring-accent-terracotta/10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-destructive-subtle rounded-lg border border-error/10">
                <span className="material-symbols-outlined text-error text-[16px]">error</span>
                <span className="text-[13px] leading-[16px] text-error">{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              id="signup-submit"
              className="w-full py-3 bg-accent-terracotta hover:bg-accent-terracotta-hover text-white font-medium text-[14px] leading-[20px] rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Creating account…</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border-subtle" />
            <span className="text-[12px] leading-[16px] text-text-muted font-medium uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-border-subtle" />
          </div>

          {/* Sign In link */}
          <p className="text-center text-[14px] leading-[20px] text-text-secondary">
            Already have an account?{' '}
            <Link
              to="/signin"
              className="text-accent-terracotta hover:text-accent-terracotta-hover font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-[12px] leading-[16px] text-text-muted mt-6">
          © 2026 MediaSearch · Media Discovery Platform
        </p>
      </div>
    </div>
  );
}
