import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createServiceClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = await createServiceClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (userId) {
        await supabase
          .from('profiles')
          .update({
            tier: 'pro',
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        // Remove watermarks from all user sites
        await supabase
          .from('sites')
          .update({ has_watermark: false })
          .eq('user_id', userId);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      if (subscription.status === 'active') {
        await supabase
          .from('profiles')
          .update({ tier: 'pro', updated_at: new Date().toISOString() })
          .eq('stripe_subscription_id', subscription.id);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await supabase
        .from('profiles')
        .update({
          tier: 'free',
          stripe_subscription_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id);

      // Add watermarks back to sites
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_subscription_id', subscription.id)
        .single();

      if (profile) {
        await supabase
          .from('sites')
          .update({ has_watermark: true })
          .eq('user_id', profile.id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
