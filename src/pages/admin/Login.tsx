import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Lock, Mail, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);

  // If already logged in, redirect straight to /admin
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate('/admin', { replace: true });
      }
    });
  }, [navigate]);

  const from = (location.state as any)?.from?.pathname || '/admin';

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    if (!email || !password) {
      setErrorMessage('Please enter both your email and password.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      if (err.message?.includes('Invalid login credentials')) {
        setErrorMessage('Incorrect email or password. Please verify and try again.');
      } else {
        setErrorMessage(err.message || 'Unable to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    if (!email) {
      setErrorMessage('Please enter your email address to receive password reset instructions.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin`,
      });

      if (error) throw error;
      setResetSent(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setErrorMessage(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 hover:text-amber-300 transition mb-6 mx-auto">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Public Gallery
        </Link>
        <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/30 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-300">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-center font-serif text-3xl tracking-tight text-white">
          Artist Studio Portal
        </h2>
        <p className="mt-2 text-center text-xs uppercase tracking-widest text-stone-400">
          THEROSEPALLETTE · Content Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-stone-900 border border-stone-800/80 px-6 py-8 sm:px-10 rounded-xl shadow-2xl space-y-6">
          {!isSupabaseConfigured && (
            <div className="bg-amber-950/40 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <strong>Supabase credentials pending:</strong> Add your <code className="text-amber-300">VITE_SUPABASE_URL</code> and <code className="text-amber-300">VITE_SUPABASE_ANON_KEY</code> to your <code className="text-amber-300">.env</code> file.
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-950/50 border border-red-500/40 rounded-lg p-3 text-xs text-red-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {resetSent ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-10 h-10 bg-emerald-950/60 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-white">Password Reset Link Sent</h3>
              <p className="text-stone-300 text-xs leading-relaxed">
                We've sent instructions to <strong className="text-white">{email}</strong>. Check your inbox to set a new password.
              </p>
              <button
                type="button"
                onClick={() => {
                  setResetSent(false);
                  setIsResetMode(false);
                }}
                className="text-xs uppercase tracking-widest text-amber-300 hover:text-amber-200 underline pt-2"
              >
                Back to Sign In
              </button>
            </div>
          ) : isResetMode ? (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2">
                  Artist Account Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="artist@example.com"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-300 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-medium py-2.5 px-4 rounded-lg text-xs uppercase tracking-widest transition disabled:opacity-50"
              >
                {loading ? 'Sending link...' : 'Send Reset Link'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsResetMode(false)}
                  className="text-xs text-stone-400 hover:text-stone-200"
                >
                  Cancel and sign in
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="artist@example.com"
                    autoComplete="email"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-300 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs uppercase tracking-wider text-stone-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetMode(true);
                      setErrorMessage(null);
                    }}
                    className="text-xs text-stone-400 hover:text-amber-300 transition"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-stone-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-300 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold py-2.5 px-4 rounded-lg text-xs uppercase tracking-widest transition disabled:opacity-50 shadow-lg shadow-amber-950/20"
              >
                {loading ? 'Signing in...' : 'Sign In to Studio'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
