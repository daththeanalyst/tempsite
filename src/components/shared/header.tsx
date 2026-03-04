'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LogOut, User, LayoutDashboard } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { User as SupaUser } from '@supabase/supabase-js';

export function Header() {
  const [user, setUser] = useState<SupaUser | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary">
          Tempsite
        </Link>

        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm px-4 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="text-sm px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
