import Link from 'next/link';
import { Header } from '@/components/shared/header';
import { Check, Sparkles, Globe, Paintbrush, Zap, MessageSquare, MousePointerClick } from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'Chat to create',
    description: 'Describe your website in plain English. Our AI builds it instantly.',
  },
  {
    icon: MousePointerClick,
    title: 'Click to edit',
    description: 'Click any text to change it. Adjust fonts, colors, and sizes like a document.',
  },
  {
    icon: Globe,
    title: 'Instant publish',
    description: 'One click to go live. Share your custom URL with anyone, anywhere.',
  },
  {
    icon: Zap,
    title: 'Lightning fast',
    description: 'From idea to live website in under 60 seconds. No coding required.',
  },
  {
    icon: Paintbrush,
    title: 'Beautiful designs',
    description: 'AI-generated responsive websites that look great on every device.',
  },
  {
    icon: Sparkles,
    title: 'AI-powered edits',
    description: 'Tell the AI what to change and watch your site transform in real-time.',
  },
];

const useCases = [
  { emoji: '🎉', label: 'Birthday parties', color: 'from-pink-500/10 to-purple-500/10' },
  { emoji: '💝', label: 'Valentine surprises', color: 'from-red-500/10 to-pink-500/10' },
  { emoji: '💼', label: 'Work events', color: 'from-blue-500/10 to-cyan-500/10' },
  { emoji: '😂', label: 'Friend roasts', color: 'from-yellow-500/10 to-orange-500/10' },
  { emoji: '🎓', label: 'Graduation parties', color: 'from-green-500/10 to-emerald-500/10' },
  { emoji: '✨', label: 'Personal pages', color: 'from-violet-500/10 to-purple-500/10' },
];

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      '10 site generations/month',
      'Inline text editing',
      'Responsive websites',
      'Instant publishing',
      'Tempsite watermark',
    ],
    cta: 'Get started free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$2.99',
    period: '/month',
    features: [
      '200 site generations/month',
      '300 AI-powered edits/month',
      'Claude AI (higher quality)',
      'No watermark',
      'Custom URL slugs',
      'Priority support',
    ],
    cta: 'Start Pro trial',
    popular: true,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-24 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
              <Sparkles size={14} />
              AI-powered website builder
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Create a website
              <br />
              <span className="text-primary">in 60 seconds</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Describe what you want, AI builds it. Click to edit, one click to publish.
              Perfect for events, valentines, friend groups, and anything you can imagine.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl text-base font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                <Zap size={18} />
                Start building - it&apos;s free
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center gap-2 border px-8 py-3.5 rounded-xl text-base font-medium hover:bg-muted transition-colors"
              >
                See how it works
              </Link>
            </div>
          </div>

          {/* Mockup */}
          <div className="mt-16 relative">
            <div className="bg-white rounded-2xl shadow-2xl border overflow-hidden">
              <div className="h-10 bg-muted/50 flex items-center gap-2 px-4 border-b">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white border rounded-lg px-4 py-1 text-xs text-muted-foreground w-64 text-center">
                    tempsite.app/s/your-site
                  </div>
                </div>
              </div>
              <div className="flex h-80 sm:h-96">
                <div className="w-80 border-r p-4 hidden sm:block">
                  <div className="space-y-3">
                    <div className="bg-primary/10 rounded-2xl rounded-br-md p-3 text-sm text-primary ml-8">
                      Make me a birthday party page for Sarah, 80s neon theme, March 15th at The Rooftop Bar
                    </div>
                    <div className="bg-muted rounded-2xl rounded-bl-md p-3 text-sm mr-8">
                      Building your 80s neon birthday site...
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-gradient-to-br from-purple-900 to-pink-600 p-8 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="text-5xl mb-4">🎉</p>
                    <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'cursive' }}>Sarah&apos;s Birthday Bash</h2>
                    <p className="text-pink-200">March 15th | The Rooftop Bar | 8PM</p>
                    <p className="mt-4 text-sm text-pink-300">Totally radical 80s theme</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-center mb-10">
            Perfect for any occasion
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {useCases.map((uc) => (
              <div
                key={uc.label}
                className={`bg-gradient-to-br ${uc.color} rounded-xl p-4 text-center border`}
              >
                <span className="text-2xl">{uc.emoji}</span>
                <p className="text-xs font-medium mt-2">{uc.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold">How it works</h2>
            <p className="text-muted-foreground mt-2">Three steps from idea to live website</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <feature.icon className="text-primary mb-4" size={28} />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold">Simple pricing</h2>
            <p className="text-muted-foreground mt-2">
              Start free, upgrade when you need more
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl p-8 relative ${
                  plan.popular
                    ? 'border-2 border-primary shadow-lg shadow-primary/10'
                    : 'border'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                    Most popular
                  </span>
                )}

                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-3 mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm"
                    >
                      <Check
                        size={16}
                        className="text-green-500 shrink-0 mt-0.5"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className={`block text-center py-3 rounded-xl text-sm font-medium transition-colors ${
                    plan.popular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border hover:bg-muted'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to build something?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join thousands of people creating instant websites for every occasion.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl text-base font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <Zap size={18} />
            Get started for free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Tempsite - Create instant websites with AI
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-foreground">
              Features
            </Link>
            <Link href="#pricing" className="hover:text-foreground">
              Pricing
            </Link>
            <Link href="/login" className="hover:text-foreground">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
