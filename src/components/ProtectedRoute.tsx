import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ShieldAlert, LogOut, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const location = useLocation();

  const rawAdminEmails = import.meta.env.VITE_ADMIN_EMAIL || '';
  const authorizedEmails = rawAdminEmails
    .toLowerCase()
    .split(',')
    .map((e: string) => e.trim())
    .filter(Boolean);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (err) {
        console.error('Error verifying auth session:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-6">
        <div className="space-y-4 text-center">
          <div className="w-8 h-8 border-2 border-amber-300 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-stone-400 text-xs uppercase tracking-widest">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  // Not logged in -> send to admin login
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Logged in, but verify if user email matches authorized admin
  const userEmail = (user.email || '').toLowerCase().trim();
  const isAuthorized = authorizedEmails.length === 0 || authorizedEmails.includes(userEmail);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-stone-900 border border-stone-800 p-8 rounded-lg text-center space-y-6">
          <div className="w-12 h-12 bg-red-950/60 border border-red-500/30 text-red-400 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl text-white">Access Restricted</h1>
            <p className="text-stone-400 text-sm mt-2">
              Signed in as <span className="text-stone-200 font-medium">{user.email}</span>. This account does not have studio admin permissions.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => supabase.auth.signOut()}
              className="inline-flex items-center justify-center gap-2 border border-stone-700 hover:border-stone-500 text-stone-300 px-4 py-2 text-xs uppercase tracking-widest rounded transition"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-medium px-4 py-2 text-xs uppercase tracking-widest rounded transition"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Gallery
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
