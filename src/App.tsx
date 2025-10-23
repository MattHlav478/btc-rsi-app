import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, next) => {
      setSession(next);
      if (!next) navigate('/login');
      else if (location.pathname === '/login') navigate('/');
    });
    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center gap-4">
          <Link to="/" className="font-semibold">BTC RSI Alerts</Link>
          <nav className="ml-auto flex items-center gap-4 text-sm">
            {session ? (
              <>
                <Link to="/">Dashboard</Link>
                <Link to="/account">Account</Link>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="rounded-md border px-3 py-1 hover:bg-slate-100"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/login" className="rounded-md border px-3 py-1 hover:bg-slate-100">Sign in</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
