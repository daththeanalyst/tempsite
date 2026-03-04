'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { Profile } from '@/lib/types';

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
          .then(({ data: p }) => {
            setProfile(p);
            setName(p?.display_name || '');
          });
      }
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);

    await supabase
      .from('profiles')
      .update({ display_name: name, updated_at: new Date().toISOString() })
      .eq('id', profile.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleDeleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    if (!confirm('This will permanently delete all your sites and data. Type DELETE to confirm.')) return;

    // Note: actual account deletion would require a server-side function with service role
    alert('Please contact support to delete your account.');
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-2">Settings</h1>
      <p className="text-muted-foreground mb-8">Manage your account settings.</p>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Display Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input
            type="email"
            value={profile?.email || ''}
            disabled
            className="w-full border rounded-lg px-3 py-2.5 text-sm bg-muted text-muted-foreground"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-primary text-primary-foreground rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save changes'}
        </button>
      </form>

      <hr className="my-8" />

      <div>
        <h3 className="font-medium text-destructive mb-2">Danger Zone</h3>
        <button
          onClick={handleDeleteAccount}
          className="text-sm px-4 py-2 border border-destructive/20 text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
        >
          Delete account
        </button>
      </div>
    </div>
  );
}
