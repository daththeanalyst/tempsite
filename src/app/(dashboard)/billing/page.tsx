'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Check } from 'lucide-react';
import type { Profile } from '@/lib/types';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    tier: 'free',
    features: [
      'Gemini Flash AI',
      '10 site generations/month',
      'Inline text editing',
      'Tempsite watermark',
      'Auto-generated URLs',
    ],
  },
  {
    name: 'Pro',
    price: '$2.99',
    period: '/month',
    tier: 'pro',
    popular: true,
    features: [
      'Claude AI (higher quality)',
      '200 site generations/month',
      '300 AI-powered edits/month',
      'No watermark',
      'Custom URL slugs',
      'Priority support',
    ],
  },
];

export default function BillingPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
          .then(({ data: p }) => setProfile(p));
      }
    });
  }, []);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      alert('Failed to start checkout. Please try again.');
    }
    setLoading(false);
  }

  async function handleManage() {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      alert('Failed to open billing portal.');
    }
    setLoading(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Billing</h1>
      <p className="text-muted-foreground mb-8">
        {profile?.tier === 'pro'
          ? "You're on the Pro plan. Manage your subscription below."
          : 'Upgrade to Pro for better AI, more generations, and no watermark.'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        {plans.map((plan) => {
          const isCurrent = profile?.tier === plan.tier;

          return (
            <div
              key={plan.tier}
              className={`bg-white rounded-xl border-2 p-6 relative ${
                plan.popular ? 'border-primary' : 'border-transparent'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                  Popular
                </span>
              )}

              <h3 className="font-bold text-lg">{plan.name}</h3>
              <div className="mt-2 mb-6">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm">
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check
                      size={16}
                      className="text-green-500 shrink-0 mt-0.5"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <button
                  onClick={plan.tier === 'pro' ? handleManage : undefined}
                  className="w-full py-2.5 rounded-lg text-sm font-medium border bg-muted text-muted-foreground"
                  disabled={plan.tier === 'free'}
                >
                  {plan.tier === 'pro' ? 'Manage subscription' : 'Current plan'}
                </button>
              ) : plan.tier === 'pro' ? (
                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Upgrade to Pro'}
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
